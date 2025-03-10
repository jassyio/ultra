const BottomNavbar = () => {
    return (
      <div className="fixed bottom-0 w-full bg-gray-900 text-white py-2 flex justify-around">
        <button className="px-4 py-2">Chats</button>
        <button className="px-4 py-2">Updates</button>
        <button className="px-4 py-2">Communities</button>
        <button className="px-4 py-2">Calls</button>
        <button className="px-4 py-2">Settings</button>
      </div>
    );
  };
  
  export default BottomNavbar;  // ✅ Ensure default export
  