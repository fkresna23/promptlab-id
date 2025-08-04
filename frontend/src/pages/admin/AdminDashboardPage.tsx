import { useState, useEffect, useCallback } from "react";
import {
  getAllPrompts,
  type Prompt,
  type Category,
  getCategories,
} from "../../apiClient";
import PromptEditorModal from "./PromptEditorModal"; // Path dipastikan benar

const AdminDashboardPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Akan berisi prompt yang akan diedit, atau null jika membuat baru
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ambil semua data yang diperlukan secara bersamaan
      const [promptsData, categoriesData] = await Promise.all([
        getAllPrompts(),
        getCategories(),
      ]);
      setPrompts(promptsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data dashboard."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreateModal = () => {
    setEditingPrompt(null); // Set null untuk mode "Buat Baru"
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrompt(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchData(); // Muat ulang data setelah sukses
  };

  if (isLoading && prompts.length === 0) {
    return <div className="text-center p-10">Memuat data admin...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleOpenCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
          >
            + Buat Prompt Baru
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Prompt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prompts.map((prompt) => (
                <tr key={prompt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {prompt.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {prompt.category && typeof prompt.category === "object"
                      ? prompt.category.title
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prompt.isPremium ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Premium
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PromptEditorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          promptToEdit={editingPrompt}
          categories={categories}
        />
      )}
    </>
  );
};

export default AdminDashboardPage;
