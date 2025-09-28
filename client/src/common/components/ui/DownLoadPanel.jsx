import { Download, FileDown } from "lucide-react";
import {
  downloadCSV,
  downloadPDF,
} from "../../utils/generateCSV_PDF/downloadHelpers";

import Button from "./Button";

const DownloadPanel = ({ data, filename, fields, label }) => {
  return (
    <div className="flex items-center space-x-4 mt-4">
      <Button
        variant="default"
        onClick={() => downloadCSV(data, `${filename}.csv`)}
      >
        <Download size={16} /> {label} CSV
      </Button>
      <Button
        variant="indigo"
        onClick={() => downloadPDF(data, fields, `${filename}.pdf`)}
      >
        <FileDown size={16} /> {label} PDF
      </Button>
    </div>
  );
};

export default DownloadPanel;
