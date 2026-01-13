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
