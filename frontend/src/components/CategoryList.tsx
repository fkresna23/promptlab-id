import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { getCategories } from "../apiClient"; // Impor dari API Client
import {
  SalesIcon,
  EducationIcon,
  SolopreneursIcon,
  SeoIcon,
  ProductivityIcon,
  WritingIcon,
  BusinessIcon,
  MarketingIcon,
} from "./icons";

interface ApiCategory {
  _id: string;
  icon: string;
  title: string;
  count: number;
  isNew?: boolean;
}
const iconMap: { [key: string]: React.ReactNode } = {
  SalesIcon: <SalesIcon />,
  EducationIcon: <EducationIcon />,
  SolopreneursIcon: <SolopreneursIcon />,
  SeoIcon: <SeoIcon />,
  ProductivityIcon: <ProductivityIcon />,
  WritingIcon: <WritingIcon />,
  BusinessIcon: <BusinessIcon />,
  MarketingIcon: <MarketingIcon />,
};

interface CategoryListProps {
  handleCategoryClick: (id: string, name: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ handleCategoryClick }) => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Gunakan fungsi dari API Client
        setCategories(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading)
    return <div className="text-center py-16">Memuat kategori...</div>;
  if (error)
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Prompt Library Categories:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            icon={iconMap[category.icon] || <SalesIcon />}
            title={category.title}
            count={category.count}
            isNew={category.isNew}
            onClick={() => handleCategoryClick(category._id, category.title)}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
