import { useEffect, useState } from "react";

import api from "./api";
import { useNavigate } from "react-router-dom";

function Profile() {

    const [user, setUser] = useState(null);
     const navigate=useNavigate()
    useEffect(() => {

        getProfile();

    }, []);

    const getProfile = async () => {

        try {

            const response = await api.get(
                "/profile"
            );

            setUser(response.data.user);

        } catch (error) {

            console.log(error);
        }

    };

    const logout = async () => {

        try {
            await api.post("/auth/logout");
            alert("Logout Sucess")
           setTimeout(() => {
             
             navigate("/login")
           }, 2000);

        } catch (error) {
            console.log(error);

        }

    };


    if (!user) {

        return <h2>Loading...</h2>;

    }


    return (

        <div>

            <h2>Profile</h2>

            <p>
                ID: {user.id}
            </p>

            <p>
                Email: {user.email}
            </p>


            <button onClick={logout}>
                Logout
            </button>

        </div>

    );

}

export default Profile;