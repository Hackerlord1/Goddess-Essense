// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-hero">
      <div className="text-center px-4">
        {/* Decorative Elements */}
        <div className="mb-8">
          <span className="font-script text-8xl md:text-9xl text-primary-300">
            Oops!
          </span>
        </div>

        {/* 404 Number */}
        <h1 className="font-display text-6xl md:text-8xl text-goddess-dark mb-4">
          4<span className="text-primary-500">0</span>4
        </h1>

        {/* Message */}
        <p className="text-goddess-gray text-lg md:text-xl mb-2">
          Page not found
        </p>
        <p className="text-goddess-gray mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to shopping!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/categories/new-arrivals" className="btn-secondary">
            Shop New Arrivals
          </Link>
        </div>

        {/* Decorative Bottom */}
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-300"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}