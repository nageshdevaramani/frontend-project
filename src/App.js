import { useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);

  // 🔹 Fetch Hello API
  const loadHello = () => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setData(data));
  };

  // 🔹 Fetch Users API
  const loadUsers = () => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  return (
    <div>
      <h1>Frontend</h1>

      {/* 🔹 Button for Hello */}
      <button onClick={loadHello}>Load Hello</button>

      {data && (
        <>
          {/* <p>{data.message}</p> */}
          <p>{data.time}</p>
        </>
      )}

      {/* 🔹 Button for Users */}
      <h2>Users</h2>
      <button onClick={loadUsers}>Load Users</button>

      {users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;