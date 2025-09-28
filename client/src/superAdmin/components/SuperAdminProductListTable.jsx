import API_PATHS from "../services/apiPaths/apiPaths";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import Modal from "../../common/components/ui/Modal";
import Pagination from "../../common/pagination/Pagination";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useMemo } from "react";
import { useState } from "react";

const SuperAdminProductListTable = ({
  onEdit,
  onConfirmDelete,
  onMutation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewProduct, setViewProduct] = useState(null);
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  /*** Products fetcher Query */
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: errorProducts,
  } = useApiQuery({
    url: API_PATHS.PRODUCTS.ENDPOINT,
    queryKey: API_PATHS.PRODUCTS.KEY,
  });

  const [paginatedData, setPaginatedData] = useState(products || []);
  // To display total permissions in pagination
  const dataLength = products?.length;

  /*** ------> Filter products based on search query ------> */
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const statusTogglerHandler = (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    const payload = {
      _id: product._id,
      data: { status: newStatus },
    };
    onEdit(product);
    onMutation.mutate(payload);
  };

  /*** ------> Data fetch status handlers ------> */
  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: errorProducts,
    label: "products",
  });

  return (
    <div className="lg:space-y-4 space-y-2">
      <div className="">
        <h2 className="lg:text-2xl text-xl font-bold">
          Super Admin Product List Table
        </h2>
      </div>
      {/* Search Input */}
      <div className="">
        <Input
          icon={LucideIcon.Search}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" "
        />
      </div>

      <div className="lg:space-y-4">
        {productsDataStatus.status !== "success" ? (
          productsDataStatus.content
        ) : (
          <div className="lg:space-y-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(paginatedData || [])?.map((product, idx) => (
                    <tr key={product._id}>
                      <th>{idx + 1}</th>
                      <td>{product?.name}</td>
                      <td>
                        {product?.image ? (
                          <img
                            src={
                              product?.image ? product.image : product.images[0]
                            }
                            alt={product?.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          product.images[0] && (
                            <img
                              src={`${apiURL}${
                                product.images[0].startsWith("/") ? "" : "/"
                              }${product.images[0]}`}
                              alt={product.name || ""}
                              className="w-12 h-12 object-contain"
                            />
                          )
                        )}
                      </td>
                      <td>{product.price}</td>
                      <td>{product.brand}</td>
                      <td>
                        {product.stock > 10 ? (
                          <span className="badge badge-success text-xs">
                            <span>In Stock ({product.stock})</span>
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="badge badge-warning text-xs">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="badge badge-error text-xs">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => statusTogglerHandler(product)}
                          className={`btn btn-xs px-1 text-xs ${
                            product.status === "active"
                              ? "btn-success"
                              : "btn-error text-white"
                          }`}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="">
                        <div className="flex items-center justify-end space-x-2">
                          <MiniIconButton
                            onClick={() => onEdit(product)}
                            icon="edit"
                            variant="default"
                          />
                          <MiniIconButton
                            onClick={() => setViewProduct(product)}
                            icon="view"
                            variant="default"
                          />
                          <MiniIconButton
                            onClick={() => onConfirmDelete(product)}
                            icon="delete"
                            variant="default"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* pagination begins*/}
            <div className="">
              <Pagination
                items={filteredProducts}
                dataLength={dataLength}
                onPaginatedDataChange={setPaginatedData}
              />
            </div>
            {/* ------> Modal for product details ------> */}
            {viewProduct && (
              <Modal
                isOpen={viewProduct}
                onClose={() => setViewProduct(null)}
                title="Nova Cart"
                className="lg:min-w-2xl w-lg"
              >
                <div className="">
                  <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-between">
                    <div className="lg:col-span-6 col-span-12">
                      <img
                        src={
                          viewProduct.image
                            ? viewProduct.image
                            : viewProduct.images[0]
                        }
                        alt={viewProduct.name}
                        className="object-contain height-auto"
                      />
                    </div>
                    <div className="lg:col-span-6 col-span-12">
                      <h2 className="text-xl font-bold mb-4">
                        {viewProduct.name}
                      </h2>
                      <p>
                        <strong>Brand:</strong> {viewProduct.brand}
                      </p>
                      <p>
                        <strong>Price:</strong> ${viewProduct.price}
                      </p>
                      <p>
                        <strong>Stock:</strong> {viewProduct.stock}
                      </p>
                      <p>
                        <strong>Category:</strong> {viewProduct.categoryName}
                      </p>
                      <p>
                        <strong>Description:</strong> {viewProduct.description}
                      </p>

                      {viewProduct.variants &&
                        viewProduct.variants.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-bold">Variants:</h3>
                            <ul className="list-disc ml-5">
                              {viewProduct.variants.map((v, idx) => (
                                <li key={idx}>
                                  Color: {v.color}, Size: {v.size}, Price: $
                                  {v.price}, Stock: {v.stock}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="border-t border-base-content/15 flex justify-end pt-2">
                    <MiniIconButton
                      onClick={() => setViewProduct(null)}
                      label="close"
                      icon="close"
                      variant="danger"
                    />
                  </div>
                </div>
              </Modal>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminProductListTable;
