import { CorrelationSlider } from '@/components/Navbar/SettingsDrawer/CorrelationSlider';
import { SelectColor } from '@/components/Navbar/SettingsDrawer/SelectColor';
import { SelectMock } from '@/components/Navbar/SettingsDrawer/SelectMock';
import { SelectPalette } from '@/components/Navbar/SettingsDrawer/SelectPalette';
import { Chip, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import { ResetButton } from '../ResetButton';
//import { AddPlaylist } from './AddPlaylist';
import { EdgeBundlingSettings } from './EdgeBundlingSettings';
import styles from './styles.module.css';

interface CustomDividerProps {
  children: ReactNode;
}
const CustomDivider = ({ children }: CustomDividerProps) => {
  return (
    <Divider textAlign="left" sx={{ marginTop: 2, marginBottom: 2 }}>
      <Chip label={children} />
    </Divider>
  );
};

const list = () => (
  <Box role="presentation" className={styles.box}>
    <CustomDivider>DATABASE</CustomDivider>
    <div className={styles.settingsItem}>
      <h5>Dataset</h5>
      <SelectMock />
    </div>

    <CustomDivider>VISUAL ATTRIBUTES</CustomDivider>
    <div className={styles.settingsItem}>
      <h5>Color by</h5>
      <SelectColor />
    </div>
    <div className={styles.settingsItem}>
      <SelectPalette />
    </div>
    <div className={styles.settingsItem}>
      <h5>Correlation</h5>
      <CorrelationSlider />
    </div>

    <CustomDivider>EDGE BUNDLING</CustomDivider>
    <EdgeBundlingSettings />
    <ResetButton variant="contained" color="primary" fullWidth={true} />
  </Box>
);

export const SettingsDrawer = () => {
  return list();
};
