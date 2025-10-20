import { useState } from "react";

const DynamicFormGenerator = () => {
  const [fieldNames, setFieldNames] = useState([]); // store field names
  const [newField, setNewField] = useState(""); // controlled input for adding new field
  const [formData, setFormData] = useState({}); // actual form data

  // Add new field to array
  const handleAddField = () => {
    if (!newField.trim()) return;
    if (fieldNames.includes(newField.trim())) {
      alert("Field already exists!");
      return;
    }

    setFieldNames([...fieldNames, newField.trim()]);
    setFormData({ ...formData, [newField.trim()]: "" });
    setNewField("");
  };

  // Handle form value changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit (for CRUD)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    alert("Check console for form data 👇");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-100 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Dynamic CRUD Form Builder ⚡
      </h2>

      {/* Add Field */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          placeholder="Enter field name"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddField}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Generated Fields */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {fieldNames.map((field) => (
          <div key={field} className="flex flex-col">
            <label className="font-medium">{field}</label>
            <input
              type="text"
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Enter ${field}`}
              className="border p-2 rounded"
            />
          </div>
        ))}

        {fieldNames.length > 0 && (
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-3"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default DynamicFormGenerator;
