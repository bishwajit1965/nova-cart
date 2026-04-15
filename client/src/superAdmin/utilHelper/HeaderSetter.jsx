const HeaderSetter = ({ title, icon }) => {
  return (
    <div className="lg:mb-4 mb-2">
      <h2 className="flex items-center gap-2 lg:text-xl text-lg font-bold text-base-content/70">
        <span>{icon ? icon : null}</span>
        <span>{title ? title : ""}</span>
      </h2>
    </div>
  );
};

export default HeaderSetter;
