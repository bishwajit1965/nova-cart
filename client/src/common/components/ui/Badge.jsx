const Badge = ({ color = "blue", children }) => {
  const colors = {
    blue: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-500",
    green: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    gray: "bg-gray-300 text-red-800 dark:bg-red-800 dark:text-red-200",
    red: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
  };

  return (
    <span
      className={`px-2.5 py-[3px] shadow-sm rounded-full text-sm font-medium border border-base-content/15 ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
