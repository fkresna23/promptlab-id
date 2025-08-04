import React, { useState, useEffect } from "react";
import {
  createPrompt,
  getCategories,
  type Category,
  type PromptData,
} from "../apiClient";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [formData, setFormData] = useState<PromptData>({
    title: "",
    description: "",
    promptText: "",
    category: "",
    isPremium: false,
    whatItDoes: [],
    tips: [],
    howToUse: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efek untuk mereset form dan mengambil data kategori saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setFormData({
        title: "",
        description: "",
        promptText: "",
        category: "",
        isPremium: false,
        whatItDoes: [],
        tips: [],
        howToUse: [],
      });
      setError(null);
      setIsLoading(false);

      // Ambil kategori
      getCategories()
        .then((data) => {
          setCategories(data);
          if (data.length > 0) {
            // Set kategori default
            setFormData((prev) => ({ ...prev, category: data[0]._id }));
          }
        })
        .catch(() => setError("Gagal memuat daftar kategori."));
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split("\n").filter((line) => line.trim() !== ""),
    }));
  };

  const handleQuillChange = (value: string) => {
    setFormData((prev) => ({ ...prev, promptText: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      setError("Silakan pilih kategori terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createPrompt(formData);
      onSuccess(); // Panggil fetchPrompts di parent untuk refresh data
      onClose(); // Tutup modal
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi error yang tidak diketahui."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-20 rounded-lg">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-700">
                Menyimpan...
              </p>
              <p className="text-gray-500">Mohon tunggu sebentar.</p>
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Tambah Prompt Baru
        </h2>
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Gagal Menyimpan</p>
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Judul *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Deskripsi Singkat *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Teks Prompt Lengkap *
            </label>
            <div className="bg-white border rounded-md">
              <ReactQuill
                theme="snow"
                value={formData.promptText}
                onChange={handleQuillChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="" disabled>
                  Pilih Kategori...
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleInputChange}
                className="h-5 w-5 rounded"
              />
              <label
                htmlFor="isPremium"
                className="ml-2 block text-gray-900 font-bold"
              >
                Jadikan Premium?
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-blue-300"
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
