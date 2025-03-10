import CommunityList from "../components/communities/CommunityList"; // ✅ Now this file exists
import BottomNavbar from "../components/layout/BottomNavbar";

const CommunitiesPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <CommunityList />
      </div>
      <BottomNavbar />
    </div>
  );
};

export default CommunitiesPage;
