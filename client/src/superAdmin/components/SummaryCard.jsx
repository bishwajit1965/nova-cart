const SummaryCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-base-100 rounded-2xl shadow p-4 flex flex-col justify-between border border-base-content/15">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-base-content/70">{title}</h4>
        {Icon && <Icon className="w-5 h-5 text-base-content/50" />}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default SummaryCard;
