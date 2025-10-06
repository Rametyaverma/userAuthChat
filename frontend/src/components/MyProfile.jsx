import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export default function myProfile() {

    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");

 

    useEffect(() => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);

                // 👇 Adjust key based on backend (e.g., "username", "name", "email")
                setUsername(decoded.username || "Username");
                setFullName(decoded.fullName || "fullName");
                setEmail(decoded.email || "email");
                setDob(decoded.dob || "DOB");


            } catch (err) {
                console.error("Invalid token:", err);
                setUsername("User");
            }
        }
    }, []);

    const handleEdit =(e)=>{
        Navigate()
    }
    return (
        <div className="w-80  h-80 absolute left-14 bg-[#edeef5] top-[25%]   shadow-lg rounded-full ">
            <div className="flex flex-col ml-8 mt-17 gap-2 text-xl">
                <h1 className="flex justify-center -ml-15"><strong>My Profile</strong> </h1>
                <div>
                    <h2 ><strong>Email: </strong> {email}</h2>
                    <h2><strong>Username:  </strong>{username}</h2>
                    <h2><strong>Full Name:</strong> {fullName}</h2>
                    <h2><strong>DOB:  </strong>{dob.split("T")[0]}</h2>

                    <button
                        class="flex ml-15 mt-5 justify-center items-center h-10 w-28 bg-[#7988fa] text-white  rounded-4xl shadow-md hover:bg-[#586af3] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-transform transform hover:scale-102 cursor-pointer"
                        // onClick={handleEdit}
                    >
                        Edit Profile
                    </button>
                </div>


            </div>


        </div>
    )

}