import { useTheme } from "@mui/material";

const VoiceCall = () => {
  const theme = useTheme();
  return (
    <div style={{ minHeight: '100vh', background: theme.palette.primary.gradient, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Voice Call Screen</h2>
    </div>
  );
};

export default VoiceCall;
