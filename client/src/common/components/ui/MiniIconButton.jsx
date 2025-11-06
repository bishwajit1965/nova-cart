import {
  Edit,
  Edit2,
  Eye,
  FileSliders,
  Loader2,
  LucideDownload,
  Pencil,
  PlusCircleIcon,
  Trash2,
  X,
} from "lucide-react";

import Button from "./Button";
import { cn } from "../../lib/utils";

const icons = {
  edit: Edit,
  edit2: Edit2,
  defaultEdit: Pencil,
  delete: Trash2,
  file: FileSliders,
  view: Eye,
  loading: Loader2,
  add: PlusCircleIcon,
  close: X,
  download: LucideDownload,
};

const iconLabels = {
  edit: "Edit",
  edit2: "Edit2",
  delete: "Delete",
  file: "PDF",
  view: "View",
  add: "Add",
  close: "Close",
  loading: "Loading",
};

export function MiniIconButton({
  icon = "edit",
  onClick,
  className = "",
  variant = "muted", // 👈 neutral default
  tooltip, // label override
  loading = false,
  disabled = false,
  label = false, // 👈 if true, shows "Edit" text
  size = "xs", // "xs", "sm", "md" (default sm)
}) {
  const Icon = loading ? Loader2 : icons[icon] || Pencil || Edit2;
  const text = tooltip || iconLabels[icon.toLowerCase()] || "Edit" || "Action";

  const baseSize = {
    xs: "px-1 py-1 text-xs h-8",
    sm: "px-2 py-2 text-sm h-9",
    md: "px-3 py-3 text-sm h-10",
  };

  return (
    <Button
      icon={Icon}
      onClick={onClick}
      variant={variant}
      title={!label ? text : undefined} // tooltip only if label is not shown
      loading={loading}
      disabled={disabled}
      className={cn(
        baseSize[size],
        "gap-1 cursor-pointer shadow-md",
        className
      )}
    >
      {label && text}
    </Button>
  );
}
