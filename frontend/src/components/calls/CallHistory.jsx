import { useTheme } from "@mui/material";

const CallHistory = () => {
    const theme = useTheme();
    return (
      <div style={{ minHeight: '100vh', background: theme.palette.primary.gradient, color: 'white' }} className="p-4">
        <h2 className="text-lg font-bold">Call History</h2>
        {/* Add call history items here */}
      </div>
    );
  };
  
  export default CallHistory; // ✅ Ensure this is present
  