import { AnimatePresence, motion } from "framer-motion";

import Button from "./Button";
import { LucideIcon } from "../../lib/LucideIcons";
import { useState } from "react";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  alertMessage = "This action cannot be undone.",
  message = "",
  confirmText = "Yes, proceed",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <LucideIcon.CheckCircle size={20} /> <span> {title}</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {alertMessage}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {message}
          </p>

          <div className="flex justify-end gap-3 mt-5">
            <Button
              onClick={onCancel}
              variant="primary"
              size="xs"
              icon={LucideIcon.Save}
              className=""
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              size="xs"
              variant="danger"
              icon={LucideIcon.Trash2}
              className=""
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
