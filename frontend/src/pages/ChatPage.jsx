import { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import Hamburger from "../components/Hamburger";
import { jwtDecode } from "jwt-decode";
import MyProfile from "../components/MyProfile"


export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);



  const [selectedContact, setSelectedContact] = useState(null);


  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);

    // Optional: Create/get conversation from backend
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    localStorage.setItem("selectedContactId", contact._id);
    if (!token) return;

    try {
      const res = await fetch(`${https://userauthchat-6.onrender.com/}conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: decodedUserId, // your logged-in user ID
          receiverId: contact._id,
        }),
      });

      const data = await res.json();
      console.log("Conversation:", data);
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // 👇 Adjust key based on backend (e.g., "username", "name", "email")
        setUsername(decoded.username || decoded.name || decoded.email || "User");
      } catch (err) {
        console.error("Invalid token:", err);
        setUsername("User");
      }
    }
  }, []);
  useEffect(() => {
    const savedContactId = localStorage.getItem("selectedContactId");
    if (savedContactId && contacts.length > 0) {
      const contact = contacts.find(c => c._id === savedContactId);
      if (contact) setSelectedContact(contact);
    }
  }, [contacts]);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${https://userauthchat-6.onrender.com/}api/allusers/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          console.log("Contacts fetched:", data);
          setContacts(data);
        } else {
          console.error("Error fetching contacts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  // Later, fetch user’s contacts & chat history from DB
  // const contact = [
  //   { id: 1, name: "Alice", lastMsg: "See you soon!" },
  //   { id: 2, name: "Bob", lastMsg: "Okay cool 😎" },
  //   { id: 3, name: "Charlie", lastMsg: "Did you check that?" },
  // ];

  // const filteredContacts = contacts.filter((c) =>
  //   c.name.toLowerCase().includes(query.toLowerCase())
  // );


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowProfile(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="flex flex-1 h-screen">
      <aside className=" w-15 lg:w-18  bg-[#e6e8f7] border-r border-gray-300 shadow-sm flex flex-col justify-center items-center gap-8 text-xl">
        <i className="fa-solid fa-house cursor-pointer"></i>
        <i className="fa-solid fa-magnifying-glass cursor-pointer"></i>
        <i className="fa-brands fa-facebook-messenger cursor-pointer"></i>
        <i className="fa-regular fa-heart cursor-pointer"></i>
        <i className="fa-regular fa-square-plus cursor-pointer"></i>
        <div className="flex justify-center items-center h-7 w-7 rounded-full  cursor-pointer bg-[#828ff8]" onClick={() => setShowProfile((prev) => !prev)}>
          <p className="text-[1rem]" >{username.charAt(0).toUpperCase()}</p>
        </div>
        {showProfile && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-opacity-30 z-40"
              onClick={() => setShowProfile(false)}
            ></div>

            {/* Drawer */}
            <div
              className={`fixed top-[40%] left-0 z-50 transform transition-transform duration-1000 ${showProfile ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <MyProfile />
            </div>
          </>
        )}

        <i className="fa-solid fa-bars cursor-pointer z-50" onClick={() => setShowMenu((prev) => !prev)}
        ></i>

      </aside>
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-opacity-30 z-40"
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Drawer */}
          <div
            className={`fixed top-[40%] z-50 transform transition-transform duration-1000 ${showMenu ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <Hamburger />
          </div>
        </>
      )}

      <div>
        <aside className="w-55 h-full lg:w-75 bg-white shadow-sm flex flex-col border-r-[1px] border-gray-300">
          {/* Header */}
          <div className="p-4 font-bold text-lg">{username}</div>

          {/* Search */}
          <div className="p-2">
            {showSearch ? (
              <input
                type="text"
                placeholder="Search contacts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#c5c6ef]"
              />
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 bg-[#e0e0f0] text-gray-600 px-4 py-2 rounded-full transition cursor-pointer w-full"
              >
                <i className="fas fa-search"></i>
                <span>Search</span>
              </button>
            )}
          </div>
          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <div
                key={c._id}
                className={`p-4 cursor-pointer hover:bg-[#eef2f6] ${selectedContact?._id === c._id ? "bg-[#dcdcff]" : ""}`}
                onClick={() => handleSelectContact(c)}
              >
                <div className="font-semibold">{c.username}</div>
                <div className="text-sm text-gray-500 truncate">{c.fullName}</div>
              </div>
            ))}
          </div>

          {/* Footer with user profile */}
          {/* <div className="flex justify-content items-center p-4 border-t text-xl text-gray-900">Logged in as
          <div className="flex justify-center items-center h-10 w-10 m-4 rounded-full border-2 cursor-pointer">
            <p >RV</p>
          </div>
        </div> */}
        </aside>
      </div>
      <ChatWindow selectedContact={selectedContact} />
    </div>
  );
}
