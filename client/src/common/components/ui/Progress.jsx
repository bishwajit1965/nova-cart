const Progress = ({ value = 0, className = "" }) => {
  return (
    <div
      className={`w-full h-4 bg-white/30 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;
