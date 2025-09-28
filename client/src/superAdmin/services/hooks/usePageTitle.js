import { useLocation } from "react-router-dom";

const usePageTitle = () => {
  const location = useLocation();

  const formatPathName = (pathname) => {
    const segments = pathname.split("/").filter(Boolean); // Remove empty strings

    // If last segment is an ID (likely ObjectId or number), exclude it
    const lastSegment = segments[segments.length - 1];
    // if (lastSegment && (lastSegment.length > 12 || !isNaN(lastSegment))) {
    //   segments.pop(); // Remove last segment
    // }

    // Remove last segment only if it looks like an ID (number or 24-char hex)
    if (
      lastSegment &&
      (!isNaN(lastSegment) || /^[0-9a-fA-F]{24}$/.test(lastSegment))
    ) {
      segments.pop();
    }

    const readable = segments
      .pop() // Use last remaining segment for title
      ?.replace(/-/g, " ") // hyphens → spaces
      ?.replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to spaced
      ?.split(" ") // split into words
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
      ?.join(" ");

    return readable || "Home";
  };

  return formatPathName(location.pathname);
};

export default usePageTitle;
