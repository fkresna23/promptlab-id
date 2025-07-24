import React, { useState, useEffect } from "react";
import PromptCard from "../components/PromptCard";

interface Prompt {
  _id: string;
  title: string;
  promptText: string;
}
interface PromptsListPageProps {
  selectedCategory: { id: string; name: string };
  setSelectedPromptId: (id: string) => void;
  setCurrentPage: (page: string) => void;
}

const PromptsListPage: React.FC<PromptsListPageProps> = ({
  selectedCategory,
  setSelectedPromptId,
  setCurrentPage,
}) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!selectedCategory.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5001/api/prompts/category/${selectedCategory.id}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data prompt.");
        const data = await response.json();
        setPrompts(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, [selectedCategory.id]);

  const handlePromptClick = (promptId: string) => {
    setSelectedPromptId(promptId);
    setCurrentPage("promptDetail");
  };

  if (isLoading)
    return <div className="text-center py-16">Memuat prompts...</div>;
  if (error)
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-sm text-gray-500 mb-8">
        <button
          onClick={() => setCurrentPage("home")}
          className="hover:underline"
        >
          Home
        </button>
        <span> &gt; </span>
        <span>ChatGPT Prompts for {selectedCategory.name}</span>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          <span className="underline">{prompts.length}</span> ChatGPT Prompts
          for {selectedCategory.name}
        </h1>
      </div>
      <div className="mb-12">
        <input
          type="text"
          placeholder="Search prompts..."
          className="w-full max-w-lg mx-auto block border border-gray-300 rounded-lg py-3 px-4 mb-4"
        />
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <button className="border border-gray-300 rounded-lg px-4 py-1.5">
            Partnership & Incentives
          </button>
          <button className="border border-gray-300 rounded-lg px-4 py-1.5">
            Proposal Development
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt._id}
            title={prompt.title}
            description={prompt.promptText.substring(0, 100) + "..."}
            onClick={() => handlePromptClick(prompt._id)}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-12">
        <button className="border border-gray-300 rounded-lg px-4 py-2">
          Previous
        </button>
        <span>1 of 18</span>
        <button className="border border-gray-300 rounded-lg px-4 py-2">
          Next
        </button>
      </div>
    </div>
  );
};

export default PromptsListPage;
