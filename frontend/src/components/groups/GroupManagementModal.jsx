import { Dialog, Box, Tabs, Tab, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddGroupMemberModal from "./AddGroupMemberModal";
import GroupInfo from "./GroupInfo";
import { useState } from "react";

const GroupManagementModal = ({ open, onClose, group }) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 2, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Members" />
          <Tab label="Add Member" />
          <Tab label="Info" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tab === 0 && <GroupInfo group={group} />}
          {tab === 1 && (
            <AddGroupMemberModal
              groupId={group._id}
              onClose={onClose}
              onMemberAdded={onClose}
            />
          )}
          {tab === 2 && (
            <Typography variant="body2" sx={{ p: 2 }}>
              {/* Add more group info here */}
              Group created: {group.createdAt}
            </Typography>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default GroupManagementModal;