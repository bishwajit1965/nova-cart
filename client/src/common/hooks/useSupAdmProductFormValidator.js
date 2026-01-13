import { useCallback, useState } from "react";

const useSupAdmProductFormValidator = (validationRules) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    async (formData) => {
      const newErrors = {};

      // Variant validation
      formData.variants.forEach((v, idx) => {
        if (!v.color?.trim())
          newErrors[`variant_${idx}_color`] = "Color is required";
        if (!v.size?.trim())
          newErrors[`variant_${idx}_size`] = "Size is required";
        if (!v.price) newErrors[`variant_${idx}_price`] = "Price is required";
        if (!v.stock && v.stock !== 0)
          newErrors[`variant_${idx}_stock`] = "Stock is required";
      });

      for (const key in formData) {
        const value = formData[key];
        const rules = validationRules[key];

        if (!rules) continue; // Skip if no validation rules for this field

        // Required
        if (rules.required && !value?.toString().trim()) {
          newErrors[key] =
            rules.required.message ||
            `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          continue;
        }

        // Pattern
        if (rules.pattern && value && !rules.pattern.value.test(value)) {
          newErrors[key] =
            rules.pattern.message ||
            `${key.charAt(0).toUpperCase() + key.slice(1)} format is invalid`;
          continue;
        }

        // Minimum length
        if (rules.minLength && value && value.length < rules.minLength.value) {
          newErrors[key] =
            rules.minLength.message ||
            `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${
              rules.minLength.value
            } characters`;
          continue;
        }

        // Custom (async or sync)
        if (rules.custom) {
          const result = rules.custom(value, formData);

          if (result instanceof Promise) {
            const asyncError = await result;
            if (asyncError) {
              newErrors[key] = asyncError;
              continue;
            }
          } else if (result) {
            newErrors[key] = result;
            continue;
          }
        }
      }

      setErrors(newErrors);

      // Clear errors automatically after 2 seconds
      if (Object.keys(newErrors).length > 0) {
        setTimeout(() => setErrors({}), 2000);
      }

      return Object.keys(newErrors).length === 0;
    },
    [validationRules]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    setFieldError,
  };
};

export default useSupAdmProductFormValidator;
