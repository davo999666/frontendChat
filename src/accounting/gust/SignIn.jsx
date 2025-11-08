import { useState } from "react";
import {loginApi} from "../../api/api.js";

const SignIn = ({ setUserHasProfile, setSignedIn }) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const result = await loginApi(login, password);
            if (!result.error) {
                localStorage.setItem("login", result.user.login);
                setSignedIn(true);
            } else {
                alert(result.error);
            }
        }catch(err) {
            console.log(err);
        }
    };

    return (
        <div className="p-6 bg-blue-500 text-white rounded-xl shadow-md max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>

            <input
                className="w-full mb-3 p-2 rounded text-black"
                type="login"
                placeholder="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />

            <input
                className="w-full mb-3 p-2 rounded text-black"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="w-full py-2 bg-white text-blue-600 font-bold rounded hover:bg-gray-200 border"
            >
                Login
            </button>
            <button
                onClick={()=> setUserHasProfile(false)}
                className="w-full py-2 bg-white text-blue-600 font-bold rounded hover:bg-gray-200 border"
            >
                SignUp
            </button>
        </div>
    );
};

export default SignIn;
