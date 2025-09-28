const DynamicPageTitle = ({ pageTitle }) => {
  return (
    <div className="lg:pb-12 pb-6 border-base-content/20">
      {pageTitle && (
        <div className="flex justify-center">
          <h2 className="lg:text-4xl text-xl lg:font-extrabold font-bold">
            {pageTitle}
          </h2>
        </div>
      )}
    </div>
  );
};

export default DynamicPageTitle;
