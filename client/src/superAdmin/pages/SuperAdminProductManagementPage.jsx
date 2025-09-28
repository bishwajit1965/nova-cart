import API_PATHS from "../services/apiPaths/apiPaths";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import SuperAdminProductInsertForm from "../components/SuperAdminProductInsertForm";
import SuperAdminProductListTable from "../components/SuperAdminProductListTable";
import { generateTags } from "../../common/utils/generateTag/generateTag";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import useSubmitDelayedValue from "../services/hooks/useSubmitDelayedValue";

const SuperAdminProductManagementPage = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    subCategory: "",
    brand: "",
    images: [],
    stock: 0,
    variants: [
      { color: "", size: "", price: 0, discountPrice: 0, SKU: "", stock: 0 },
    ],
  });

  /*** ------> Category fetch ------> */
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: errorCategory,
  } = useApiQuery({
    url: API_PATHS.CATEGORIES.ENDPOINT,
    queryKey: API_PATHS.CATEGORIES.KEY,
  });

  /*** ------> Sub Category fetch ------> */
  const {
    data: subCategories,
    isLoading: isSubCategoryLoading,
    isError: isSubCategoryError,
    error: errorSubCategory,
  } = useApiQuery({
    url: API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_ENDPOINT,
    queryKey: API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_KEY,
  });

  /*** ------> Product Create / Update Mutation ------> */
  const productMutation = useApiMutation({
    method: editingProduct ? "update" : "create",
    path: editingProduct
      ? (payload) => `${API_PATHS.PRODUCTS.ENDPOINT}/${payload._id}`
      : API_PATHS.PRODUCTS.ENDPOINT,
    key: API_PATHS.PRODUCTS.KEY,
    onSuccess: () => {
      toast.success(
        `Product ${editingProduct ? "updated" : "created"} successfully!`
      );
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
          },
        ],
      });
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error("Error saving product");
      console.error(error);
    },
  });

  /*** ------> Product Delete Mutation ------> */
  const deleteProductMutation = useApiMutation({
    method: "delete",
    path: (id) => `${API_PATHS.PRODUCTS.ENDPOINT}/${id}`,
    key: API_PATHS.PRODUCTS.KEY,
  });

  /** --------> Delayed value for good UI experience --------> */
  const delayedIsSubmitting = useSubmitDelayedValue(
    productMutation.isPending,
    300 // ms
  );

  /*** ------> Submit handler ------> */
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1️⃣ Generate tags
    const tags = generateTags({
      name: formData.name,
      brand: formData.brand,
      categoryId: formData.category,
      subCategoryId: formData.subCategory,
      categories,
      subCategories,
    });

    // 2️⃣ Normalize variants and numeric fields
    const normalizedVariants =
      formData.variants?.map((v) => ({
        color: v.color || "",
        size: v.size || "",
        price: Number(v.price) || 0,
        discountPrice: Number(v.discountPrice) || 0,
        SKU: v.SKU || "", // auto-generated in backend if empty
        stock: Number(v.stock) || 0,
      })) || [];

    // 3️⃣ Global stock (optional: sum of variant stocks if formData.stock not provided)
    // Calculate global stock
    const globalStock = normalizedVariants.reduce((sum, v) => sum + v.stock, 0);

    // 4️⃣ Build payload (do NOT include images in JSON)
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price) || 0,
      category: formData.category,
      subCategory: formData.subCategory,
      variants: normalizedVariants,
      stock: globalStock,
      brand: formData.brand,
      tags,
    };

    // 5️⃣ Build FormData
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));

    if (Array.isArray(formData.images)) {
      formData.images.forEach((file) => {
        if (file instanceof File) fd.append("images", file);
      });
    }

    // 6️⃣ Debug: check FormData
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    const payloadToSubmit = editingProduct
      ? {
          _id: editingProduct._id,
          data: fd,
        }
      : {
          data: fd,
        };

    // 7️⃣ Send FormData directly to React Query mutation
    productMutation.mutate(payloadToSubmit);
  };

  /*** ------> Delete handler ------> */
  const handleDeleteProduct = (id) => {
    deleteProductMutation.mutate(id);
    setConfirmDelete(null);
  };

  /*** Data fetch status handlers */
  const categoryDataStatus = useFetchedDataStatusHandler({
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: errorCategory,
    label: "categories",
  });

  const subCategoryDataStatus = useFetchedDataStatusHandler({
    isLoading: isSubCategoryLoading,
    isError: isSubCategoryError,
    error: errorSubCategory,
    label: "sub-categories",
  });

  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4">
      <div className="lg:col-span-5 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
        <SuperAdminProductInsertForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          subCategories={subCategories}
          categoryDataStatus={categoryDataStatus}
          subCategoryDataStatus={subCategoryDataStatus}
          onFormSubmit={handleSubmit}
          editingProduct={editingProduct}
          onEdit={setEditingProduct}
          setEditingProduct={setEditingProduct}
          onDelay={delayedIsSubmitting}
          onMutation={productMutation}
        />
      </div>
      <div className="lg:col-span-7 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
        <SuperAdminProductListTable
          onDelete={handleDeleteProduct}
          onMutation={productMutation}
          onEdit={(product) =>
            setFormData(product) & setEditingProduct(product)
          }
          onConfirmDelete={setConfirmDelete}
        />
        {confirmDelete && (
          <ConfirmDialog
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => handleDeleteProduct(confirmDelete._id)}
          />
        )}
      </div>
    </div>
  );
};

export default SuperAdminProductManagementPage;
