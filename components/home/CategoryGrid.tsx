// components/home/CategoryGrid.tsx

import CategoryCard from "./CategoryCard";

const categories = [
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    color: "pink",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
  },
  {
    name: "Best Sellers",
    slug: "best-sellers",
    color: "purple",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
  },
  {
    name: "Dresses",
    slug: "dresses",
    color: "coral",
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=500&fit=crop",
  },
  {
    name: "Tops & Blouses",
    slug: "tops",
    color: "mint",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
  },
  {
    name: "Skirts & Bottoms",
    slug: "bottoms",
    color: "violet",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
  },
  {
    name: "Sale",
    slug: "sale",
    color: "gold",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=500&fit=crop",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container-goddess">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="font-script text-xl md:text-2xl text-primary-500">Explore</span>
          <h2 className="font-display text-2xl md:text-3xl text-goddess-dark mt-1">
            Shop by <span className="text-gradient">Category</span>
          </h2>
        </div>

        {/* Category Grid - 6 items */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              image={category.image}
              color={category.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}