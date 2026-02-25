'use client';

import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useCallback, useContext, useState } from 'react';

import { DataContext } from '@/contexts/DataProvider';
import { mocks } from '@/mocks';
import { backendApi } from '@/services/api';

const ALL_DATASETS = Object.keys(mocks);

export const SelectMock = () => {
  const { setData, setLoading, setError, setPlaylistNames } = useContext(DataContext);
  const [selectedMocks, setSelectedMocks] = useState<string[]>(['default']);

  const fetchMockMix = useCallback(async (playlists: string[]) => {
    if (!playlists.length) return;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      playlists.forEach((p) => params.append('playlist', p));

      const res = await backendApi.get(`/mock?${params.toString()}`, {
        timeout: 100000 
      });

      if (res.status === 200 && res.data.songs) {
        setData(res.data);
        setPlaylistNames(playlists);
      } else {
        throw new Error("Invalid data format received from server.");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setError('Server timeout or calculation error. The dataset might be too large for the current server.');
    } finally {
      setLoading(false);
    }
  }, [setData, setError, setLoading, setPlaylistNames]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    let newSelection = typeof value === 'string' ? value.split(',') : value;

    const lastItem = newSelection[newSelection.length - 1];

    if (lastItem === 'default') {
      newSelection = ['default'];
    } else if (newSelection.includes('default') && newSelection.length > 1) {
      newSelection = newSelection.filter(item => item !== 'default');
    }

    if (newSelection.length === 0) newSelection = ['default'];

    setSelectedMocks(newSelection);
    fetchMockMix(newSelection);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        multiple
        value={selectedMocks}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => selected.join(', ').toUpperCase()}
      >
        {ALL_DATASETS.map((dataset) => (
          <MenuItem key={dataset} value={dataset}>
            <Checkbox checked={selectedMocks.indexOf(dataset) > -1} />
            <ListItemText primary={dataset.toUpperCase()} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};