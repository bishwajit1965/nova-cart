import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import Textarea from "../../common/components/ui/Textarea";
import { useState } from "react";
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
}) => {
  const [selectedProductImages, setSelectedProductImages] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
    setSelectedProductImages(files);
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
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
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
        enctype="multipart/form-data"
      >
        {/* Basic Fields */}
        <Input
          type="text"
          name="name"
          placeholder="Product Name..."
          value={formData.name}
          onChange={handleInputChange}
        />
        <Textarea
          name="description"
          placeholder="Description..."
          value={formData.description}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="price"
          placeholder="Price..."
          value={formData.price}
          onChange={handleInputChange}
        />

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

        <Input
          type="text"
          name="brand"
          placeholder="Brand..."
          value={formData.brand}
          onChange={handleInputChange}
        />

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
              <Input
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(idx, "size", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(idx, "price", e.target.value)
                }
              />
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

        <Button
          type="button"
          variant="indigo"
          onClick={addVariant}
          className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
        >
          <LucidePlug2 size={18} /> Add Variant
        </Button>

        <div className="divider">Add Variant or Create</div>

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

// import Button from "../../common/components/ui/Button";
// import { Input } from "../../common/components/ui/Input";
// import { LucideIcon } from "../../common/lib/LucideIcons";
// import Textarea from "../../common/components/ui/Textarea";
// import { useState } from "react";
// import { Plug2Icon } from "lucide-react";

// const SuperAdminProductInsertForm = ({
//   formData,
//   setFormData,
//   categories,
//   subCategories,
//   categoryDataStatus,
//   subCategoryDataStatus,
//   onFormSubmit,
//   editingProduct,
//   onDelay,
//   onMutation,
//   setEditingProduct,
// }) => {
//   const [selectedImages, setSelectedImages] = useState([]);

//   const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
//   /** Handle generic input */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   /** Handle image file input */
//   const handleFilesChange = (e) => {
//     setFormData({
//       ...formData,
//       images: Array.from(e.target.files), // store actual File objects
//     });
//     const files = Array.from(e.target.files);
//     setSelectedImages(files);
//   };

//   /** Handle variant images change */
//   const handleVariantImagesChange = (index, e) => {
//     const files = Array.from(e.target.files);
//     const updated = [...formData.variants];
//     updated[index].images = files;
//     setFormData({ ...formData, variants: updated });
//   };

//   /** Handle variant change */
//   const handleVariantChange = (index, field, value) => {
//     const updated = [...formData.variants];
//     updated[index][field] = value;
//     setFormData({ ...formData, variants: updated });
//   };

//   /** Add / Remove variant */
//   const addVariant = () => {
//     setFormData({
//       ...formData,
//       variants: [
//         ...formData.variants,
//         { color: "", size: "", price: 0, discountPrice: 0, SKU: "", stock: 0 },
//       ],
//     });
//   };

//   const removeVariant = (index) => {
//     const updated = formData.variants.filter((_, i) => i !== index);
//     setFormData({ ...formData, variants: updated });
//   };

//   return (
//     <div className="lg:space-y-4">
//       <div className="">
//         <h2 className="lg:text-2xl text-xl font-bold">
//           {editingProduct ? "Edit Product" : "Add Product"}
//         </h2>
//       </div>
//       <form onSubmit={onFormSubmit} className="space-y-3">
//         <Input
//           type="text"
//           name="name"
//           placeholder="Product Name..."
//           value={formData.name}
//           onChange={handleInputChange}
//           className=""
//         />
//         <Textarea
//           name="description"
//           placeholder="Description..."
//           value={formData.description}
//           onChange={handleInputChange}
//         />
//         <Input
//           type="number"
//           name="price"
//           placeholder="Price..."
//           value={formData.price}
//           onChange={handleInputChange}
//         />

//         {/* Category */}
//         {categoryDataStatus.status !== "success" ? (
//           categoryDataStatus.content
//         ) : (
//           <select
//             name="category"
//             value={formData.category?._id || formData.category || ""}
//             onChange={handleInputChange}
//             className="border w-full p-2 rounded border-base-content/15"
//           >
//             <option value="">Select Category</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Sub-category */}
//         {subCategoryDataStatus.status !== "success" ? (
//           subCategoryDataStatus.content
//         ) : (
//           <select
//             name="subCategory"
//             value={formData.subCategory?._id || formData.subCategory || ""}
//             onChange={handleInputChange}
//             className="border w-full p-2 rounded border-base-content/15"
//           >
//             <option value="">Select Sub Category</option>
//             {subCategories.map((sc) => (
//               <option key={sc._id} value={sc._id}>
//                 {sc.name}
//               </option>
//             ))}
//           </select>
//         )}

//         <Input
//           type="text"
//           name="brand"
//           placeholder="Brand..."
//           value={formData.brand}
//           onChange={handleInputChange}
//         />
//         <Input
//           type="file"
//           name="images"
//           multiple
//           placeholder="Image URL(Comma separated)..."
//           onChange={handleFilesChange}
//           className="file-input px-0"
//         />

//         {/* Variants */}
//         {formData.variants.map((variant, idx) => (
//           <div key={idx} className="grid grid-cols-6 gap-2 mb-2">
//             <Input
//               placeholder="Color"
//               value={variant.color}
//               onChange={(e) =>
//                 handleVariantChange(idx, "color", e.target.value)
//               }
//               className=""
//             />
//             <Input
//               placeholder="Size"
//               value={variant.size}
//               onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
//             />
//             <Input
//               type="number"
//               placeholder="Price"
//               value={variant.price}
//               onChange={(e) =>
//                 handleVariantChange(idx, "price", e.target.value)
//               }
//             />
//             <Input
//               type="number"
//               placeholder="Discount Price"
//               value={variant.discountPrice}
//               onChange={(e) =>
//                 handleVariantChange(idx, "discountPrice", e.target.value)
//               }
//             />

//             <Input
//               placeholder="SKU"
//               value={variant.SKU}
//               onChange={(e) => handleVariantChange(idx, "SKU", e.target.value)}
//             />

//             <Input
//               type="number"
//               placeholder="Stock..."
//               value={variant.stock}
//               onChange={(e) =>
//                 handleVariantChange(idx, "stock", e.target.value)
//               }
//             />
//             <div className="col-span-12 mt-2">
//               <Input
//                 type="file"
//                 multiple
//                 onChange={(e) => handleVariantImagesChange(idx, e)}
//                 className="file-input px-0 block col-span-12"
//               />
//             </div>
//             <div className="flex justify-between items-center col-span-12">
//               <div className="">
//                 {variant.images?.length > 0 && (
//                   <div className="flex gap-2 mt-2">
//                     {variant.images.map((file, i) => (
//                       <img
//                         key={i}
//                         src={URL.createObjectURL(file)}
//                         className="w-16 h-16 rounded object-cover"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="mr-0 col-span-12 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => removeVariant(idx)}
//                   className="text-red-500"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={addVariant}
//           className="bg-indigo-600 text-white flex items-center px-3 py-1 rounded mt-2 gap-1"
//         >
//           <Plug2Icon size={18} /> Add Variant
//         </button>
//         <div className="divider m-0"></div>
//         <div className="flex items-center rounded-md space-x-2">
//           {editingProduct?.images?.map((prod) => (
//             <img src={` ${apiURL}${prod}`} className="h-14 w-14 rounded-md" />
//           ))}
//         </div>
//         <div className="mt-4 flex items-center space-x-4">
//           <Button
//             type="submit"
//             loading={onMutation.isPending}
//             disabled={onMutation.isPending}
//             icon={
//               onDelay
//                 ? LucideIcon.Check
//                 : editingProduct
//                 ? LucideIcon.Edit
//                 : LucideIcon.Plus
//             }
//             className=""
//           >
//             {onDelay
//               ? "Saving..."
//               : editingProduct
//               ? "Update Product"
//               : "Create Product"}
//           </Button>
//           {editingProduct && (
//             <Button
//               onClick={() =>
//                 setFormData({
//                   name: "",
//                   description: "",
//                   price: 0,
//                   category: "",
//                   subCategory: "",
//                   brand: "",
//                   images: [],
//                   stock: 0,
//                   variants: [
//                     {
//                       color: "",
//                       size: "",
//                       price: 0,
//                       discountPrice: 0,
//                       SKU: "",
//                       stock: 0,
//                     },
//                   ],
//                 }) & setEditingProduct(null)
//               }
//               type="button"
//               variant="warning"
//               icon={LucideIcon.X}
//               className="text-2xl"
//             >
//               Close
//             </Button>
//           )}
//         </div>
//       </form>{" "}
//       {/* ------> Preview the uploadable images ------> */}
//       {selectedImages.length !== 0 && (
//         <div className="space-y-4">
//           <div className="image-preview-container flex gap-2 mt-4">
//             {selectedImages.map((file, index) => (
//               <img
//                 key={index}
//                 src={URL.createObjectURL(file)}
//                 alt="preview"
//                 className="w-20 h-20 object-cover rounded"
//               />
//             ))}
//           </div>
//           <Button
//             onClick={() => setSelectedImages([])}
//             icon={LucideIcon.X}
//             variant="warning"
//           >
//             clear Preview
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuperAdminProductInsertForm;
