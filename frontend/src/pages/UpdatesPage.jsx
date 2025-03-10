import TopNavbar from "../components/layout/TopNavbar";
import BottomNavbar from "../components/layout/BottomNavbar";
import StatusList from "../components/updates/StatusList"; // Ensure this file exists

const UpdatesPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <TopNavbar />
      <div className="flex-1 overflow-auto mt-12">
        <StatusList />
      </div>
      <BottomNavbar />
    </div>
  );
};

export default UpdatesPage;
