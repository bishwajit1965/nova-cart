import { useEffect, useState } from "react";

const useSubmitDelayedValue = (value, delay) => {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return delayedValue;
};

export default useSubmitDelayedValue;

// import { useEffect, useState } from "react";

// const useSubmitDelayedValue = (value, delay) => {
//   const [delayedValue, setDelayedValue] = useState(value);

//   useEffect(() => {
//     if (value) {
//       const timeout = setTimeout(() => setDelayedValue(true), delay);
//       return () => clearTimeout(timeout);
//     } else {
//       setDelayedValue(false);
//     }
//   }, [value, delay]);

//   return delayedValue;
// };

// export default useSubmitDelayedValue;
