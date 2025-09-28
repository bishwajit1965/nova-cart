export const generateTags = ({
  name,
  brand,
  categoryId,
  subCategoryId,
  categories,
  subCategories,
}) => {
  const tagsSet = new Set();

  // From product name
  if (name) {
    name
      .trim()
      .split(/\s+/)
      .forEach((t) => tagsSet.add(t.toLowerCase()));
  }

  // From brand
  if (brand) {
    brand
      .trim()
      .split(/\s+/)
      .forEach((t) => tagsSet.add(t.toLowerCase()));
  }

  // From category
  const cat = categories?.find((c) => c._id === categoryId);
  if (cat?.name) {
    cat.name
      .trim()
      .split(/\s+/)
      .forEach((t) => tagsSet.add(t.toLowerCase()));
  }

  // From subCategory
  const subCat = subCategories?.find((s) => s._id === subCategoryId);
  if (subCat?.name) {
    subCat.name
      .trim()
      .split(/\s+/)
      .forEach((t) => tagsSet.add(t.toLowerCase()));
  }

  return Array.from(tagsSet);
};

export default { generateTags };
