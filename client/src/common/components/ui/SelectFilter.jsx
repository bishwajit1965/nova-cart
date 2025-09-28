// components/ui/SelectFilter.jsx

const SelectFilter = ({ label, value = [], onChange, options, isMulti }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}
      <select
        multiple={isMulti}
        value={value}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions).map(
            (opt) => opt.value
          );
          onChange(isMulti ? selectedValues : e.target.value);
        }}
        className="border border-base-content/25 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {!isMulti && <option value="">All</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default SelectFilter;
// const SelectFilter = ({ label, value, onChange, options }) => {
//   return (
//     <div className="flex flex-col gap-1 w-full">
//       {label && <label className="text-sm font-medium">{label}</label>}
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="border border-base-content/25 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//       >
//         <option value="" className="text-sm font-medium text-base-content/15">
//           All
//         </option>
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default SelectFilter;

// Usage example

// import SelectFilter from "../components/ui/SelectFilter";

// // Inside your JSX
// <div className="flex gap-4 mb-4">
//   <SelectFilter
//     label="Order Status"
//     value={statusFilter}
//     onChange={setStatusFilter}
//     options={[
//       { value: "pending", label: "Pending" },
//       { value: "processing", label: "Processing" },
//       { value: "shipped", label: "Shipped" },
//       { value: "delivered", label: "Delivered" },
//       { value: "cancelled", label: "Cancelled" },
//     ]}
//   />

//   <SelectFilter
//     label="Payment Status"
//     value={paymentFilter}
//     onChange={setPaymentFilter}
//     options={[
//       { value: "unpaid", label: "Unpaid" },
//       { value: "paid", label: "Paid" },
//       { value: "failed", label: "Failed" },
//     ]}
//   />
// </div>;
