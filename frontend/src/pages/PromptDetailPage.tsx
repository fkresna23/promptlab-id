import { useState, useEffect } from "react";
import { getPromptById } from "../apiClient";

interface Prompt {
  _id: string;
  title: string;
  promptText: string;
  keySentence?: string;
  whatItDoes?: string[];
  tips?: string[];
  howToUse?: string[];
}

interface PromptDetailPageProps {
  promptId: string;
  setCurrentPage: (page: string) => void;
}

const BulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const GearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const QuestionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.742 0-3.223-.835-3.772-2M12 18v.01"
    />
  </svg>
);

const PromptDetailPage = ({
  promptId,
  setCurrentPage,
}: PromptDetailPageProps) => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    const fetchPromptDetail = async () => {
      if (!promptId) return;
      setIsLoading(true);
      try {
        const data = await getPromptById(promptId);
        setPrompt(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromptDetail();
  }, [promptId]);

  const handleCopy = () => {
    if (prompt?.promptText) {
      const textArea = document.createElement("textarea");
      textArea.value = prompt.promptText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess("Prompt berhasil disalin!");
        setTimeout(() => setCopySuccess(""), 2000);
      } catch (err) {
        console.error("Gagal menyalin teks: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  if (isLoading)
    return <div className="text-center py-16">Memuat detail prompt...</div>;
  if (error)
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;
  if (!prompt)
    return <div className="text-center py-16">Prompt tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="text-sm text-gray-500 mb-8">
        <button
          onClick={() => setCurrentPage("home")}
          className="hover:underline"
        >
          Home
        </button>
        <span> &gt; </span>
        <button
          onClick={() => setCurrentPage("promptsList")}
          className="hover:underline"
        >
          Prompts
        </button>
        <span> &gt; </span>
        <span className="font-semibold">{prompt.title}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {prompt.title}
      </h1>

      {prompt.keySentence && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8 flex items-start space-x-4">
          <BulbIcon />
          <p className="text-yellow-800">{prompt.keySentence}</p>
        </div>
      )}

      {prompt.whatItDoes && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <GearIcon />
            <h2 className="text-2xl font-bold">What This Prompt Does:</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-8">
            {prompt.whatItDoes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {prompt.tips && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <BulbIcon />
            <h2 className="text-2xl font-bold">Tips:</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-8">
            {prompt.tips.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-900 text-white rounded-2xl p-6 relative mb-12">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {copySuccess ? "Disalin!" : "Copy"}
        </button>
        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed pr-24">
          {prompt.promptText}
        </pre>
      </div>

      {copySuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg">
          {copySuccess}
        </div>
      )}

      {prompt.howToUse && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <QuestionIcon />
            <h2 className="text-2xl font-bold">How To Use The Prompt:</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-8">
            {prompt.howToUse.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PromptDetailPage;
