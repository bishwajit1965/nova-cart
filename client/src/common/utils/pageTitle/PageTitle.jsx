import { LucideArrowBigLeft, LucideArrowBigRight } from "lucide-react";

import { Link } from "react-router-dom";

const PageTitle = ({
  title,
  decoratedText,
  subtitle,
  dataLength,
  about,
  slogan,
  navigationLink,
  navigationArea,
}) => {
  return (
    <div className="lg:p-6 p-2 text-center shadow-md bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 pb-2 lg:space-y-2 space-y-1 dark:border-b dark:border-slate-700 rounded-t-md dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-gray-900 hover:text-gray-600">
      <h1 className="lg:text-3xl text-xl font-serif font-bold rounded-b-md flex items-center justify-center">
        {title} &nbsp;
        <span className="text-amber-800 dark:text-amber-500">
          {decoratedText} {""} {":"}{" "}
        </span>
        {dataLength ? (
          <span>
            &nbsp;{dataLength}{" "}
            <span className="text-blue-500 dark:text-emerald-400">{about}</span>
          </span>
        ) : (
          ""
        )}
      </h1>

      {subtitle && (
        <h2 className="lg:text-2xl text-xl font-serif max-w-5xl mx-auto hidden lg:block">
          {subtitle}
        </h2>
      )}

      {slogan && (
        <p className="lg:pb-1 text-md font-serif max-w-3xl mx-auto hidden lg:block">
          {slogan}
        </p>
      )}

      {navigationLink && navigationArea && (
        <div className="flex justify-center space-x-4">
          <Link
            to={`/${navigationLink}`}
            className="font-bold text-md flex items-center dark:link-warning hover:link"
          >
            <LucideArrowBigLeft className="mr-2" /> Go to {navigationArea}{" "}
            <LucideArrowBigRight className="ml-2" />
          </Link>
        </div>
      )}

      <div className="w-28 h-1 bg-amber-800 dark:bg-emerald-600 shadow-md mx-auto hidden lg:block rounded-md"></div>
    </div>
  );
};

export default PageTitle;
