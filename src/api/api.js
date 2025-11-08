const API_URL = "http://localhost:8080";

// ✅ Login
export async function loginApi(login, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",     // ✅ send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password })
    });

    return res.json();
}

// ✅ Register
export async function registerApi(data) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        credentials: "include",     // ✅ send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return res.json();
}

// ✅ Refresh access token
export async function refreshToken() {
    const res = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        credentials: "include",     // ✅ cookies required
    });

    return res.json();
}
export async function getAllUsersApi() {
    try {
        const res = await fetch("http://localhost:8080/get-all", {
            credentials: "include"
        });
        if (!res.ok) throw new Error("Server error");
        return await res.json(); // must be array
    } catch (err) {
        console.error("Fetch /get-all failed:", err);
        console.log("err", err)
        return []; // ✅ SAFE RETURN
    }
}
