import { useState, useEffect } from "react";
import { getAllPrompts, type Prompt } from "../apiClient";
import CreatePromptModal from "../components/CreatePromptModal"; // Impor modal

const AdminDashboardPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPrompts();
      setPrompts(data);
    } catch (err) {
      setError("Gagal memuat data prompt.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  if (isLoading)
    return <div className="text-center p-8">Loading prompts...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)} // Buka modal saat tombol diklik
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Tambah Prompt Baru
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Judul Prompt
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => (
                <tr key={prompt._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {prompt.title}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {prompt.category && typeof prompt.category === "object"
                        ? prompt.category.title
                        : "N/A"}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {prompt.isPremium ? (
                      <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Premium</span>
                      </span>
                    ) : (
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Free</span>
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 ml-4">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreatePromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPrompts} // Refresh data setelah berhasil
      />
    </>
  );
};

export default AdminDashboardPage;
