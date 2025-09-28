import { useCallback, useState } from "react";

const useValidator = (validationRules, formData) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const newErrors = {};

    for (const field in validationRules) {
      const value = formData[field];
      const rules = validationRules[field];

      if (rules.required && !value?.toString().trim()) {
        newErrors[field] = rules.required.message || "This field is required";
        continue;
      }

      if (rules.pattern && value && !rules.pattern.value.test(value)) {
        newErrors[field] = rules.pattern.message || "Invalid format";
        continue;
      }

      if (rules.minLength && value && value.length < rules.minLength.value) {
        newErrors[field] =
          rules.minLength.message ||
          `Minimum length is ${rules.minLength.value}`;
        continue;
      }

      if (rules.custom && typeof rules.custom === "function") {
        const customError = rules.custom(value, formData);
        if (customError) {
          newErrors[field] = customError;
          continue;
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => setErrors({}), 2000);
    }
    return Object.keys(newErrors).length === 0;
  }, [validationRules, formData]);

  return { errors, validate };
};

export default useValidator;
