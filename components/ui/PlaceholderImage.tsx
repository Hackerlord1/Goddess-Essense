// components/ui/PlaceholderImage.tsx

interface PlaceholderImageProps {
  text?: string;
  category?: "dress" | "top" | "bottom" | "accessory" | "banner";
  className?: string;
}

const categoryColors = {
  dress: "from-pink-200 via-purple-200 to-pink-300",
  top: "from-rose-200 via-pink-200 to-rose-300",
  bottom: "from-violet-200 via-purple-200 to-violet-300",
  accessory: "from-amber-200 via-orange-200 to-amber-300",
  banner: "from-pink-300 via-purple-300 to-indigo-300",
};

const categoryEmojis = {
  dress: "👗",
  top: "👚",
  bottom: "👖",
  accessory: "👜",
  banner: "✨",
};

export default function PlaceholderImage({
  text,
  category = "dress",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${categoryColors[category]} flex flex-col items-center justify-center ${className}`}
    >
      <span className="text-4xl mb-2">{categoryEmojis[category]}</span>
      {text && (
        <span className="font-script text-xl text-white/80 text-center px-4">
          {text}
        </span>
      )}
    </div>
  );
}