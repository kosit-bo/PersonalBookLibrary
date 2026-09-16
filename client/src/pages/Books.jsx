import { useEffect, useState } from "react";
import { LogOut, Plus, Search, Trash2, X, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Toast from "../components/Toast";

function Books() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    const [categoryId, setCategoryId] = useState("");
    const [authorId, setAuthorId] = useState("");

    const [title, setTitle] = useState("");
    const [selectedAuthorId, setSelectedAuthorId] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);

    const [error, setError] = useState("");
    const [addError, setAddError] = useState("");

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });
    const [selectedBook, setSelectedBook] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    // โหลด Author และ Category
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [authorsResponse, categoriesResponse] = await Promise.all([
                    api.get("/authors"),
                    api.get("/categories"),
                ]);

                setAuthors(authorsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadFilters();
    }, []);

    // โหลดหนังสือ
    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {};

                if (categoryId) {
                    params.categoryId = categoryId;
                }

                if (authorId) {
                    params.authorId = authorId;
                }

                const response = await api.get("/books", { params });

                setBooks(response.data);
            } catch (error) {
                console.error(error);
                setError("ไม่สามารถโหลดข้อมูลหนังสือได้");
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [categoryId, authorId]);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");

        showToast("ออกจากระบบสำเร็จ");

        setTimeout(() => {
            navigate("/login");
        }, 500);
    };

    // เปิด Popup
    const openAddModal = () => {
        setTitle("");
        setSelectedAuthorId("");
        setSelectedCategoryId("");
        setAddError("");
        setShowModal(true);
    };

    // ปิด Popup
    const closeAddModal = () => {
        if (!addLoading) {
            setShowModal(false);
        }
    };

    // เพิ่มหนังสือ
    const handleAddBook = async (e) => {
        e.preventDefault();

        setAddError("");

        if (!title.trim()) {
            setAddError("กรุณากรอกชื่อหนังสือ");
            showToast("กรุณากรอกชื่อหนังสือ", "error");
            return;
        }

        if (!selectedAuthorId) {
            setAddError("กรุณาเลือก Author");
            showToast("กรุณาเลือก Author", "error");
            return;
        }

        if (!selectedCategoryId) {
            setAddError("กรุณาเลือก Category");
            showToast("กรุณาเลือก Category", "error");
            return;
        }

        try {
            setAddLoading(true);

            const response = await api.post("/books", {
                title: title.trim(),
                authorId: selectedAuthorId,
                categoryId: selectedCategoryId,
            });

            // หา Author และ Category จากข้อมูลที่โหลดไว้แล้ว
            const selectedAuthor = authors.find(
                (author) => author.id === selectedAuthorId
            );

            const selectedCategory = categories.find(
                (category) => category.id === selectedCategoryId
            );

            // สร้างข้อมูลสำหรับแสดงผลทันที
            const newBook = {
                ...response.data,
                author: selectedAuthor,
                category: selectedCategory,
            };

            setBooks((currentBooks) => [
                ...currentBooks,
                newBook,
            ]);

            setShowModal(false);

            setTitle("");
            setSelectedAuthorId("");
            setSelectedCategoryId("");

            showToast("เพิ่มหนังสือสำเร็จ");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                return;
            }

            const message =
                error.response?.data?.message ||
                "ไม่สามารถเพิ่มหนังสือได้";

            setAddError(message);
            showToast(message, "error");
        } finally {
            setAddLoading(false);
        }
    };
    // ลบหนังสือ
    const handleDeleteBook = async (id) => {
        const confirmed = window.confirm(
            "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/books/${id}`);

            setBooks((currentBooks) =>
                currentBooks.filter((book) => book.id !== id)
            );

            showToast("ลบหนังสือสำเร็จ");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                return;
            }

            showToast("ไม่สามารถลบหนังสือได้", "error");
            setError("ไม่สามารถลบหนังสือได้");
        }
    };
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
    const handleViewBook = async (id) => {
        try {
            setDetailLoading(true);

            const response = await api.get(`/books/${id}`);

            setSelectedBook(response.data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 404) {
                showToast("ไม่พบหนังสือ", "error");
            } else if (error.response?.status !== 401) {
                showToast("ไม่สามารถโหลดรายละเอียดหนังสือได้", "error");
            }
        } finally {
            setDetailLoading(false);
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

        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <BookOpen size={21} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Personal Book Library
                            </h1>
                            <p className="text-xs text-slate-500">
                                Manage your personal books
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Title + Add */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            หนังสือทั้งหมด
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            จัดการและค้นหาหนังสือของคุณ
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        เพิ่มหนังสือ
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Search size={17} />
                        ค้นหา / Filter
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Category */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                Category
                            </label>

                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="">All Categories</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Author */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                Author
                            </label>

                            <select
                                value={authorId}
                                onChange={(e) => setAuthorId(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="">All Authors</option>

                                {authors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex min-h-60 items-center justify-center">
                        <div className="text-sm text-slate-500">
                            กำลังโหลดข้อมูล...
                        </div>
                    </div>
                ) : books.length === 0 ? (
                    /* Empty */
                    <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4">
                        <BookOpen
                            size={40}
                            className="mb-3 text-slate-300"
                        />

                        <h3 className="font-semibold text-slate-700">
                            ไม่พบหนังสือ
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            ยังไม่มีหนังสือในรายการ
                        </p>
                    </div>
                ) : (
                    /* Book List */
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                onClick={() => handleViewBook(book.id)}
                                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                        <BookOpen
                                            size={19}
                                            className="text-slate-600"
                                        />
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteBook(book.id);
                                        }}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        title="ลบหนังสือ"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>

                                <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-slate-900">
                                    {book.title}
                                </h3>

                                <div className="space-y-1 text-sm">
                                    <p className="text-slate-500">
                                        Author:{" "}
                                        <span className="font-medium text-slate-700">
                                            {book.author?.name || "-"}
                                        </span>
                                    </p>

                                    <p className="text-slate-500">
                                        Category:{" "}
                                        <span className="font-medium text-slate-700">
                                            {book.category?.name || "-"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Book Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    เพิ่มหนังสือ
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    เพิ่มข้อมูลหนังสือใหม่
                                </p>
                            </div>

                            <button
                                onClick={closeAddModal}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddBook} className="p-6">
                            {/* Title */}
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    ชื่อหนังสือ
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="กรอกชื่อหนังสือ"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                />
                            </div>

                            {/* Author */}
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Author
                                </label>

                                <select
                                    value={selectedAuthorId}
                                    onChange={(e) =>
                                        setSelectedAuthorId(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                >
                                    <option value="">เลือก Author</option>

                                    {authors.map((author) => (
                                        <option key={author.id} value={author.id}>
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div className="mb-5">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Category
                                </label>

                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) =>
                                        setSelectedCategoryId(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                >
                                    <option value="">เลือก Category</option>

                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Error */}
                            {addError && (
                                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                                    {addError}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    disabled={addLoading}
                                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="submit"
                                    disabled={addLoading}
                                    className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {addLoading ? "กำลังบันทึก..." : "เพิ่มหนังสือ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}
                {selectedBook && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
                        onClick={() => setSelectedBook(null)}
                    >
                        <div
                            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        รายละเอียดหนังสือ
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Book Detail
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedBook(null)}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-5 p-6">
                                <div>
                                    <p className="mb-1 text-xs font-medium text-slate-400">
                                        Title
                                    </p>

                                    <p className="text-lg font-semibold text-slate-900">
                                        {selectedBook.title}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-medium text-slate-400">
                                        Author
                                    </p>

                                    <p className="text-sm font-medium text-slate-700">
                                        {selectedBook.author?.name || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-medium text-slate-400">
                                        Category
                                    </p>

                                    <p className="text-sm font-medium text-slate-700">
                                        {selectedBook.category?.name || "-"}
                                    </p>
                                </div>


                                <button
                                    onClick={() => setSelectedBook(null)}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {detailLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
                        <div className="rounded-xl bg-white px-6 py-5 shadow-xl">
                            <p className="text-sm text-slate-600">
                                กำลังโหลดรายละเอียด...
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

export default Books;