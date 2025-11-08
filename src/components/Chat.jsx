import { useEffect, useState } from "react";
import { getAllUsersApi } from "../api/api.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    withCredentials: true,

});

const Chat = ({ setSignedIn }) => {
    const login = localStorage.getItem("login");
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatType, setChatType] = useState("public");
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        socket.connect(); // ✅ Start connection

        const loadUsers = async () => {
            const usersFromServer = await getAllUsersApi();
            setUsers(usersFromServer);
        };
        loadUsers();

        // ✅ Wait until connection is ready
        socket.on("connect", () => {
            socket.emit("user-join", login);
        });

        socket.on("chat-message", (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: "public" }]);
        });

        socket.on("private-message", (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: "private" }]);
        });

        socket.on("online-users", (list) => {
            console.log(list)
            const names = list.map((u) => u.name);
            setOnlineUsers(names);
        });

        return () => {
            socket.off("connect");
            socket.off("chat-message");
            socket.off("private-message");
            socket.off("online-users");
            socket.disconnect(); // ✅ disconnect fully
        };
    }, [login]);

    const sendPublic = () => {
        if (!text.trim()) return;
        socket.emit("chat-message", { from: login, text });
        setMessages((prev) => [...prev, { from: login, text, type: "public" }]);
        setText("");
    };

    const sendPrivate = () => {
        if (!text.trim() || !selectedUser) return;
        socket.emit("private-message", { from: login, to: selectedUser.name, text });
        setMessages((prev) => [
            ...prev,
            { from: login, to: selectedUser.name, text, type: "private" }
        ]);
        setText("");
    };

    const handleQuit = () => {
        socket.disconnect();   // ✅ stop socket before leaving
        setSignedIn(false);    // ✅ go back to login page
    };

    const visibleMessages = messages.filter((m) => {
        if (chatType === "public") return m.type === "public";
        if (chatType === "private" && selectedUser)
            return m.type === "private" &&
                (m.to === selectedUser.name || m.from === selectedUser.name);
        return false;
    });

    return (
        <div className="flex h-screen w-screen bg-gray-200">
            <div className="w-64 bg-white p-4 border-r shadow-md">
                <h2 className="text-xl font-bold mb-4">{login}</h2>

                <button
                    className={`w-full py-2 rounded mb-2 ${
                        chatType === "public" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => {
                        setChatType("public");
                        setSelectedUser(null);
                    }}
                >
                    🌍 Public Chat
                </button>

                <button
                    className={`w-full py-2 rounded mb-4 ${
                        chatType === "private" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setChatType("private")}
                >
                    🔒 Private Chat
                </button>

                {users.map((u) => (
                    <div
                        key={u.name}
                        onClick={() => {
                            setChatType("private");
                            setSelectedUser(u);
                        }}
                        className={`p-2 mb-2 rounded cursor-pointer ${
                            selectedUser?.name === u.name ? "bg-blue-200" : "bg-gray-100"
                        }`}
                    >
                        <span>{u.name}</span>
                        <span
                            className={`float-right h-2 w-2 rounded-full ${
                                onlineUsers.includes(u.name) ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></span>
                    </div>
                ))}

                <button
                    onClick={handleQuit}
                    className="mt-4 w-full py-2 bg-red-600 text-white font-bold rounded"
                >
                    Quit
                </button>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="p-4 bg-white border-b">
                    {chatType === "public" ? (
                        <h2 className="text-xl font-bold">Public Chat</h2>
                    ) : selectedUser ? (
                        <h2 className="text-xl font-bold">Chat with {selectedUser.name}</h2>
                    ) : (
                        <h2 className="text-xl font-bold">Select a user</h2>
                    )}
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    {visibleMessages.map((msg, i) => (
                        <div key={i} className="mb-2">
                            <b>{msg.from === login ? "You" : msg.from}:</b> {msg.text}
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t flex">
                    <input
                        className="flex-1 p-2 rounded border"
                        type="text"
                        placeholder="Type..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (chatType === "public" ? sendPublic() : sendPrivate())
                        }
                    />
                    <button
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={chatType === "public" ? sendPublic : sendPrivate}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
