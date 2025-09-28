import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const Pagination = ({
  items, // Pass the full list of items here
  itemsPerPageOptions = [5, 10, 15, 20, 25, 30, 50, 70, 100],
  dataLength,
  onPaginatedDataChange, // Callback to send the paginated data to the parent
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(items.length / itemsPerPage));
    setCurrentPage((prevPage) => Math.min(prevPage, maxPage));
  }, [items, itemsPerPage]);

  const generatePageNumbers = () => {
    const delta = 1;
    const range = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (l !== "...") {
        range.push("...");
      }
      l = range[range.length - 1];
    }

    return range;
  };

  const handlePageChange = (page) => {
    if (page !== "...") {
      const safePage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(safePage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const paginatedData = items.slice(startIndex, endIndex);

    onPaginatedDataChange(paginatedData); // Send paginated data to parent
  }, [currentPage, itemsPerPage, items, onPaginatedDataChange]);

  const pages = generatePageNumbers();

  return (
    <div className="flex flex-col items-center space-y-2 mt-3">
      <div className="flex items-center lg:space-x-2 dark:bg-gray-900 rounded shadow-sm">
        <div className="border-1 border-gray-600 py-[3px] rounded-sm flex items-center">
          <label htmlFor="itemsPerPage" className="text-xs px-2 text-gray-500">
            Items per page:
          </label>
        </div>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="text-base-content justify-end px-2 rounded bg-base-100 dark:border-gray-600 border border-gray-600 flex items-center py-[2px]"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-1.5 py-[1px] rounded flex items-center text-gray-500 hover:text-gray-200 text-sm ${
            currentPage === 1
              ? "bg-base-300 border border-base-600 cursor-not-allowed dark:bg-base-600"
              : "bg-base-300 border border-gray-600 hover:bg-blue-500 hover:text-white dark:bg-gray-700"
          }`}
        >
          <CircleArrowLeft size={16} className="inline mr-1" /> Prev
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`px-2 p-[1px] rounded text-sm ${
              page === currentPage
                ? "bg-blue-500 text-white text-sm p-[2px]"
                : "bg-base-300 border border-gray-600 hover:bg-blue-500  hover:text-white dark:bg-gray-700 text-sm p-[1px]"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-1.5 py-[1px] rounded flex items-center text-gray-500 hover:text-gray-200 text-sm ${
            currentPage === totalPages
              ? "bg-base-300 border cursor-not-allowed dark:bg-gray-600"
              : "bg-base-300 border border-gray-600 hover:bg-blue-500 hover:text-white dark:bg-gray-700"
          }`}
        >
          Next <CircleArrowRight size={16} className="inline ml-1" />
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-300">
        Showing page {currentPage} of {totalPages} ({itemsPerPage} items per
        page) of total {dataLength} items
      </div>
    </div>
  );
};

export default Pagination;
