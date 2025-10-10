import Button from "./Button";
import { CheckCircle } from "lucide-react";
import { LucideIcon } from "../../lib/LucideIcons";
import { useState } from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-sm w-full relative z-10">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <CheckCircle size={20} />
          <span>Confirm Deletion</span>
        </h2>
        <p className="mt-2 text-base-content/70">
          Are you sure you want to remove <strong>{itemName}</strong> from your
          wishlist?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={onClose}
            variant="warning"
            icon={LucideIcon.X}
            className="btn btn-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant="danger"
            icon={LucideIcon.Trash2}
            className="btn btn-sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
