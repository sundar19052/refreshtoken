import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "./api";

function Login() {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    const login = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            alert(response.data.message);

            navigate("/profile");


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        }

    };

    return (

        <div>

            <h2>Login</h2>


            <form onSubmit={login}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br />


                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;
