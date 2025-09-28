import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import MultiSelect from "../../common/components/ui/MultiSelect";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const CategoryManagement = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [subCategoriesSelected, setSubCategoriesSelected] = useState([]);

  // Validation
  const validationRules = {
    name: {
      required: { message: "Name is required" },
    },

    description: {
      required: { message: "Description is required" }, // <-- Add this line
      custom: (val) =>
        val && val.length > 100
          ? "Description must be less than 100 characters"
          : null,
    },
    subCategoriesSelected: {
      required: { message: "Sub categories required" },
    },
  };

  // Validator integration
  const { errors, validate } = useValidator(validationRules, {
    name,
    description,
    subCategoriesSelected,
  });

  const {
    data: categories = [],
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

  const {
    data: subCategories = [],
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

  const [paginatedData, setPaginatedData] = useState(categories || []);
  // To display total permissions in pagination
  const dataLength = categories?.length;
  console.log("Categories=>", paginatedData);

  const mutation = useApiMutation({
    method: editingCategory ? "update" : "create",
    path: editingCategory
      ? (payload) => `${API_PATHS.CATEGORIES.ENDPOINT}/${payload.id}`
      : API_PATHS.CATEGORIES.ENDPOINT,
    key: API_PATHS.CATEGORIES.KEY, // used by useQuery
    onSuccess: () => {
      setEditingCategory(null);
      setName("");
      setDescription("");
      setSubCategoriesSelected([]);
      setFeatured(false);
      setFeaturedImage("");
    },
    onError: (error) => {
      toast.error("Error saving category");
      console.error(error);
    },
  });

  const deleteCategoryMutation = useApiMutation({
    method: "delete",
    path: (id) => `${API_PATHS.CATEGORIES.ENDPOINT}/${id}`,
    key: API_PATHS.CATEGORIES.KEY,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = editingCategory
      ? {
          id: editingCategory._id,
          data: {
            name,
            description,
            subcategories: subCategoriesSelected || [],
            featured,
            featuredImage,
          },
        }
      : {
          data: {
            name,
            description,
            subcategories: subCategoriesSelected || [],
            featured,
            featuredImage,
          },
        };

    mutation.mutate(payload);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setFeatured(cat.featured || false);
    setFeaturedImage(cat.featuredImage || "");
    setSubCategoriesSelected(cat.subcategories?.map((sub) => sub._id) || []);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
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
    label: "categories",
  });

  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-4">
      <div className="lg:col-span-6 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
        <div className="lg:mb-4 mb-2">
          <h2 className="lg:text-2xl text-xl font-bold">
            {editingCategory ? "Update Category" : "Add Category"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 -z-50">
          <div className="">
            <Input
              type="text"
              placeholder="Category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the category..."
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="">
            <Input
              type="text"
              placeholder="Featured Image URL..."
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
            />
          </div>

          <div className="grid lg:grid-cols-12 items-center lg:gap-4 gap-2 grid-cols-1 justify-between">
            {subCategoryDataStatus.status !== "success" ? (
              subCategoryDataStatus.content
            ) : subCategories.length === 0 ? (
              <NoDataFound label="No sub-categories found. Please create sub-categories first." />
            ) : (
              <div className="lg:col-span-10 col-span-12">
                <MultiSelect
                  label="Select Subcategories"
                  options={subCategories.map((sub) => ({
                    value: sub._id,
                    label: sub.name,
                  }))}
                  value={subCategoriesSelected} // state array of selected subcategory IDs
                  onChange={setSubCategoriesSelected}
                />
                {errors.subCategoriesSelected && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.subCategoriesSelected}
                  </p>
                )}
              </div>
            )}
            <div className="lg:col-span-2 col-span-12 flex items-center">
              <label className="flex items-center gap-1 mt-5">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Featured
              </label>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-5">
            <Button
              type="submit"
              variant="indigo"
              disabled={mutation.isPending}
              icon={editingCategory ? LucideIcon.Edit : LucideIcon.Plus}
              className="lg:w-24 w-24"
            >
              {editingCategory ? "Update" : "Upload"}
            </Button>
            {editingCategory && (
              <Button
                type="button"
                icon={LucideIcon.X}
                paginatedData
                className="lg:w-24 w-24"
                variant="warning"
                onClick={() => {
                  setEditingCategory(null);
                  setName("");
                  setDescription("");
                  setSubCategoriesSelected([]);
                  setFeatured(false);
                  setFeaturedImage("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
      <div className="lg:col-span-6 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
        <div className="lg:mb-4 mb-2">
          <h2 className="lg:text-2xl text-xl font-bold">Category List</h2>
        </div>
        <div className="lg:space-y-6 space-y-4">
          <div className="overflow-x-auto">
            {categoryDataStatus.status !== "success" ? (
              categoryDataStatus.content
            ) : (
              <table className="table table-xs">
                <thead className="bg-base-300">
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>SubCategories</th>
                    <th className="flex justify-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr className="text-xl font-bold text-center">
                      <td colSpan={4}>
                        <NoDataFound label="No categories" />
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((cat, idx) => (
                      <tr key={cat._id}>
                        <th>{idx + 1}</th>
                        <td className="text-sm font-semibold">{cat.name}</td>
                        <td>{cat.description}</td>
                        <td>
                          {cat.subcategories && cat.subcategories.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {cat.subcategories.map((sub) => (
                                <span
                                  key={sub._id}
                                  className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {sub.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        <td className="space-x-2 flex justify-end py-2">
                          <MiniIconButton
                            variant="default"
                            onClick={() => handleEdit(cat)}
                          />
                          <MiniIconButton
                            variant="danger"
                            icon="delete"
                            onClick={() => handleDelete(cat._id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-base-300">
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>SubCategories</th>
                    <th className="flex justify-end">Actions</th>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
          {/* pagination begins*/}
          <Pagination
            items={categories}
            dataLength={dataLength}
            onPaginatedDataChange={setPaginatedData}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
