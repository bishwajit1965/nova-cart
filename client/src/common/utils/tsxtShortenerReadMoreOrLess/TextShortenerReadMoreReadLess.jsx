import { useState } from "react";

const ReadMore = ({ text = "", maxLength = 100 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxLength;
  const displayText =
    expanded || !isLong ? text : text.slice(0, maxLength) + " (...)";

  return (
    <p className="text-sm text-gray-500 mb-4">
      {displayText}{" "}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-600 font-semibold ml-1"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </p>
  );
};

export default ReadMore;

// USAGE
{
  /* <ReadMore text={isModalOpen?.product?.description} maxLength={200} />; */
}
