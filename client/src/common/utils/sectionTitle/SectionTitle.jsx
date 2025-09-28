const SectionTitle = ({
  title,
  subTitle,
  userStatus,
  activeStatus,
  decoratedText,
  description,
  icon,
  dataLength,
}) => {
  return (
    <div className="lg:space-y-1 space-y-1 text-center bg-base-200 shadow w-full lg:py-2 py-2 sticky top-[57px] z-40">
      <div className="flex justify-center text-base-content/50">
        <h1 className="lg:text-2xl font-extrabold flex items-center space-x-2">
          <span>{icon}</span>
          <span className="capitalize">{userStatus}</span>
          <span>
            {title}{" "}
            <span className="text-amber-600 text-shadow-amber-500 shadow-amber-300">
              {decoratedText}
            </span>
          </span>{" "}
          <span>{dataLength}</span>
          <span>{activeStatus}</span>
        </h1>
        {subTitle && (
          <h2 className="text-xl font-semibold text-base-content/25">
            {subTitle}
          </h2>
        )}
      </div>
      <div className="">
        <p className="">{description}</p>
      </div>
    </div>
  );
};

export default SectionTitle;
