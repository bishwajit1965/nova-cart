import { useEffect } from "react";

const useSEO = ({ title, description, keywords, ogImage, url }) => {
  useEffect(() => {
    if (title) document.title = title;

    // Description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || "";

    // Keywords
    let metaKeywords = document.querySelector("meta[name='keywords']");
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords || "";

    // OpenGraph
    const ogTags = [
      { prop: "og:title", content: title },
      { prop: "og:description", content: description },
      { prop: "og:url", content: url },
      { prop: "og:image", content: ogImage },
    ];

    ogTags.forEach(({ prop, content }) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property='${prop}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, [title, description, keywords, ogImage, url]);
};

export default useSEO;
