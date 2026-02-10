'use client';
import { AppContext } from '@/contexts/AppProvider';
import { DataContext } from '@/contexts/DataProvider';
import { msToMinutes } from '@/utils';
import { Search } from '@mui/icons-material';
import { Skeleton, TextField } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import { HTMLAttributes, useContext, useEffect, useState } from 'react';

const columns: GridColDef[] = [
  {
    field: 'playlist',
    headerName: 'playlist',
    description: 'The name of the playlist containing the track.',
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'name',
    description: 'The name of the track.',
    flex: 1,
  },
  {
    field: 'duration_ms',
    headerName: 'duration',
    description: 'The duration in minutes.',
    valueFormatter: (params) => msToMinutes(params.value),
  },
  /*{
    field: 'explicit',
    headerName: 'explicit',
    description:
      'Whether or not the track has explicit lyrics ( true = yes it does; false = no it does not OR unknown).',
  },*/
  {
    field: 'artist',
    headerName: 'artist',
    description: 'The name of the primary artist.',
    flex: 1,
  },
  {
    field: 'danceability',
    headerName: 'danceability',
    description:
      'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
  },
  {
    field: 'energy',
    headerName: 'energy',
    description:
      'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
  },
  /*{
    field: 'key',
    headerName: 'key',
    description:
      'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.',
  },*/
  {
    field: 'loudness',
    headerName: 'loudness',
    description:
      'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.',
  },
  {
    field: 'speechiness',
    headerName: 'speechiness',
    description:
      'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.',
  },
  {
    field: 'acousticness',
    headerName: 'acousticness',
    description:
      'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.',
  },
  {
    field: 'instrumentalness',
    headerName: 'instrumentalness',
    description:
      'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
  },
  {
    field: 'liveness',
    headerName: 'liveness',
    description:
      'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
  },
  {
    field: 'valence',
    headerName: 'valence',
    description:
      'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
  },
  {
    field: 'tempo',
    headerName: 'tempo',
    description:
      'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
  },
];

export const DataTable = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { data, loading } = useContext(DataContext);
  const {
    selectedTracks,
    hasMoreThanOnePlaylist,
    setSelectedTracks,
    setHasMoreThanOnePlaylist,
  } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const apiRef = useGridApiRef();

  useEffect(() => {
    if (selectedTracks !== null && selectedTracks.length === 1) {
      apiRef.current.setPage(
        Math.floor((selectedTracks ? selectedTracks[0] - 1 : 0) / 5)
      );
      apiRef.current.selectRow(selectedTracks[0] as GridRowId, true, true);
    }
  }, [selectedTracks]);

  useEffect(() => {
    setHasMoreThanOnePlaylist(
      !data.songs.every((track) => track.playlist === data.songs[0].playlist)
    );
  }, [data]);

  if (loading) {
    return (
      <div className={className}>
        <Skeleton variant="rectangular" height="100%" />
      </div>
    );
  }

  const filteredRows = data.songs
    .filter(
      (row) =>
        row.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((rowDeNovo) =>
      selectedTracks !== null && selectedTracks.length > 1
        ? selectedTracks.includes(rowDeNovo.id)
        : true
    );

  return filteredRows !== undefined ? (
    <div style={{ maxWidth: '95vw', padding: 10 }} className={className}>
      <TextField
        label="Filter"
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: <Search />,
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 1 }}
      />
      <DataGrid
        apiRef={apiRef}
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onRowClick={(params) => setSelectedTracks([params.row.id])}
        hideFooterSelectedRowCount
        columnVisibilityModel={{ playlist: hasMoreThanOnePlaylist }}
        autoHeight
      />
    </div>
  ) : (
    <></>
  );
};
