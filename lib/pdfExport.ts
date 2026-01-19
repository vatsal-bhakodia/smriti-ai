import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProcessedData, ProcessedSemester } from "@/types/result";
import { marksToGrade } from "@/utils/result";

interface ExportOptions {
  processedData: ProcessedData;
  semester: number | "OVERALL";
  showMarksBreakdown?: boolean;
}

export async function exportResultToPDF({
  processedData,
  semester,
  showMarksBreakdown = true,
}: ExportOptions): Promise<void> {
  const doc = new jsPDF();
  const { studentInfo, semesters, cgpa } = processedData;

  // Colors - Dark theme with lime accent
  const primaryLime: [number, number, number] = [163, 255, 25]; // #a3ff19 - lime green
  const darkBg: [number, number, number] = [0, 0, 0]; // Pure black
  const cardBg: [number, number, number] = [38, 38, 38]; // Gray-800 for cards
  const textWhite: [number, number, number] = [255, 255, 255];
  const textGray: [number, number, number] = [163, 163, 163]; // Gray-400
  const borderGray: [number, number, number] = [64, 64, 64]; // Gray-700

  let yPosition = 10;

  // Black background for entire page
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 297, "F");

  // ===== HEADER SECTION =====
  // Logo and branding area - Brain icon from public folder
  // 14pt font ≈ 5mm height, so logo should match
  const logoSize = 5;
  const logoX = 15;
  const logoY = yPosition;

  // Load brain icon PNG from public folder (no background box)
  try {
    const response = await fetch("/brain-icon.png");
    const blob = await response.blob();
    const reader = new FileReader();
    const brainIconBase64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    doc.addImage(brainIconBase64, "PNG", logoX, logoY, logoSize, logoSize);
  } catch {
    // Fallback: draw "S" if image fails to load
    doc.setTextColor(...primaryLime);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("S", logoX + logoSize / 2, logoY + logoSize * 0.8, {
      align: "center",
    });
  }

  // Brand name - positioned to align with logo center
  doc.setTextColor(...textWhite);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  // Text baseline should be at logo center + half of cap height (≈1.75mm for 14pt)
  doc.text("Smriti AI", logoX + logoSize + 2, logoY + logoSize * 0.8);

  // Result link on the right - more inviting text
  doc.setTextColor(...primaryLime);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.textWithLink("Generate your result here", 195, logoY + logoSize * 0.8, {
    align: "right",
    url: "https://www.smriti.live/result",
  });

  yPosition += 12;

  // Divider line
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.3);
  doc.line(15, yPosition, 195, yPosition);

  yPosition += 12;

  // Main title
  doc.setTextColor(...primaryLime);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EXAMINATION RESULT", 105, yPosition, { align: "center" });
  yPosition += 8;

  doc.setTextColor(...textGray);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    semester === "OVERALL"
      ? "Complete Academic Record"
      : `Semester ${semester} Report`,
    105,
    yPosition,
    { align: "center" }
  );
  yPosition += 15;

  // ===== STUDENT INFO CARD =====
  // Card background
  doc.setFillColor(...cardBg);
  doc.roundedRect(15, yPosition, 180, 45, 4, 4, "F");

  // Student name
  doc.setTextColor(...textWhite);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(studentInfo.name, 22, yPosition + 12);

  // Student details
  doc.setTextColor(...textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const infoStartY = yPosition + 20;
  const lineHeight = 6;

  doc.text(`Enrollment No: ${studentInfo.enrollmentNumber}`, 22, infoStartY);
  doc.text(
    `Institute: ${studentInfo.institute} (${studentInfo.instituteCode})`,
    22,
    infoStartY + lineHeight
  );
  doc.text(
    `Program: ${studentInfo.program} (${studentInfo.programCode})`,
    22,
    infoStartY + lineHeight * 2
  );

  // CGPA Card - Lime accent (only show if cgpa is available)
  if (cgpa !== null) {
    const cgpaBoxX = 150;
    const cgpaBoxY = yPosition + 6;
    const cgpaBoxW = 40;
    const cgpaBoxH = 33;

    // CGPA background with lime color
    doc.setFillColor(...primaryLime);
    doc.roundedRect(cgpaBoxX, cgpaBoxY, cgpaBoxW, cgpaBoxH, 4, 4, "F");

    // CGPA Label
    doc.setTextColor(...darkBg);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("CGPA", cgpaBoxX + cgpaBoxW / 2, cgpaBoxY + 10, { align: "center" });

    // CGPA Value
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(cgpa.toFixed(2), cgpaBoxX + cgpaBoxW / 2, cgpaBoxY + 25, {
      align: "center",
    });
  }

  yPosition += 55;

  // Generate tables based on selection
  if (semester === "OVERALL") {
    // Export all semesters
    semesters.forEach((sem, index) => {
      yPosition = addSemesterTable(
        doc,
        sem,
        yPosition,
        showMarksBreakdown,
        index > 0
      );
    });

    // Add summary table (only if cgpa is available)
    if (cgpa !== null) {
      yPosition = addSummaryTable(doc, semesters, yPosition, cgpa);
    }
  } else {
    // Export specific semester
    const selectedSemester = semesters.find((s) => s.euno === semester);
    if (selectedSemester) {
      yPosition = addSemesterTable(
        doc,
        selectedSemester,
        yPosition,
        showMarksBreakdown,
        false
      );
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background - dark
    doc.setFillColor(...cardBg);
    doc.rect(0, 282, 210, 18, "F");

    // Top border line
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(0, 282, 210, 282);

    // Footer content
    doc.setTextColor(...textGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      15,
      290
    );

    // Center: Generate result link
    doc.setTextColor(...primaryLime);
    doc.setFont("helvetica", "bold");
    doc.textWithLink("Generate your result here", 105, 290, {
      align: "center",
      url: "https://www.smriti.live/result",
    });

    // Right: Page number
    doc.setTextColor(...textGray);
    doc.setFont("helvetica", "normal");
    doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: "right" });
  }

  // Save the PDF
  const fileName =
    semester === "OVERALL"
      ? `${studentInfo.enrollmentNumber}_Complete_Result.pdf`
      : `${studentInfo.enrollmentNumber}_Semester_${semester}_Result.pdf`;

  doc.save(fileName);
}

function addSemesterTable(
  doc: jsPDF,
  semester: ProcessedSemester,
  startY: number,
  showMarksBreakdown: boolean,
  addPageBreak: boolean
): number {
  const primaryLime: [number, number, number] = [163, 255, 25];
  const darkBg: [number, number, number] = [0, 0, 0];
  const cardBg: [number, number, number] = [38, 38, 38];
  const cardBgAlt: [number, number, number] = [28, 28, 28];
  const textWhite: [number, number, number] = [255, 255, 255];
  const textGray: [number, number, number] = [163, 163, 163];
  const borderGray: [number, number, number] = [64, 64, 64];

  // Check if we need a new page
  if (addPageBreak || startY > 230) {
    doc.addPage();
    // Fill new page with black background
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, 210, 297, "F");
    startY = 20;
  }

  // Semester Header - Dark design with lime accent
  doc.setFillColor(...cardBg);
  doc.rect(15, startY, 180, 14, "F");

  // Lime accent bar on left
  doc.setFillColor(...primaryLime);
  doc.rect(15, startY, 3, 14, "F");

  doc.setTextColor(...primaryLime);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`SEMESTER ${semester.euno}`, 22, startY + 9);

  // SGPA Badge
  doc.setTextColor(...textWhite);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `SGPA: ${semester.sgpa.toFixed(2)}  |  Total: ${
      semester.totalMarks
    }  |  Credits: ${semester.credits}`,
    193,
    startY + 9,
    { align: "right" }
  );

  startY += 18;

  // Table headers based on breakdown setting
  const headers = showMarksBreakdown
    ? [["Paper Code", "Subject Name", "Internal", "External", "Total", "Grade"]]
    : [["Paper Code", "Subject Name", "Total", "Grade"]];

  // Table data
  const tableData = semester.filteredSubjects.map((subject) => {
    const totalMarks = parseFloat(subject.moderatedprint) || 0;
    const grade = marksToGrade(totalMarks);

    if (showMarksBreakdown) {
      return [
        subject.papercode,
        subject.papername,
        subject.minorprint === "-" ? "-" : subject.minorprint,
        subject.majorprint,
        subject.moderatedprint,
        grade,
      ];
    }
    return [
      subject.papercode,
      subject.papername,
      subject.moderatedprint,
      grade,
    ];
  });

  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: startY,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [200, 200, 200],
      fillColor: cardBgAlt,
      lineColor: borderGray,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: cardBg,
      textColor: textWhite,
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: cardBg,
    },
    columnStyles: showMarksBreakdown
      ? {
          0: { cellWidth: 25 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 18, halign: "center" },
          5: { cellWidth: 18, halign: "center" },
        }
      : {
          0: { cellWidth: 30 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 25, halign: "center" },
          3: { cellWidth: 25, halign: "center" },
        },
    margin: { left: 15, right: 15 },
    didParseCell: (data) => {
      // Style the Grade column with colors
      const gradeColIndex = showMarksBreakdown ? 5 : 3;
      if (data.section === "body" && data.column.index === gradeColIndex) {
        const grade = data.cell.raw as string;
        if (grade === "O" || grade === "A+") {
          data.cell.styles.textColor = primaryLime; // Lime for excellent
          data.cell.styles.fontStyle = "bold";
        } else if (grade === "A" || grade === "B+") {
          data.cell.styles.textColor = [96, 165, 250]; // Light blue for good
        } else if (grade === "F") {
          data.cell.styles.textColor = [248, 113, 113]; // Light red for fail
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  return (
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10
  );
}

function addSummaryTable(
  doc: jsPDF,
  semesters: ProcessedSemester[],
  startY: number,
  cgpa: number
): number {
  const primaryLime: [number, number, number] = [163, 255, 25];
  const darkBg: [number, number, number] = [0, 0, 0];
  const cardBg: [number, number, number] = [38, 38, 38];
  const cardBgAlt: [number, number, number] = [28, 28, 28];
  const textWhite: [number, number, number] = [255, 255, 255];
  const borderGray: [number, number, number] = [64, 64, 64];

  // Check if we need a new page
  if (startY > 240) {
    doc.addPage();
    // Fill new page with black background
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, 210, 297, "F");
    startY = 20;
  }

  // Summary Header - matching semester header style
  doc.setFillColor(...cardBg);
  doc.rect(15, startY, 180, 14, "F");

  // Lime accent bar on left
  doc.setFillColor(...primaryLime);
  doc.rect(15, startY, 3, 14, "F");

  doc.setTextColor(...primaryLime);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SEMESTER SUMMARY", 22, startY + 9);

  startY += 18;

  const summaryData = semesters.map((sem) => [
    `Semester ${sem.euno}`,
    sem.filteredSubjects.length.toString(),
    sem.credits.toString(),
    sem.totalMarks.toString(),
    sem.sgpa.toFixed(2),
  ]);

  // Add CGPA row
  const totalSubjects = semesters.reduce(
    (sum, s) => sum + s.filteredSubjects.length,
    0
  );
  const totalCredits = semesters.reduce((sum, s) => sum + s.credits, 0);
  const totalMarks = semesters.reduce((sum, s) => sum + s.totalMarks, 0);

  summaryData.push([
    "Overall",
    totalSubjects.toString(),
    totalCredits.toString(),
    totalMarks.toString(),
    cgpa.toFixed(2),
  ]);

  autoTable(doc, {
    head: [["Semester", "Subjects", "Credits", "Total Marks", "GPA"]],
    body: summaryData,
    startY: startY,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 5,
      textColor: [200, 200, 200],
      fillColor: cardBgAlt,
      lineColor: borderGray,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: cardBg,
      textColor: textWhite,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: cardBg,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 40, halign: "center" },
      4: { cellWidth: 30, halign: "center" },
    },
    margin: { left: 15, right: 15 },
    didParseCell: (data) => {
      // Highlight the overall row with lime
      if (data.row.index === summaryData.length - 1) {
        data.cell.styles.fillColor = primaryLime;
        data.cell.styles.textColor = darkBg;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  return (
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10
  );
}
