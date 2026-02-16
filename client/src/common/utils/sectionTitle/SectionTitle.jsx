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
    <div className=" lg:space-y-4 space-y-2 text-center w-full z-30">
      <div className="text-base-content/90">
        <h1 className="lg:text-5xl text-sm font-extrabold flex items-center justify-center space-x-2">
          {icon && (
            <span className="lg:p-2 p-1 rounded-full bg-primary/10 text-primary shadow-sm">
              {icon}
            </span>
          )}
          <span className="capitalize">{userStatus}</span>
          <span className="lg:space-x-4 space-x-2">
            <span>{title}</span>
            <span className="text-amber-600 text-shadow-amber-500 shadow-amber-300">
              {decoratedText}
            </span>
          </span>{" "}
          {dataLength && (
            <span className="lg:w-10 lg:h-10 w-6 h-6 rounded-full bg-indigo-600 border-2 border-base-100 lg:text-xl text-sm font-bold text-white flex items-center justify-center shadow-sm mt-1">
              {dataLength}
            </span>
          )}
          {activeStatus && <span>{activeStatus}</span>}
        </h1>
      </div>
      <div className="">
        {subTitle && (
          <h2 className="lg:text-xl text-sm font-semibold text-base-content/60 max-w-xl mx-auto">
            {subTitle}
          </h2>
        )}
      </div>
      <div className="">
        <p className="lg:text-lg text-sm lg:max-w-96 mx-auto">{description}</p>
      </div>

      <div className="lg:w-32 w-28 h-1.5 bg-primary mx-auto lg:my-6 my-2 rounded-full shadow-md" />
    </div>
  );
};

export default SectionTitle;
