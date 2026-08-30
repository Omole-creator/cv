"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Report from "@/components/Report";
import Footer from "@/components/Footer";
import { extractDocument } from "@/lib/extractText";
import { analyzeCv, CvReport } from "@/lib/analyzeCv";

const STATUS_STAGES = [
  "Reading document…",
  "Checking ATS formatting…",
  "Scoring quantified results…",
];

const MIN_PROCESSING_MS = 3600;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [report, setReport] = useState<CvReport | null>(null);
  const [fileName, setFileName] = useState<string>();

  const handleFileAccepted = async (file: File) => {
    setIsProcessing(true);
    setReport(null);
    setStatusIndex(0);

    const stageTimer = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_STAGES.length - 1));
    }, MIN_PROCESSING_MS / STATUS_STAGES.length);

    const [doc] = await Promise.all([extractDocument(file), wait(MIN_PROCESSING_MS)]);
    clearInterval(stageTimer);

    setReport(analyzeCv(doc));
    setFileName(file.name);
    setIsProcessing(false);

    requestAnimationFrame(() => {
      document.getElementById("report")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <main>
      <Navbar />
      <Hero
        onFileAccepted={handleFileAccepted}
        isProcessing={isProcessing}
        statusLine={STATUS_STAGES[statusIndex]}
        fileName={fileName}
      />
      {report && <Report report={report} fileName={fileName} />}
      <HowItWorks />
      <Footer />
    </main>
  );
}
