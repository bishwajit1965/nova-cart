import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import Textarea from "../../common/components/ui/Textarea";
import { LucidePlug2 } from "lucide-react";

const SuperAdminProductInsertForm = ({
  formData,
  setFormData,
  categories,
  subCategories,
  categoryDataStatus,
  subCategoryDataStatus,
  onFormSubmit,
  editingProduct,
  onDelay,
  onMutation,
  setEditingProduct,
  errors,
}) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const hasVariants = formData.variants && formData.variants.length > 0;

  const getPreviewURL = (img) => {
    // If File → temporary preview
    if (img instanceof File) return URL.createObjectURL(img);

    // If string → use server URL
    if (typeof img === "string") {
      return `${apiURL}/${img.replace(/^\//, "")}`;
    }

    return "";
  };

  /** Handle generic input */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** Handle product-level image input */
  const handleProductFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  /** Handle variant change */
  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    setFormData({ ...formData, variants: updated });
  };

  /** Handle variant images */
  const handleVariantImagesChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updated = [...formData.variants];
    updated[index].images = files;
    setFormData({ ...formData, variants: updated });
  };

  /** Add / Remove variant */
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          color: "",
          size: "",
          price: 0,
          discountPrice: 0,
          SKU: "",
          stock: 0,
          images: [],
        },
      ],
    });
  };

  const removeVariant = (index) => {
    const removedVariantStock = formData.variants[index]?.stock || 0;
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      variants: updated,
      stock: updated.length === 0 ? removedVariantStock : formData.stock,
    });
  };

  return (
    <div className="lg:space-y-4">
      <h2 className="lg:text-2xl text-xl font-bold flex items-center gap-2">
        {editingProduct ? <LucideIcon.Edit /> : <LucideIcon.Plus />}
        {editingProduct ? "Edit Product" : "Add Product"}
      </h2>

      <form
        onSubmit={onFormSubmit}
        className="space-y-3"
        encType="multipart/form-data"
      >
        {/* Basic Fields */}
        <Input
          type="text"
          name="name"
          placeholder="Product Name..."
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm -mt-3">{errors.name}</p>
        )}
        <Textarea
          name="description"
          placeholder="Description..."
          value={formData.description}
          onChange={handleInputChange}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}

        <Input
          type="number"
          name="price"
          placeholder="Price..."
          value={formData.price}
          onChange={handleInputChange}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

        {/* Category */}
        {categoryDataStatus.status !== "success" ? (
          categoryDataStatus.content
        ) : (
          <select
            name="category"
            value={formData.category?._id || formData.category || ""}
            onChange={handleInputChange}
            className="border w-full p-2 rounded border-base-content/15"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}

        {/* Sub-category */}
        {subCategoryDataStatus.status !== "success" ? (
          subCategoryDataStatus.content
        ) : (
          <select
            name="subCategory"
            value={formData.subCategory?._id || formData.subCategory || ""}
            onChange={handleInputChange}
            className="border w-full p-2 rounded border-base-content/15"
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((sc) => (
              <option key={sc._id} value={sc._id}>
                {sc.name}
              </option>
            ))}
          </select>
        )}

        {errors.subCategory && (
          <p className="text-red-500 text-sm">{errors.subCategory}</p>
        )}
        <Input
          type="text"
          name="brand"
          placeholder="Brand..."
          value={formData.brand}
          onChange={handleInputChange}
        />
        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}

        {/* Rating */}
        <Input
          type="number"
          name="rating"
          min="0"
          max="5"
          step="0.5"
          placeholder="Rating (0-5)..."
          value={formData.rating}
          onChange={handleInputChange}
        />
        {errors.rating && (
          <p className="text-red-500 text-sm">{errors.rating}</p>
        )}

        {/* Reviews Count */}
        <Input
          type="number"
          name="reviewsCount"
          min="0"
          placeholder="Reviews Count..."
          value={formData.reviewsCount}
          onChange={handleInputChange}
        />
        {errors.reviewsCount && (
          <p className="text-red-500 text-sm">{errors.reviewsCount}</p>
        )}

        {/* Product-level images */}
        <Input
          type="file"
          name="images"
          multiple
          placeholder="Product Images..."
          onChange={handleProductFilesChange}
          className="file-input px-0"
        />
        {formData.images?.length > 0 && (
          <div className="flex gap-2 mt-2">
            {formData.images.map((img, i) => (
              <img
                key={i}
                src={getPreviewURL(img)}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
        {/* Quantity for non-variant products */}
        {!hasVariants && (
          <Input
            type="number"
            name="stock"
            min="1"
            max="50"
            placeholder="Quantity..."
            value={formData.stock}
            onChange={handleInputChange}
          />
        )}
        {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        {/* Variants */}
        {formData.variants.map((variant, idx) => (
          <div
            key={idx}
            className="border border-base-content/15 p-2 rounded mb-2 space-y-2"
          >
            <div className="grid grid-cols-6 gap-2">
              <Input
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(idx, "color", e.target.value)
                }
              />
              {errors[`variant_${idx}_color`] && (
                <p className="text-red-500 text-sm col-span-6">
                  {errors[`variant_${idx}_color`]}
                </p>
              )}

              <Input
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(idx, "size", e.target.value)
                }
              />
              {errors[`variant_${idx}_size`] && (
                <p className="text-red-500 text-sm col-span-6">
                  {errors[`variant_${idx}_size`]}
                </p>
              )}
              <Input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(idx, "price", e.target.value)
                }
              />
              {errors[`variant_${idx}_price`] && (
                <p className="text-red-500 text-sm col-span-6">
                  {errors[`variant_${idx}_price`]}
                </p>
              )}
              <Input
                type="number"
                placeholder="Discount Price"
                value={variant.discountPrice}
                onChange={(e) =>
                  handleVariantChange(idx, "discountPrice", e.target.value)
                }
              />
              <Input
                placeholder="SKU"
                value={variant.SKU}
                onChange={(e) =>
                  handleVariantChange(idx, "SKU", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(idx, "stock", e.target.value)
                }
              />
              {errors[`variant_${idx}_stock`] && (
                <p className="text-red-500 text-sm col-span-6">
                  {errors[`variant_${idx}_stock`]}
                </p>
              )}
            </div>

            {/* Variant Images */}
            <Input
              type="file"
              multiple
              onChange={(e) => handleVariantImagesChange(idx, e)}
              className="file-input px-0 block mt-3"
            />

            <div className="flex justify-between items-center">
              {variant.images?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {variant.images.map((img, i) => (
                    <img
                      key={i}
                      src={getPreviewURL(img)}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="">
                <Button
                  type="button"
                  variant="danger"
                  icon={LucideIcon.Trash2}
                  onClick={() => removeVariant(idx)}
                  className=""
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="lg:flex grid items-center justify-between gap-2 py-2">
          <Button
            type="button"
            variant="indigo"
            onClick={addVariant}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            <LucidePlug2 size={18} /> Add Variant
          </Button>
          {formData.variants.length !== 0 && (
            <div className="border-2 rounded-md border-indigo-500/50 p-1 shadow">
              <p className="font-normal">No variant ? remove variant option.</p>
            </div>
          )}
        </div>

        <div className="divider m-0">Add Variant or Create</div>

        {/* Submit Buttons */}

        <div className="mt-4 flex items-center space-x-4">
          <Button
            type="submit"
            variant="success"
            loading={onMutation.isPending}
            disabled={onMutation.isPending}
            icon={
              onDelay
                ? LucideIcon.Check
                : editingProduct
                  ? LucideIcon.Edit
                  : LucideIcon.Plus
            }
          >
            {onDelay ? "Saving..." : editingProduct ? "Update" : "Create"}
          </Button>

          {editingProduct && (
            <Button
              type="button"
              variant="warning"
              icon={LucideIcon.X}
              className="text-2xl"
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  price: 0,
                  category: "",
                  subCategory: "",
                  brand: "",
                  images: [],
                  stock: 0,
                  variants: [
                    {
                      color: "",
                      size: "",
                      price: 0,
                      discountPrice: 0,
                      SKU: "",
                      stock: 0,
                      images: [],
                    },
                  ],
                });
                setEditingProduct(null);
              }}
            >
              Close
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SuperAdminProductInsertForm;
