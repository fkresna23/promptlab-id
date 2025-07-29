interface PromptCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const PromptCard = ({ title, description, onClick }: PromptCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-start hover:shadow-lg hover:border-yellow-400 transition-all duration-300 cursor-pointer"
    >
      <div>
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
      </div>
      <button className="bg-black text-white rounded-full p-2 ml-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </div>
  );
};

export default PromptCard;
