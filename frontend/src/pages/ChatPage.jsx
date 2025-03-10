import BottomNavbar from "../components/layout/BottomNavbar";

const ChatPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        {/* Your chat content here */}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default ChatPage;
