// components/home/CategoryCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  color: string;
}

const colorVariants: Record<string, string> = {
  pink: "from-pink-400/80 to-pink-600/80",
  purple: "from-purple-400/80 to-purple-600/80",
  blue: "from-blue-400/80 to-blue-600/80",
  coral: "from-orange-400/80 to-pink-500/80",
  mint: "from-emerald-400/80 to-teal-500/80",
  gold: "from-amber-400/80 to-orange-500/80",
  rose: "from-rose-400/80 to-rose-600/80",
  violet: "from-violet-400/80 to-violet-600/80",
};

export default function CategoryCard({ name, slug, image, color }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative block aspect-[4/5] rounded-xl overflow-hidden shadow-soft hover:shadow-goddess transition-all duration-300"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 33vw, 16vw"
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t opacity-60 group-hover:opacity-75 transition-opacity duration-300",
          colorVariants[color] || colorVariants.pink
        )}
      />

      {/* Decorative Circle */}
      <div className="absolute top-2 right-2 w-6 h-6 border-2 border-white/30 rounded-full" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
        <h3 className="font-display text-sm md:text-lg text-white font-semibold drop-shadow-lg leading-tight">
          {name}
        </h3>
        
        {/* Arrow on hover */}
        <div className="mt-1 flex items-center gap-1 text-white/80 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Shop</span>
          <svg 
            className="w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}