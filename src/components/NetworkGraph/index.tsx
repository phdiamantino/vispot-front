//@ts-nocheck
import { AppContext } from '@/contexts/AppProvider';
import { DataContext } from '@/contexts/DataProvider';
import { Skeleton } from '@mui/material';
import { useContext, useMemo, useRef } from 'react';
import Graph from 'react-vis-graph-wrapper';

type Node = {
  id: string | number;
  label: string;
  title: string;
  color: any;
  font?: any;
};

type Edge = {
  from: string | number;
  to: string | number;
  title: string;
};

export const NetworkGraph = () => {
  const { data, loading } = useContext(DataContext);
  const {
    selectedTracks,
    setSelectedTracks,
    correlationRange,
    selectedPalette,
    selectedAttribute,
    hasMoreThanOnePlaylist,
  } = useContext(AppContext);

  const networkRef = useRef<any>(null);

  // ===========================
  // COLOR UTILS (CONTRAST)
  // ===========================

  const getContrastColor = (hexColor: string) => {
    if (!hexColor) return '#000';

    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // ===========================
  // BUILD NODES
  // ===========================

  const nodes: Node[] = useMemo(() => {
    if (!data?.songs) return [];

    return data.songs.map((track: any) => {
      const nodeColor =
        track.colors[selectedPalette][selectedAttribute];

      const attributeLabel =
        selectedAttribute +
        ': ' +
        track[selectedAttribute] +
        (hasMoreThanOnePlaylist && selectedAttribute !== 'playlist'
          ? `<br>[${track.playlist}]`
          : '');

      return {
        id: track.id,
        label: String(track.id),
        title: `${track.name}<br>${attributeLabel}`,
        color: {
          background: nodeColor,
          border: '#222',
          highlight: {
            background: nodeColor,
            border: '#000',
          },
        },
        font: {
          color: getContrastColor(nodeColor),
          size: 14,
          bold: true,
        },
      };
    });
  }, [data, selectedAttribute, selectedPalette, hasMoreThanOnePlaylist]);

  // ===========================
  // BUILD EDGES
  // ===========================

  const edges: Edge[] = useMemo(() => {
    if (!data?.correlation || !nodes.length) return [];

    const result: Edge[] = [];

    data.songs.forEach((trackA: any, i: number) => {
      data.songs.forEach((trackB: any, j: number) => {
        if (j <= i) return;

        const value = data.correlation[i][j];

        result.push({
          from: trackA.id,
          to: trackB.id,
          title: value.toFixed(3),
        });
      });
    });

    return result;
  }, [data, nodes]);

  // ===========================
  // FILTER EDGES
  // ===========================

  const filteredEdges = useMemo(() => {
    if (!edges.length) return [];

    const min = correlationRange[0] / 10;
    const max = correlationRange[1] / 10;

    return edges.filter((e) => {
      const val = parseFloat(e.title);
      return val >= min && val <= max;
    });
  }, [edges, correlationRange]);

  // ===========================
  // GRAPH DATA
  // ===========================

  const graph = useMemo(() => {
    if (!nodes.length) return { nodes: [], edges: [] };

    return {
      nodes: nodes.map((n) => ({
        ...n,
        opacity:
          !selectedTracks || selectedTracks.includes(n.id)
            ? 1
            : 0.3,
      })),
      edges: filteredEdges,
    };
  }, [nodes, filteredEdges, selectedTracks]);

  // ===========================
  // EVENTS
  // ===========================

  const events = {
    select: (event) => {
      const { nodes } = event;
      if (nodes.length) {
        setSelectedTracks([nodes[0]]);
      }
    },
    doubleClick: () => {
      if (networkRef.current) {
        networkRef.current.fit();
      }
    },
  };

  // ===========================
  // OPTIONS
  // ===========================

  const options = {
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    physics: {
      enabled: false,
    },
    edges: {
      color: 'blue',
      highlight: 'green',
      arrows: {
        to: false,
        from: false,
      },
    },
  };

  // ===========================
  // LOADING
  // ===========================

  if (loading) {
    return <Skeleton variant="circular" height="100%" />;
  }

  // ===========================
  // RENDER
  // ===========================

  return (
    <div style={{ height: 510 }}>
      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={(network) => (networkRef.current = network)}
      />
    </div>
  );
};