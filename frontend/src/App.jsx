import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Ultra Messaging App
      </h1>
      <p>Check the console for the API response.</p>
    </div>
  );
}

export default App;