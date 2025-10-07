import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { io } from "socket.io-client";
import Profile from "./Profile";

const socket = io(`${https://userauthchat-6.onrender.com}`);

export default function ChatWindow({ selectedContact,loggedInUser }) {

  const [contacts, setContacts] = useState([]);
  const [username, setUsername] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
    const [messages, setMessages] = useState([]);
  // Example chat messages
  const msgs = [
    { id: 1, sender: "Alice", text: "Hey, how are you?" },
    { id: 2, sender: "You", text: "I’m good! Working on ChatApp 🚀" },
    { id: 3, sender: "Alice", text: "That’s awesome 😍" },
  ];


  useEffect(() => {
    if (!selectedContact) return;

    setUsername(selectedContact.fullName || selectedContact.username);

    // Fetch messages for this conversation
    const fetchMessages = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${https://userauthchat-6.onrender.com}/messages/${selectedContact._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedContact]);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${https://userauthchat-6.onrender.com}`/api/allusers/contacts", {
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



  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Send:", message); // Later, emit via WebSocket
    setMessage("");
    
  };
  useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setShowMenu(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

  return (
    <div className="flex flex-col flex-1">
      {/* Chat Header */}
      <div className="flex justify-between items-center-safe  border-b border-gray-300 bg-white font-bold">
        <div className="flex items-center lg:ml-4">
          <div className="flex justify-center items-center h-12 w-12 m-4 rounded-full border-2 cursor-pointer" onClick={() => setShowMenu((prev) => !prev)}>
            <p className="text-4xl font-medium" >{username.charAt(0).toLocaleUpperCase()}</p>
          </div>
          <h1 className="text-2xl">{selectedContact ? selectedContact.fullName : "Select a contact"} <p className="font-extralight text-[1rem] ">Active 6 min ago</p></h1>

        </div>

        <div className="flex gap-8 lg:gap-12 text-gray-600 mr-4 lg:mr-12 lg:text-2xl">
          <i class="fa-solid fa-phone cursor-pointer "></i>
          <i class="fa-solid fa-video cursor-pointer"></i>
          <i class="fa-solid fa-circle-info cursor-pointer"></i>
        </div>

      </div>
      {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-opacity-30 z-40"
                  onClick={() => setShowMenu(false)}
                ></div>
      
                {/* Drawer */}
                <div
                  className={`fixed top-[8%] z-50 transform transition-transform duration-1000 ${showMenu ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                  <Profile selectedContact={selectedContact}/>
                </div>
              </>
            )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg ${msg.sender === "You"
              ? "bg-[#7a7deb] text-white ml-auto"
              : "bg-gray-200 text-gray-800"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 rounded-full bg-[#7a7deb] text-white hover:bg-[#6366f1]"
      >
        Send
      </button>
    </div>

      {/* Input box */}
      {/* <MessageInput /> */}
    </div>
  );
}
