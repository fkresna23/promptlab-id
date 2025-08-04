import React, { useState, useEffect } from "react";
import {
  createPrompt,
  type Category,
  type Prompt,
  type PromptData,
} from "../../apiClient";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  promptToEdit: Prompt | null;
  categories: Category[];
}

const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  promptToEdit,
  categories,
}) => {
  const [formData, setFormData] = useState<
    Omit<PromptData, "whatItDoes" | "tips" | "howToUse">
  >({
    title: "",
    description: "",
    promptText: "",
    category: "",
    isPremium: false,
  });
  const [extraFields, setExtraFields] = useState({
    whatItDoes: "",
    tips: "",
    howToUse: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (promptToEdit) {
      // Mode Edit
      setFormData({
        title: promptToEdit.title,
        description: promptToEdit.description,
        promptText: promptToEdit.promptText,
        category:
          typeof promptToEdit.category === "string"
            ? promptToEdit.category
            : promptToEdit.category?._id || "",
        isPremium: promptToEdit.isPremium,
      });
      setExtraFields({
        whatItDoes: (promptToEdit.whatItDoes || []).join("\n"),
        tips: (promptToEdit.tips || []).join("\n"),
        howToUse: (promptToEdit.howToUse || []).join("\n"),
      });
    } else {
      // Mode Buat Baru
      setFormData({
        title: "",
        description: "",
        promptText: "",
        category: categories.length > 0 ? categories[0]._id : "",
        isPremium: false,
      });
      setExtraFields({ whatItDoes: "", tips: "", howToUse: "" });
    }
  }, [promptToEdit, categories, isOpen]);

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

  const handleExtraChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtraFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuillChange = (value: string) => {
    setFormData((prev) => ({ ...prev, promptText: value }));
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.promptText &&
    formData.category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Harap isi semua kolom yang ditandai *.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const finalData: PromptData = {
      ...formData,
      whatItDoes: extraFields.whatItDoes
        .split("\n")
        .filter((line) => line.trim() !== ""),
      tips: extraFields.tips.split("\n").filter((line) => line.trim() !== ""),
      howToUse: extraFields.howToUse
        .split("\n")
        .filter((line) => line.trim() !== ""),
    };

    try {
      await createPrompt(finalData);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">
          {promptToEdit ? "Edit Prompt" : "Buat Prompt Baru"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-semibold">Judul *</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-semibold">
              Deskripsi Singkat *
            </span>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>
          <div>
            <span className="text-gray-700 font-semibold">
              What This Prompt Does
            </span>
            <textarea
              name="whatItDoes"
              value={extraFields.whatItDoes}
              onChange={handleExtraChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Masukkan setiap poin di baris baru..."
            />
          </div>
          <div>
            <span className="text-gray-700 font-semibold">Tips</span>
            <textarea
              name="tips"
              value={extraFields.tips}
              onChange={handleExtraChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Masukkan setiap tips di baris baru..."
            />
          </div>
          <div>
            <span className="text-gray-700 font-semibold">How To Use</span>
            <textarea
              name="howToUse"
              value={extraFields.howToUse}
              onChange={handleExtraChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Masukkan setiap cara penggunaan di baris baru..."
            />
          </div>
          <div>
            <span className="text-gray-700 font-semibold">
              Teks Prompt Lengkap *
            </span>
            <div className="mt-1">
              <ReactQuill
                theme="snow"
                value={formData.promptText}
                onChange={handleQuillChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-12">
            <label className="block">
              <span className="text-gray-700 font-semibold">Kategori *</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleInputChange}
                className="h-5 w-5 rounded-md"
              />
              <label htmlFor="isPremium" className="ml-2 font-semibold">
                Jadikan Premium?
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-indigo-300"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptEditorModal;
