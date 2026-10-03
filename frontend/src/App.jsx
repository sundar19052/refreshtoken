import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={<Register />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;