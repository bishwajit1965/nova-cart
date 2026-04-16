const HeaderSetter = ({ title, icon, dataLength }) => {
  return (
    <div className="lg:mb-4 mb-2">
      <h2 className="flex items-center gap-2 lg:text-xl text-lg font-bold text-base-content/70">
        <span>{icon ? icon : null}</span>
        <span>{title ? title : ""}</span>
        {dataLength && (
          <span className="w-6 h-6 bg-base-contents text-base-content/80 rounded-full border-2 border-base-content/25 shadow-sm text-sm flex items-center justify-center">
            {dataLength ? dataLength : "N/A"}
          </span>
        )}
      </h2>
    </div>
  );
};

export default HeaderSetter;
