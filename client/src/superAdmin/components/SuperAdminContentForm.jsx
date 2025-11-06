// ContentForm.jsx

import Button from "../../common/components/ui/Button";
import { useState } from "react";

const SuperAdminContentForm = ({ content, onSave }) => {
  const [type, setType] = useState(content?.type || "faq");
  const [title, setTitle] = useState(content?.title || "");
  const [description, setDescription] = useState(content?.description || "");
  const [fields, setFields] = useState(content?.fields || []);

  const addField = () =>
    setFields([...fields, { key: "", value: "", type: "text" }]);

  const removeField = (index) =>
    setFields(fields.filter((_, i) => i !== index));

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSubmit = () => onSave({ type, title, description, fields });

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div>
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="faq">FAQ</option>
          <option value="about">About</option>
          <option value="policy">Policy</option>
          <option value="contact">Contact</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <h3 className="font-bold mb-2">Fields</h3>
        {fields.map((f, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Key"
              value={f.key}
              onChange={(e) => updateField(idx, "key", e.target.value)}
              className="border p-1 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Value"
              value={f.value}
              onChange={(e) => updateField(idx, "value", e.target.value)}
              className="border p-1 rounded flex-1"
            />
            <Button onClick={() => removeField(idx)} variant="red">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addField}>Add Field</Button>
      </div>

      <Button onClick={handleSubmit} variant="green">
        Save Content
      </Button>
    </div>
  );
};

export default SuperAdminContentForm;
