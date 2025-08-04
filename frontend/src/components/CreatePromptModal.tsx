import React, { useState, useEffect } from "react";
import {
  createPrompt,
  getCategories,
  type Category,
  type PromptData,
} from "../apiClient";

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePromptModal: React.FC<CreatePromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ambil daftar kategori saat modal pertama kali akan ditampilkan
    if (isOpen) {
      getCategories()
        .then((data) => {
          setCategories(data);
          if (data.length > 0) {
            setCategoryId(data[0]._id); // Set default value
          }
        })
        .catch(() => setError("Gagal memuat kategori."));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Silakan pilih kategori.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const promptData: PromptData = {
      title,
      description,
      promptText,
      category: categoryId,
      isPremium,
    };

    try {
      await createPrompt(promptData);
      onSuccess(); // Panggil fungsi onSuccess untuk refresh data di dashboard
      onClose(); // Tutup modal
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi error tidak diketahui."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Tambah Prompt Baru</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Deskripsi Singkat
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Teks Prompt Lengkap
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              required
              rows={6}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mt-5">
              <input
                type="checkbox"
                id="isPremium"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isPremium"
                className="ml-2 block text-gray-900 font-bold"
              >
                Jadikan Premium?
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
            >
              {isLoading ? "Menyimpan..." : "Simpan Prompt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromptModal;
