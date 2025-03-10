const StatusList = () => {
    const statusUpdates = [
      { id: 1, name: "John Doe", message: "Enjoying the weekend! 🌴", time: "2h ago" },
      { id: 2, name: "Jane Smith", message: "Just finished a great book! 📚", time: "5h ago" },
      { id: 3, name: "Mike Ross", message: "What a game! ⚽🔥", time: "10h ago" },
    ];
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
        <ul className="space-y-3">
          {statusUpdates.map((status) => (
            <li key={status.id} className="p-3 bg-gray-100 rounded-md shadow-md">
              <p className="font-medium">{status.name}</p>
              <p className="text-sm text-gray-700">{status.message}</p>
              <span className="text-xs text-gray-500">{status.time}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default StatusList; // ✅ Ensure default export
  