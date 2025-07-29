interface PromptCardProps {
  title: string;
  description: string;
  onClick: () => void;
  isPremium?: boolean;
}

const PromptCard = ({
  title,
  description,
  onClick,
  isPremium,
}: PromptCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-yellow-400 transition-all duration-300 cursor-pointer group relative"
    >
      {/* Content */}
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          {/* Icon placeholder */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600 group-hover:text-yellow-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84a14.927 14.927 0 012.58 5.84M9.75 7.124a6 6 0 00-6 6v3a6 6 0 106 6v-3a6 6 0 006-6v-3a6 6 0 00-6-6z"
              />
            </svg>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Arrow button */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
