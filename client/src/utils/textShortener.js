export const textShortener = (text, maxLength) => {
  if (!text) return;

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + " ....";
  } else {
    return text;
  }
};

export default textShortener;
