import React from "react";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  isNew?: boolean;
  onClick: () => void; // Prop baru
}

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  count,
  isNew,
  onClick,
}) => {
  return (
    <div
      onClick={onClick} // Event handler ditambahkan di sini
      className="bg-black text-white p-6 rounded-2xl flex flex-col justify-between hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
    >
      <div>
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="font-bold text-xl">{title}</h3>
          {isNew && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              NEW!
            </span>
          )}
        </div>
        <p className="text-gray-400 mt-2">{count} Prompts</p>
      </div>
      <div className="flex justify-end mt-4">
        <div className="bg-white text-black rounded-full p-2">
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
