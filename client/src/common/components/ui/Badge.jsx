const Badge = ({ color = "blue", children }) => {
  const colors = {
    blue: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-500",
    green: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    gray: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
    red: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
  };

  return (
    <span
      className={`px-2 py-[1px] shadow-sm rounded-full text-sm font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
