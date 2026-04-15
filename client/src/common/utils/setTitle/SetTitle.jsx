import React from "react";

const SetTitle = ({
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
        <h1 className="lg:text-2xl text-[18px] font-extrabold flex items-center justify-center space-x-1">
          {icon && (
            <span className="p-1 rounded-full bg-base-content/10 text-base-content/70 shadow-sm border border-base-content/10">
              {React.cloneElement(icon, {
                className: "w-3 h-3 lg:w-5 lg:h-5",
              })}
            </span>
          )}
          <span className="capitalize">{userStatus}</span>
          <span className="lg:space-x-4 space-x-2">
            <span className="text-base-content/70">{title}</span>
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

      {subTitle && (
        <h2 className="lg:text-xl text-sm font-semibold text-base-content/60 max-w-xl mx-auto">
          {subTitle}
        </h2>
      )}

      <p className="lg:text-normal text-sm lg:max-w-2xl mx-auto text-base-content/70">
        {description}
      </p>

      <div className="lg:w-32 w-28 h-1 bg-primary mx-auto lg:mb-5 mb-4 rounded-full shadow-md" />
    </div>
  );
};

export default SetTitle;
