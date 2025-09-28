import { useCallback, useMemo, useState } from "react";

export function useTableData(data = [], config = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const getFieldValue = useCallback(
    (item, key) => {
      const raw = key.split(".").reduce((obj, prop) => obj?.[prop], item);
      const formatter = config.formatters?.[key];
      const formatted = formatter ? formatter(raw, item) : raw;
      return String(formatted ?? "").toLowerCase();
    },
    [config.formatters]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const keys = config.searchKeys || Object.keys(data[0] || {});
    return data.filter((item) =>
      keys.some((key) =>
        getFieldValue(item, key).includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, getFieldValue, config.searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = getFieldValue(a, sortKey);
      const bVal = getFieldValue(b, sortKey);
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder, getFieldValue]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    sortKey,
    sortOrder,
    handleSort,
    tableData: sortedData,
  };
}
