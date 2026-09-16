import { CheckCircle, XCircle, X } from "lucide-react";

function Toast({ message, type = "success", onClose }) {
    if (!message) {
        return null;
    }

    const isSuccess = type === "success";

    return (
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
            <div
                className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${isSuccess ? "border-green-200" : "border-red-200"
                    }`}
            >
                {isSuccess ? (
                    <CheckCircle
                        size={21}
                        className="mt-0.5 shrink-0 text-green-600"
                    />
                ) : (
                    <XCircle
                        size={21}
                        className="mt-0.5 shrink-0 text-red-600"
                    />
                )}

                <p
                    className={`flex-1 text-sm font-medium ${isSuccess ? "text-green-700" : "text-red-700"
                        }`}
                >
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

export default Toast;