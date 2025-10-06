// import { useEffect, useState } from "react";
// export default function Sidebar() {
//   // Later, fetch user’s contacts & chat history from DB
//   // const contact = [
//   //   { id: 1, name: "Alice", lastMsg: "See you soon!" },
//   //   { id: 2, name: "Bob", lastMsg: "Okay cool 😎" },
//   //   { id: 3, name: "Charlie", lastMsg: "Did you check that?" },
//   // ];


//   const [contacts, setContacts] = useState([]);
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//       if (!token) return;

//       try {
//         const res = await fetch("http://localhost:5000/api/allusers/contacts", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.json();
//         if (res.ok) {
//           setContacts(data);
//         } else {
//           console.error("Error fetching contacts:", data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching contacts:", err);
//       }
//     };

//     fetchContacts();
//   }, []);

//   return (
//     <aside className="w-72 bg-[#dbdef5] border-r shadow-sm flex flex-col">
//       {/* Header */}
//       <div className="p-4 font-bold text-lg border-b">Chats</div>

//       {/* Contact list */}
//       <div className="flex-1 overflow-y-auto">
//         {contacts.map((contact) => (
//           <div
//             key={contact._id}
//             className="p-4 hover:bg-gray-100 cursor-pointer border-b"
//           >
//             <div className="font-semibold">{contact.fullname}</div>
//             <div className="text-sm text-gray-500 truncate">@{contact.username}</div>
//           </div>
//         ))}
//       </div>

//       {/* Footer with user profile */}
//       {/* <div className="p-4 border-t text-sm text-gray-600">Logged in as </div> */}
//     </aside>
//   );
// }
