// frontend/src/components/PromptCard.tsx

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
  isPremium, // Prop ini sekarang akan digunakan
}: PromptCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-yellow-400 transition-all duration-300 cursor-pointer group relative"
    >
      {/* Tambahkan Badge Premium di sini */}
      {isPremium && (
        <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
          PREMIUM
        </div>
      )}

      {/* Konten lainnya tetap sama */}
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
            {/* SVG Icon */}
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
            {/* SVG Arrow */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
