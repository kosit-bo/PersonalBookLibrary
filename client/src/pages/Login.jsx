import { useState } from "react";
import { BookOpen, Lock, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Toast from "../components/Toast";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });
    const showToast = (message, type = "success") => {
        setToast({
            message,
            type,
        });

        setTimeout(() => {
            setToast({
                message: "",
                type: "success",
            });
        }, 3000);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("กรุณากรอก Username และ Password");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                username: username.trim(),
                password,
            });

            localStorage.setItem("token", response.data.token);
            showToast("เข้าสู่ระบบสำเร็จ");

            setTimeout(() => {
                navigate("/");
            }, 500);
            navigate("/");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                setError("Username หรือ Password ไม่ถูกต้อง");
                showToast("Username หรือ Password ไม่ถูกต้อง", "error");
            } else {
                setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
                showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() =>
                    setToast({
                        message: "",
                        type: "success",
                    })
                }
            />
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo / Title */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <BookOpen size={28} />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Personal Book Library
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        เข้าสู่ระบบเพื่อจัดการคลังหนังสือของคุณ
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            เข้าสู่ระบบ
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Username
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="กรอก Username"
                                    autoComplete="username"
                                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-5">
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="กรอก Password"
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <LogIn size={18} />

                            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Personal Book Library
                </p>
            </div>
            </div>
        </>
    );
}

export default Login;