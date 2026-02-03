// components/home/HeroSection.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    title: "NEW ARRIVALS",
    subtitle: "Discover the latest trends in women's fashion",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=500&fit=crop",
    buttonText: "Shop Now",
    link: "/categories/new-arrivals",
  },
  {
    id: 2,
    title: "SUMMER COLLECTION",
    subtitle: "Light, breezy styles for sunny days ahead",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=500&fit=crop",
    buttonText: "Explore",
    link: "/categories/dresses",
  },
  {
    id: 3,
    title: "UP TO 50% OFF",
    subtitle: "Don't miss our biggest sale of the season",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=500&fit=crop",
    buttonText: "Shop Sale",
    link: "/categories/sale",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-goddess text-center text-white">
              <p className="text-white/80 font-light text-sm md:text-base mb-1">
                Shop All
              </p>
              <h1
                className={cn(
                  "font-display text-3xl md:text-5xl lg:text-6xl mb-3 drop-shadow-lg transition-all duration-700",
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                )}
              >
                {slide.title}
              </h1>
              
              <p
                className={cn(
                  "text-sm md:text-base text-white/90 mb-5 max-w-md mx-auto transition-all duration-700 delay-100",
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                )}
              >
                {slide.subtitle}
              </p>

              <Link
                href={slide.link}
                className={cn(
                  "inline-block bg-white text-goddess-dark px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
                  index === currentSlide
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-8 opacity-0"
                )}
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white w-6"
                : "bg-white/50 w-2 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}