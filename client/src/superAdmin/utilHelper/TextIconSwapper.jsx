const TextIconSwapper = ({
  dependency,
  defaultText,
  swapperText,
  iconDefault,
  iconSwapped,
}) => {
  return (
    <div className="lg:mb-4 mb-2">
      <h2 className="flex items-center gap-2 lg:text-xl text-lg font-bold text-base-content/70 capitalize">
        <span>{dependency ? iconSwapped : iconDefault}</span>
        <span>{dependency ? swapperText : defaultText}</span>
      </h2>
    </div>
  );
};

export default TextIconSwapper;
