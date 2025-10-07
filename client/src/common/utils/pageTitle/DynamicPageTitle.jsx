const DynamicPageTitle = ({ pageTitle }) => {
  return (
    <div className="lg:mb-10 mb-5 border border-base-content/5 rounded-t-lg bg-linear-to-b from-base-100 to-base-300 shadow-sm">
      {pageTitle && (
        <div className="flex justify-center lg:py-6 py-2">
          <h2 className="lg:text-4xl text-xl lg:font-extrabold font-bold">
            {pageTitle}
          </h2>
        </div>
      )}
    </div>
  );
};

export default DynamicPageTitle;
