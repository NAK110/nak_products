import api from "@/lib/axios";

export async function login(email: string, password: string) {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.access_token);
    return data;
}

export async function logout() {
    const token = localStorage.getItem("token");
    if (!token) return;
    await api.post("/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
}

export async function getUser() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");
    const { data } = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}
