import { useState } from "react";
import {loginApi, registerApi} from "../../api/api.js";

const SignUp = ({ setUserHasProfile, setSignedIn }) => {
    const [login, setLogin] = useState("");
    const [fullName, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateAccount = async () => {
        try {
            const registerResult = await registerApi({ login, password, birthday, fullName });

            if (registerResult.error) {
                alert(registerResult.error);
                return;
            }

            console.log("Registration success:", registerResult);

            // ✅ login after successful register
            const loginResult = await loginApi(login, password);

            if (loginResult.error) {
                alert(loginResult.error);
                return;
            }

            console.log("Login success:", loginResult);
            localStorage.setItem("login", loginResult.user.login);
            setSignedIn(true);

        } catch (err) {
            console.log("Server error:", err);
        }
    };

    return (
        <div className="p-6 bg-green-500 text-white rounded-xl shadow-md max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <input
                className="w-full mb-3 p-2 rounded text-black"
                type="text"
                placeholder="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                className="w-full mb-3 p-2 rounded text-black"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <input
                className="w-full mb-3 p-2 rounded text-black"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
            />
            <input
                className="w-full mb-4 p-2 rounded text-black"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleCreateAccount}
                className="w-full py-2 bg-white text-green-600 font-bold rounded hover:bg-gray-200 border"
            >
                Create Account
            </button>
            <button
                onClick={() => setUserHasProfile(true)}
                className="w-full py-2 bg-white text-green-600 font-bold rounded hover:bg-gray-200 border"
            >
                back to sign in
            </button>
        </div>
    );
};

export default SignUp;
