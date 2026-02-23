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
  color: string;
  font: any;
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
  // BUILD NODES
  // ===========================
  const nodes: Node[] = useMemo(() => {
    if (!data?.songs) return [];

    return data.songs.map((track: any) => {
      const attributeValue = track[selectedAttribute];
      
      const attributeLabel =
        selectedAttribute +
        ': ' +
        attributeValue +
        (hasMoreThanOnePlaylist && selectedAttribute !== 'playlist'
          ? `<br>[${track.playlist}]`
          : '');

      return {
        id: track.id,
        label: String(track.id),
        title: `${track.name}<br>${attributeLabel}`,
        color: track.colors[selectedPalette][selectedAttribute],
        // Configuração individual do nó para garantir contraste
        font: {
          color: '#ffffff',
          size: 14,
          background: 'rgba(0,0,0,0.45)', // Fundo escuro atrás do número
          padding: 2,
        }
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
        opacity: !selectedTracks || selectedTracks.includes(n.id) ? 1 : 0.3,
      })),
      edges: filteredEdges,
    };
  }, [nodes, filteredEdges, selectedTracks]);

  // ===========================
  // EVENTS
  // ===========================
  const events = {
    select: (event: any) => {
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
  // OPTIONS (Solução 2 aplicada aqui)
  // ===========================
  const options = {
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    physics: {
      enabled: false, // Mantém o layout fixo baseado nos seus arquivos .ts
    },
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        face: 'Arial',
      }
    },
    edges: {
      color: {
        color: '#2b7ce9',
        highlight: '#52ff52', // Correção da sintaxe do highlight
        hover: '#2b7ce9'
      },
      arrows: {
        to: false,
        from: false,
      },
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
    }
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