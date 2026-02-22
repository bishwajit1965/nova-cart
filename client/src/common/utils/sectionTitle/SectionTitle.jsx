import React from "react";

const SectionTitle = ({
  title,
  subTitle,
  userStatus,
  isActive,
  decoratedText,
  description,
  icon,
  dataLength,
  badgeSize = { lg: 40, sm: 24 }, // default sizes
}) => {
  const badgeClasses = `
    rounded-full bg-indigo-600 border-2 border-amber-500
    font-bold text-white flex items-center justify-center shadow-sm  rounded-full bg-indigo-600 border-2 border-base-100 lg:text-xl text-sm font-bold text-white flex items-center justify-center shadow-sm mt-1 lg:p-4 p-3
  `;

  return (
    <div className="lg:space-y-3 space-y-2 text-center w-full z-30">
      <div className="text-base-content/90">
        <h1 className="lg:text-5xl text-[16px] font-extrabold flex items-center justify-center space-x-1">
          {icon && (
            <span className="lg:p-2 p-1 rounded-full bg-primary/10 text-primary shadow-sm">
              {React.cloneElement(icon, {
                className: "w-5 h-5 lg:w-8 lg:h-8",
              })}
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
            <span
              style={{
                width: badgeSize.sm,
                height: badgeSize.sm,
              }}
              className={`lg:text-xl text-sm font-bold ${badgeClasses} lg:w-[${badgeSize.lg}px] lg:h-[${badgeSize.lg}px]`}
            >
              {dataLength}
            </span>
          )}
          {isActive && (
            <span className="tooltip-content flex items-center h-20">
              {isActive}
            </span>
          )}
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

      {/* <div className="flex items-center mx-auto max-w-52 justify-between gap-1 border py-1 px-3 rounded-full bg-base-200 border-base-content/5 shadow">
        <div className="h-1.5 bg-amber-600 w-20 rounded-xl shadow" />
        <div className="w-2 h-2 p-1 rounded-full shadow-2xl bg-orange-400 flex items-center justify-center" />
        <div className="w-4 h-4 p-2 rounded-full shadow-2xl border-2 border-amber-600 bg-orange-500 flex items-center justify-center" />
        <div className="w-2 h-2 p-1 rounded-full shadow-2xl bg-orange-400 flex items-center justify-center" />
        <div className="h-1.5 bg-amber-600 w-20 shadow rounded-xl" />
      </div> */}

      <div className="lg:w-32 w-28 h-1.5 bg-primary mx-auto lg:mb-5 mb-4 rounded-full shadow-md" />
    </div>
  );
};

export default SectionTitle;
