const StarRating = ({ rating }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <span
        key={i}
        className={`text-yellow-500 text-2xl ${
          i < rating ? "opacity-100" : "opacity-30"
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex justify-center space-x-1">{stars}</div>;
};
export default StarRating;
