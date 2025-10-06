import { useState, useEffect } from "react";


export default function Profile({ selectedContact }) {
    
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (!selectedContact) return;
        console.log("Selected Contact:", selectedContact);

        setUsername(selectedContact.username || "Username");
        setFullName(selectedContact.fullName || "Full Name");
        setEmail(selectedContact.email || "Email");
        setDob(selectedContact.dob || "DOB");


        // Fetch messages for this conversation

    }, [selectedContact]);
    return (
        <div className="w-80  h-80 absolute left-14 bg-[#edeef5] top-[25%]   shadow-lg rounded-full ">
            <div className="flex flex-col ml-8 mt-17 gap-2 text-xl">
                <h1 className="flex justify-center -ml-15"><strong>Details</strong> </h1>
                <div>
                    <h2 ><strong>Email: </strong> {email}</h2>
                    <h2><strong>Username:  </strong>{username}</h2>
                    <h2><strong>Full Name:</strong> {fullName}</h2>
                    <h2><strong>DOB:  </strong>{dob.split("T")[0]}</h2>
                </div>


            </div>

        </div>
    )
}