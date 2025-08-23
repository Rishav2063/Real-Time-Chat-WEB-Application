import './chatpage.css';
import { MdGroupAdd } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { useEffect, useState } from "react";

function Chatpage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [myId, setMyId] = useState(""); // ✅ logged-in user _id
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedToken = localStorage.getItem("token");
    const storedId = localStorage.getItem("userId"); // ✅ get _id from storage

    if (storedName) setName(storedName);
    if (storedToken) setToken(storedToken);
    if (storedId) setMyId(storedId);

    if (storedToken) {
      fetch("https://live-chat-x7h2.onrender.com/api/auth/all-users", {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          // Filter out self using myId
          const otherUsers = data.filter(user => user._id !== storedId);
          setAllUsers(otherUsers);
          setFilteredUsers(otherUsers);
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId"); // ✅ remove stored _id
    setName("");
    setToken("");
    setMyId("");
    navigate("/");
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <>
      <div className='search-div-chatpage'>
        {/* ✅ Show logged-in username */}
        {token && <span> {name} 👋</span>}

        <input
          className='search-chatpage'
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search username..."
        />
        <button className='btn-chatpage-search'>
          <IoMdSearch className='search-img-chatpage' />
        </button>

        {token && <Link to='/groupcreate'><MdGroupAdd className='group-img'/></Link>}

        {token && (
          <button 
            style={{backgroundColor:"red", cursor:"pointer"}} 
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      {token && (
        <div className="search-results" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {filteredUsers.map(user => (
            <Link
              key={user._id}
              to="/textchat"
              state={{ 
                chatUser: user.name, 
                userId: user._id,
                myId: myId   // ✅ pass self id also
              }}
              className="chat-div"
            >
              <h3>{user.name}</h3>
            </Link>
          ))}
        </div>
      )}

      {!token && (
        <div className='display-log'>
          <Link to='/login' className='display-login'>
            <button className='display-login'><strong>Login</strong></button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Chatpage;
