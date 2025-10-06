import { useState } from "react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Send:", message); // Later, emit via WebSocket
    setMessage("");
  };

  return (
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
  );
}
