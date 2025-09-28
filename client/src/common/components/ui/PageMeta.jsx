// src/components/common/PageMeta.jsx

import { useEffect } from "react";

/**
 * PageMeta Component
 *
 * Usage:
 * <PageMeta title="Cart | Nova-Cart" description="View and manage your cart" />
 */
export const PageMeta = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null; // No visible UI
};

export default PageMeta;
