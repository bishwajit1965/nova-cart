import { useEffect, useState } from "react";

const useTextShortener = (text, maxLength) => {
  const [shortenedText, setShortenedText] = useState(text);

  useEffect(() => {
    if (text.length > maxLength) {
      setShortenedText(text.slice(0, maxLength - 1) + " " + " .... " + " ");
    } else {
      setShortenedText(text);
    }
  }, [text, maxLength]);

  return { shortenedText, fullText: text };
};

export default useTextShortener;
