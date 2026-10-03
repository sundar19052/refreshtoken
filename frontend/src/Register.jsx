import { useState } from "react";
import api from "./api";

function Register() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });


    




     const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const register = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/register",
                form
            );

            alert(response.data.message);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        }

    };

    return (

        <div>

            <h2>Register</h2>

            <form onSubmit={register}>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <br />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <br />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>

    );

}

export default Register;