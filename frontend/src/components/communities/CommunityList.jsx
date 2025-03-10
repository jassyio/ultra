const CommunityList = () => {
    const communities = [
      { id: 1, name: "Tech Enthusiasts", members: 1200 },
      { id: 2, name: "React Developers", members: 850 },
      { id: 3, name: "Football Fans", members: 1500 },
    ];
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Communities</h2>
        <ul className="space-y-3">
          {communities.map((community) => (
            <li key={community.id} className="p-3 bg-gray-100 rounded-md shadow-md">
              <p className="font-medium">{community.name}</p>
              <span className="text-sm text-gray-600">{community.members} members</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default CommunityList; // ✅ Ensure correct default export
  