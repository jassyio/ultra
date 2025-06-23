import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../groups/CreateGroupModal";
import groupService from "../../api/groupService";

const CreateGroupPage = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate("/chat"); // Go to chat page

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await groupService.createGroup(groupData);
      // If using axios, response.data is the group object
      const newGroup = response.data ? response.data : response;
      navigate(`/groups/${newGroup._id}`);
    } catch (err) {
      alert("Failed to create group");
      handleClose();
    }
    return true;
  };

  return (
    <CreateGroupModal
      isOpen={true}
      onClose={handleClose}
      onCreateGroup={handleCreateGroup}
    />
  );
};

export default CreateGroupPage;

