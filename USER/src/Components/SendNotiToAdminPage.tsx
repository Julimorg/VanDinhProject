import { useState } from "react";
import { useAuthStoreCookiesStorage } from "../Middleware/useAuthStore";

const SendNotiToAdminPage = () => {
    const { id: userId, accessToken } = useAuthStoreCookiesStorage();

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("USER_TO_ADMIN");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title || !message) {
            alert("Title & Message required");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost:8080/api/v1/notification/user/send-to-admin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        title,
                        message,
                        type,
                        createBy: userId,
                    }),
                }
            );

            const data = await res.json();
            console.log("Send noti result:", data);

            if (!res.ok) {
                throw new Error(data.message || "Send failed");
            }

            alert("✅ Notification sent to admin!");
            setTitle("");
            setMessage("");
        } catch (err: any) {
            console.error(err);
            alert("❌ Error sending notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "40px auto" }}>
            <h2>📨 Send Notification to Admin</h2>

            <div style={{ marginBottom: 12 }}>
                <label>Title</label>
                <input
                    style={{ width: "100%", padding: 8 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Message</label>
                <textarea
                    style={{ width: "100%", padding: 8, minHeight: 100 }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Type</label>
                <input
                    style={{ width: "100%", padding: 8 }}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
            </div>

            <button
                onClick={handleSend}
                disabled={loading}
                style={{
                    padding: "10px 16px",
                    background: "#1677ff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                {loading ? "Sending..." : "Send to Admin"}
            </button>
        </div>
    );
};

export default SendNotiToAdminPage;
