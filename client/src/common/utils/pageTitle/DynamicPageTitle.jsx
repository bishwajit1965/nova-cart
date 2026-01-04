const DynamicPageTitle = ({ pageTitle, icon }) => {
  return (
    <div className="lg:mb-10 mb-5 border border-base-content/5 rounded-t-lg bg-linear-to-b from-base-100 to-base-300 shadow-sm">
      {pageTitle && (
        <div className="flex items-center justify-center lg:py-5 py-2">
          <h2 className="lg:text-4xl text-lg lg:font-extrabold font-bold flex items-center gap-2">
            <span> {icon}</span> <span>{pageTitle} </span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default DynamicPageTitle;
