import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import useSubmitDelayedValue from "../services/hooks/useSubmitDelayedValue";
import useValidator from "../../common/hooks/useValidator";

const SuperAdminSubcategoryManagement = () => {
  const [editingSubcategory, setEditingSubCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
  });

  // Validation
  const validationRules = {
    name: {
      required: { message: "Name is required" },
    },
    slug: {
      required: { message: "Slug is required" },
    },

    description: {
      required: { message: "Description is required" }, // <-- Add this line
      custom: (val) =>
        val && val.length > 100
          ? "Description must be less than 100 characters"
          : null,
    },
  };

  /*** ------> Category fetch QUERY hook ------> */
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: errorCategory,
  } = useApiQuery({
    url: API_PATHS.CATEGORIES.ENDPOINT,
    queryKey: API_PATHS.CATEGORIES.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Subcategory fetch QUERY hook ------> */
  const {
    data: subCategories,
    isLoading: isSubCategoryLoading,
    isError: isSubCategoryError,
    error: errorSubCategory,
  } = useApiQuery({
    url: API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_ENDPOINT,
    queryKey: API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const [paginatedData, setPaginatedData] = useState(subCategories || []);

  // To display total permissions in pagination
  const dataLength = categories?.length;

  /*** ----> Subcategory UPDATE & CREATE Mutation ----> */
  const subCategoryMutation = useApiMutation({
    method: editingSubcategory ? "update" : "create",
    path: editingSubcategory
      ? (payload) =>
          `${API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_ENDPOINT}/${payload.id}`
      : API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_ENDPOINT,
    key: API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error saving sub-category");
      console.error(error);
    },
  });

  /*** ------> Subcategory DELETE Mutation ------> */
  const deleteSubCategoryMutation = useApiMutation({
    method: "delete",
    path: (id) => `${API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_ENDPOINT}/${id}`,
    key: API_PATHS.SUB_CATEGORIES.SUB_CATEGORIES_KEY,
  });

  /** ------> Categories & subCategories data fetch status ------> */
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

  /** --------> Delayed value for good UI experience --------> */
  const delayedIsSubmitting = useSubmitDelayedValue(
    subCategoryMutation.isPending,
    300, // ms
  );

  /** --------> Form Input Handler --------> */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** --------> Validator integration --------> */
  const { errors, validate } = useValidator(validationRules, {
    name: formData.name,
    description: formData.description,
    slug: formData.slug,
  });

  /** --------> Sub categories INSERT & UPDATE handler --------> */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = editingSubcategory
      ? {
          id: editingSubcategory._id,
          data: {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            slug: formData.slug,
          },
        }
      : {
          data: {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            slug: formData.slug,
          },
        };

    subCategoryMutation.mutate(payload, {
      onSuccess: () => {
        setFormData({
          name: "",
          description: "",
          slug: "",
        });
      },
    });
  };

  /** --------> Sub categories update handler --------> */
  const handleUpdateSubCategory = (subCat) => {
    setEditingSubCategory(subCat);
    setFormData({
      name: subCat.name,
      description: subCat.description,
      slug: subCat.slug,
      category: subCat.category,
    });
  };

  /** --------> Sub categories delete handler --------> */
  const handleDeleteSubCategory = (id) => {
    deleteSubCategoryMutation.mutate(id);
    setConfirmDelete(null);
  };

  /** --------> Sub categories update cancellation handler --------> */
  const handleCancel = () => {
    setEditingSubCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      category: "",
    });
  };

  return (
    <div className="">
      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-center">
        <div className="lg:col-span-6 col-span-12 lg:space-y-4 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
          <div className="">
            <h2 className="lg:text-2xl text-xl font-bold">
              {editingSubcategory ? " Update Sub Category" : "Add Sub Category"}
            </h2>
          </div>
          <div className=" ">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Sub category name..."
                />
                {errors.name && (
                  <p className="text-red-600 text-xs">{errors.name}</p>
                )}
              </div>
              <div className="">
                <Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Slug..."
                />
                {errors.slug && (
                  <p className="text-red-600 text-xs">{errors.slug}</p>
                )}
              </div>
              <div className="">
                <Textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description..."
                />
                {errors.description && (
                  <p className="text-red-600 text-xs">{errors.description}</p>
                )}
              </div>
              {categoryDataStatus.status !== "success" ? (
                categoryDataStatus.content
              ) : (
                <div className="w-full rounded-lg">
                  <select
                    value={formData.category}
                    name="category"
                    className="border w-full p-2 border-base-content/25 text-base-content/70 rounded-lg bg-base-100"
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-x-4">
                <Button
                  type="submit"
                  loading={subCategoryMutation.isPending}
                  disabled={subCategoryMutation.isPending}
                  icon={
                    delayedIsSubmitting
                      ? LucideIcon.Check
                      : editingSubcategory
                        ? LucideIcon.Edit
                        : LucideIcon.Plus
                  }
                  className=""
                >
                  {delayedIsSubmitting
                    ? "Saving..."
                    : editingSubcategory
                      ? "Update"
                      : "Create"}
                </Button>

                {editingSubcategory && (
                  <Button
                    type="button"
                    icon={LucideIcon.Settings}
                    variant="warning"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12 lg:space-y-4 space-y-2 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
          <h2 className="lg:text-2xl text-xl font-bold">Subcategories List</h2>

          {subCategoryDataStatus.status !== "success" ? (
            subCategoryDataStatus.content
          ) : (
            <div className="overflow-x-auto text-base-content/70">
              <table className="table table-xs">
                <thead className="bg-base-300">
                  <tr>
                    <th>#</th>
                    <th>Sub Category Name</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    paginatedData.map((subCat, idx) => (
                      <tr key={subCat._id}>
                        <th>{idx + 1}</th>
                        <td>{subCat.name}</td>
                        <td>{subCat.category.name}</td>
                        <td>{subCat.description}</td>
                        <td className="flex space-x-2 my-2">
                          <MiniIconButton
                            onClick={() => handleUpdateSubCategory(subCat)}
                            variant="indigo"
                            icon="edit"
                          />
                          <MiniIconButton
                            onClick={() => setConfirmDelete(subCat)}
                            variant="danger"
                            name="delete"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-base-300">
                  <tr>
                    <th>#</th>
                    <th>Sub Category Name</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </tfoot>
              </table>
              {confirmDelete && (
                <ConfirmDialog
                  isOpen={confirmDelete}
                  onClose={() => setConfirmDelete(null)}
                  onConfirm={() => handleDeleteSubCategory(confirmDelete._id)}
                />
              )}
              {/* pagination begins*/}
              <Pagination
                items={subCategories}
                dataLength={dataLength}
                onPaginatedDataChange={setPaginatedData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSubcategoryManagement;
