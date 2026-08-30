"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Loader2 } from "lucide-react";

type Props = {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
  statusLine: string;
  fileName?: string;
};

export default function Uploader({ onFileAccepted, isProcessing, statusLine, fileName }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFileAccepted(accepted[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isProcessing,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      data-testid="cv-dropzone"
      className={`group relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        isDragActive ? "border-gold-600 bg-gold-50" : "border-ink-900/15 bg-white"
      } ${isProcessing ? "cursor-wait opacity-90" : "hover:border-ink-900/30"}`}
    >
      <input {...getInputProps()} data-testid="cv-file-input" />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-ink-900" />
          <p className="font-medium text-ink-900" data-testid="processing-status">
            {statusLine}
          </p>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-ink-900/10">
            <div className="h-full animate-progress rounded-full bg-gold" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gold-50 p-3">
            <FileUp className="h-6 w-6 text-ink-900" />
          </div>
          <p className="font-medium text-ink-900">
            {fileName ? `Drop a new file to check again` : "Drop your CV here, or click to choose a file"}
          </p>
          <p className="text-sm text-ink-400">PDF, Word, PNG or JPG</p>
          {fileName && <p className="text-xs text-ink-400">Last checked: {fileName}</p>}
        </div>
      )}
    </div>
  );
}
