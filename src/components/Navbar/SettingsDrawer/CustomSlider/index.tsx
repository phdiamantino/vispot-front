'use client';

import Slider from '@mui/material/Slider';
import { useEffect, useState } from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (_: Event, newValue: number | number[]) => void;
}

export default function CustomSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: CustomSliderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ marginBottom: '16px' }}>
      <h5>{label}</h5>

      {mounted ? (
        <Slider
          aria-label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          valueLabelDisplay="auto"
        />
      ) : (
        <div style={{ height: '2px', background: '#ccc', margin: '13px 0' }} />
      )}
    </div>
  );
}