import { Star, StarHalf, StarOffIcon } from "lucide-react";

const StarRating = ({ rating }) => {
  const r = Math.round((Number(rating) || 0) * 2) / 2; // rounds to nearest 0.5

  return (
    <div className="flex justify-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(r)) {
          return (
            <Star key={i} size={18} className="text-amber-600 opacity-100" />
          );
        } else if (i === Math.floor(r) && r % 1 !== 0) {
          return (
            <StarHalf
              key={i}
              size={18}
              className="text-amber-600 opacity-100"
            />
          );
        } else {
          return (
            <StarOffIcon
              key={i}
              size={18}
              className="text-amber-600 opacity-50"
            />
          );
        }
      })}
    </div>
  );
};

export default StarRating;
