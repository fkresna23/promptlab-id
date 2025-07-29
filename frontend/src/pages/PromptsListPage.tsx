import { useState, useEffect, useMemo } from "react";
import PromptCard from "../components/PromptCard";
import { getPromptsByCategory } from "../apiClient";

interface Prompt {
  _id: string;
  title: string;
  promptText: string;
  isPremium?: boolean;
  category?: string;
  tags?: string[];
}

interface PromptsListPageProps {
  selectedCategory: { id: string; name: string };
  setSelectedPromptId: (id: string) => void;
  setCurrentPage: (page: string) => void;
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const BoltIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);

const PromptsListPage = ({
  selectedCategory,
  setSelectedPromptId,
  setCurrentPage,
}: PromptsListPageProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "free" | "premium"
  >("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sample subcategories/tags based on the image - moved outside component to avoid dependency issues
  const subcategories = useMemo(
    () => [
      "Partnership & Incentives",
      "Proposal Development",
      "Lead Generation",
      "Sales Process Management",
      "Marketing Research",
      "Customer Engagement",
    ],
    []
  );

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!selectedCategory.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPromptsByCategory(selectedCategory.id);
        // Add sample premium/free status and tags to existing prompts
        const enhancedPrompts = data.map((prompt: Prompt, index: number) => ({
          ...prompt,
          isPremium: index % 3 === 0, // Make every 3rd prompt premium as example
          tags: [subcategories[index % subcategories.length]],
        }));
        setPrompts(enhancedPrompts);
        setFilteredPrompts(enhancedPrompts);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, [selectedCategory.id, subcategories]);

  // Filter prompts based on search term, filter type, and selected tag
  useEffect(() => {
    let filtered = prompts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by free/premium
    if (selectedFilter === "free") {
      filtered = filtered.filter((prompt) => !prompt.isPremium);
    } else if (selectedFilter === "premium") {
      filtered = filtered.filter((prompt) => prompt.isPremium);
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((prompt) =>
        prompt.tags?.includes(selectedTag)
      );
    }

    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, selectedFilter, selectedTag]);

  const handlePromptClick = (promptId: string) => {
    setSelectedPromptId(promptId);
    setCurrentPage("promptDetail");
  };

  if (isLoading)
    return <div className="text-center py-16">Memuat prompts...</div>;
  if (error)
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  const freeCount = prompts.filter((p) => !p.isPremium).length;
  const premiumCount = prompts.filter((p) => p.isPremium).length;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <button
            onClick={() => setCurrentPage("home")}
            className="hover:underline"
          >
            Home
          </button>
          <span> › </span>
          <span>ChatGPT Prompts for {selectedCategory.name}</span>
        </div>

        {/* Header with icon and title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
              <BoltIcon />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              <span className="underline decoration-4 decoration-yellow-400">
                {filteredPrompts.length}
              </span>{" "}
              ChatGPT Prompts for {selectedCategory.name}
            </h1>
            <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center">
              <BoltIcon />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Subcategory Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTag === null
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
          {subcategories.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Free/Premium Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setSelectedFilter("free")}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFilter === "free"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="w-3 h-3 border-2 border-blue-500 rounded-sm bg-blue-500 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              Free ({freeCount})
            </button>
            <button
              onClick={() => setSelectedFilter("premium")}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFilter === "premium"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="w-3 h-3 bg-black rounded-full"></div>
              Premium ({premiumCount})
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center text-gray-600 mb-8">
          Showing {filteredPrompts.length} prompts
          {selectedFilter !== "all" && ` (${selectedFilter})`}
          {selectedTag && ` in "${selectedTag}"`}
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredPrompts.map((prompt) => (
            <div key={prompt._id} className="relative">
              <PromptCard
                title={prompt.title}
                description={prompt.promptText.substring(0, 100) + "..."}
                onClick={() => handlePromptClick(prompt._id)}
                isPremium={prompt.isPremium}
              />
              {/* Premium Badge */}
              {prompt.isPremium && (
                <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                  PREMIUM
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <SearchIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No prompts found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("all");
                setSelectedTag(null);
              }}
              className="bg-yellow-400 text-black font-medium px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredPrompts.length > 0 && (
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page</span>
              <span className="font-semibold">1</span>
              <span className="text-sm text-gray-600">of</span>
              <span className="font-semibold">1</span>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsListPage;
