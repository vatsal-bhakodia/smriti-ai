import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { marksToGrade, getSubjectCredits } from "@/utils/result";
import { ProcessedData, ProcessedSemester, CreditsMap } from "@/types/result";

interface ManualCreditsData {
  type: "semester" | "subject";
  semesterCredits?: Record<number, number>;
  subjectCredits?: Record<string, number>;
}

interface ExportOptions {
  processedData: ProcessedData;
  semester: number | "OVERALL";
  creditsMap?: CreditsMap;
  manualCGPA?: number | null;
  manualCredits?: ManualCreditsData | null;
}

export async function exportResultToPDF({
  processedData,
  semester,
  creditsMap = {},
  manualCGPA,
  manualCredits,
}: ExportOptions): Promise<void> {
  const doc = new jsPDF();
  const { studentInfo, semesters, cgpa: systemCGPA } = processedData;
  const hasCreditsData = Object.keys(creditsMap).length > 0;
  
  // Use manual CGPA if available, otherwise use system CGPA
  const cgpa = manualCGPA ?? systemCGPA;

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

  // ===== TITLE HEADER =====
  // "GGSIPU" in lime, "Exam Result" in white
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const ggsipuText = "GGSIPU";
  const examResultText = " EXAM RESULT";
  const ggsipuWidth = doc.getTextWidth(ggsipuText);
  const examResultWidth = doc.getTextWidth(examResultText);
  const totalWidth = ggsipuWidth + examResultWidth;
  const pageWidth = doc.internal.pageSize.getWidth();
  const startX = (pageWidth - totalWidth) / 2;
  
  doc.setTextColor(...primaryLime);
  doc.text(ggsipuText, startX, yPosition + 8);
  doc.setTextColor(...textWhite);
  doc.text(examResultText, startX + ggsipuWidth, yPosition + 8);

  // Divider line below title
  yPosition += 12;
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.3);
  doc.line(10, yPosition, 200, yPosition);

  yPosition += 6;

  // ===== HEADER SECTION =====
  // Main header container with lime border
  const headerX = 10;
  const headerY = yPosition;
  const headerW = 190;
  const headerH = 60;

  // Inner content area
  doc.setFillColor(...cardBg);
  doc.roundedRect(headerX + 1, headerY + 1, headerW - 2, headerH - 2, 3, 3, "F");

  // Left section width calculation
  const leftSectionW = cgpa !== null ? 130 : headerW - 6;

  // Student Name - Top left
  doc.setTextColor(...textWhite);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(studentInfo.name.toUpperCase(), headerX + 8, headerY + 12);

  // Enrollment number right below name
  doc.setTextColor(...textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("ENROLLMENT NO.", headerX + 8, headerY + 19);
  doc.setTextColor(...textWhite);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(studentInfo.enrollmentNumber, headerX + 8, headerY + 24);

  // Year of Admission next to enrollment
  doc.setTextColor(...textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("YEAR", headerX + 48, headerY + 19);
  doc.setTextColor(...textWhite);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(studentInfo.yearOfAdmission.toString(), headerX + 48, headerY + 24);

  // Divider line
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.3);
  doc.line(headerX + 8, headerY + 28, headerX + leftSectionW, headerY + 28);

  // Institute info
  doc.setTextColor(...textGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("INSTITUTE", headerX + 8, headerY + 34);
  
  doc.setTextColor(...textWhite);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const maxInstLen = 50;
  const instText = studentInfo.institute.length > maxInstLen 
    ? studentInfo.institute.substring(0, maxInstLen - 3) + "..." 
    : studentInfo.institute;
  doc.text(instText, headerX + 8, headerY + 40);
  const instTextWidth = doc.getTextWidth(instText); // Get width while font is still 8pt
  
  // Institute code badge - dynamic width based on text
  doc.setFontSize(6);
  const instCodeText = studentInfo.instituteCode;
  const instCodeWidth = doc.getTextWidth(instCodeText) + 3; // padding
  const instCodeHeight = 4;
  doc.setFillColor(...borderGray);
  const instCodeX = headerX + 8 + instTextWidth + 3;
  doc.roundedRect(instCodeX, headerY + 37, instCodeWidth, instCodeHeight, 1, 1, "F");
  doc.setTextColor(...primaryLime);
  doc.text(instCodeText, instCodeX + 1.5, headerY + 40);

  // Program info
  doc.setTextColor(...textGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("PROGRAM", headerX + 8, headerY + 47);
  
  doc.setTextColor(...textWhite);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const maxProgLen = 50;
  const progText = studentInfo.program.length > maxProgLen 
    ? studentInfo.program.substring(0, maxProgLen - 3) + "..." 
    : studentInfo.program;
  doc.text(progText, headerX + 8, headerY + 53);
  const progTextWidth = doc.getTextWidth(progText); // Get width while font is still 8pt
  
  // Program code badge - dynamic width based on text
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  const progCodeText = studentInfo.programCode;
  const progCodeWidth = doc.getTextWidth(progCodeText) + 3; // padding
  const progCodeHeight = 4;
  doc.setFillColor(...primaryLime);
  const progCodeX = headerX + 8 + progTextWidth + 3;
  doc.roundedRect(progCodeX, headerY + 50, progCodeWidth, progCodeHeight, 1, 1, "F");
  doc.setTextColor(...darkBg);
  doc.text(progCodeText, progCodeX + 1.5, headerY + 53);

  // ===== CGPA CARD (right side) =====
  if (cgpa !== null) {
    const cgpaX = headerX + leftSectionW + 8;
    const cgpaY = headerY + 8;
    const cgpaW = headerW - leftSectionW - 16;
    const cgpaH = headerH - 16;

    // CGPA container with lime accent
    doc.setFillColor(28, 28, 28); // Slightly darker for emphasis
    doc.roundedRect(cgpaX, cgpaY, cgpaW, cgpaH, 3, 3, "F");
    
    // "CUMULATIVE GPA" label
    doc.setTextColor(...textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const labelText = "CUMULATIVE GPA";
    const labelWidth = doc.getTextWidth(labelText);
    doc.text(labelText, cgpaX + (cgpaW - labelWidth) / 2, cgpaY + 10);

    // CGPA value - centered and large
    doc.setTextColor(...primaryLime);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const cgpaText = cgpa.toFixed(2);
    const cgpaWidth = doc.getTextWidth(cgpaText);
    doc.text(cgpaText, cgpaX + (cgpaW - cgpaWidth) / 2, cgpaY + 26);

    // "Out of 10.0" subtitle
    doc.setTextColor(...textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const subtitleText = "Out of 10.0";
    const subtitleWidth = doc.getTextWidth(subtitleText);
    doc.text(subtitleText, cgpaX + (cgpaW - subtitleWidth) / 2, cgpaY + 34);
  }

  yPosition = headerY + headerH + 12;

  // Generate tables based on selection
  if (semester === "OVERALL") {
    // Export all semesters
    semesters.forEach((sem, index) => {
      yPosition = addSemesterTable(
        doc,
        sem,
        yPosition,
        index > 0,
        hasCreditsData ? creditsMap : undefined,
        studentInfo.program,
        manualCredits
      );
    });

    // Add summary table on a new page (only if cgpa is available)
    if (cgpa !== null) {
      yPosition = addSummaryTable(doc, semesters, cgpa, manualCredits);
    }
  } else {
    // Export specific semester
    const selectedSemester = semesters.find((s) => s.euno === semester);
    if (selectedSemester) {
      yPosition = addSemesterTable(
        doc,
        selectedSemester,
        yPosition,
        false,
        hasCreditsData ? creditsMap : undefined,
        studentInfo.program,
        manualCredits
      );
    }
  }

  // Add footer to all pages
  await addFooterToAllPages(doc);

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
  addPageBreak: boolean,
  creditsMap?: CreditsMap,
  programName?: string,
  manualCredits?: ManualCreditsData | null
): number {
  const primaryLime: [number, number, number] = [163, 255, 25];
  const darkBg: [number, number, number] = [0, 0, 0];
  const cardBg: [number, number, number] = [38, 38, 38];
  const cardBgAlt: [number, number, number] = [28, 28, 28];
  const textWhite: [number, number, number] = [255, 255, 255];
  const borderGray: [number, number, number] = [64, 64, 64];

  // Show credits column only if:
  // 1. We have creditsMap data from API, OR
  // 2. User has entered subject-level manual credits (not just semester totals)
  const hasCreditsMapData = !!creditsMap && Object.keys(creditsMap).length > 0;
  const hasSubjectLevelManualCredits = manualCredits?.type === "subject";
  const showCredits = hasCreditsMapData || hasSubjectLevelManualCredits;

  // Check if we need a new page
  if (addPageBreak || startY > 230) {
    doc.addPage();
    // Fill new page with black background
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, 210, 297, "F");
    startY = 20;
  }

  // Semester Header - Dark design with lime accent and rounded corners
  // Match table margins: left: 15, right: 15 (table width = 180)
  const tableMarginLeft = 15;
  const tableWidth = 180;
  const headerPaddingX = 3;
  const totalHeaderHeight = 12;
  
  // Main rounded background
  doc.setFillColor(...cardBg);
  doc.roundedRect(tableMarginLeft, startY, tableWidth, totalHeaderHeight, 2, 2, "F");

  // Lime accent bar on left (with matching rounded corners on left side)
  doc.setFillColor(...primaryLime);
  doc.roundedRect(tableMarginLeft, startY, 3, totalHeaderHeight, 1, 1, "F");
  // Fill the right side of the accent to make it flat against content
  doc.rect(tableMarginLeft + 1.5, startY, 1.5, totalHeaderHeight, "F");

  // Semester title - vertically centered
  const textY = startY + totalHeaderHeight / 1.5;
  doc.setTextColor(...primaryLime);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`SEMESTER ${semester.euno}`, tableMarginLeft + headerPaddingX + 3, textY);

  // SGPA and stats on right side
  doc.setTextColor(...textWhite);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  
  // Use manual credits if available (semester-level), otherwise use semester.credits
  const displayCredits = manualCredits?.type === "semester" && manualCredits.semesterCredits?.[semester.euno]
    ? manualCredits.semesterCredits[semester.euno]
    : semester.credits;
  
  // Show credits in header if we have any credit data (semester or subject level) or API data
  const showCreditsInHeader = hasCreditsMapData || !!manualCredits;
  
  const statsText = showCreditsInHeader 
    ? `SGPA: ${semester.sgpa.toFixed(2)}  |  Total: ${semester.totalMarks}  |  Credits: ${displayCredits}`
    : `SGPA: ${semester.sgpa.toFixed(2)}  |  Total: ${semester.totalMarks}`;
  doc.text(statsText, tableMarginLeft + tableWidth - headerPaddingX, textY, { align: "right" });

  startY += totalHeaderHeight + 4;

  // Table headers - always show marks breakdown, optionally show credits
  const headers: string[][] = showCredits
    ? [["Paper Code", "Subject Name", "Internal", "External", "Total", "Credits", "Grade"]]
    : [["Paper Code", "Subject Name", "Internal", "External", "Total", "Grade"]];

  // Table data
  const tableData = semester.filteredSubjects.map((subject) => {
    const totalMarks = parseFloat(subject.moderatedprint) || 0;
    const grade = marksToGrade(totalMarks);
    
    // Get credits breakdown if available
    let creditsStr = "-";
    if (showCredits) {
      // Check for manual subject-level credits first
      // Manual credits are stored with key format: `${semesterNumber}-${papercode}`
      const manualCreditKey = `${semester.euno}-${subject.papercode}`;
      if (manualCredits?.type === "subject" && manualCredits.subjectCredits?.[manualCreditKey]) {
        creditsStr = `${manualCredits.subjectCredits[manualCreditKey]}`;
      } else if (hasCreditsMapData && programName) {
        // Fall back to creditsMap if no manual credits for this subject
        const subjectCredits = getSubjectCredits(subject, creditsMap, programName);
        if (subjectCredits) {
          if (subjectCredits.practical !== null && subjectCredits.practical > 0 && subjectCredits.theory > 0) {
            creditsStr = `${subjectCredits.theory}+${subjectCredits.practical}`;
          } else {
            creditsStr = `${subjectCredits.total}`;
          }
        }
      }
    }

    if (showCredits) {
      return [
        subject.papercode,
        subject.papername,
        subject.minorprint === "-" ? "-" : subject.minorprint,
        subject.majorprint,
        subject.moderatedprint,
        creditsStr,
        grade,
      ];
    }
    return [
      subject.papercode,
      subject.papername,
      subject.minorprint === "-" ? "-" : subject.minorprint,
      subject.majorprint,
      subject.moderatedprint,
      grade,
    ];
  });

  // Grade column index depends on whether credits are shown
  const gradeColIndex = showCredits ? 6 : 5;

  // Column styles based on whether credits are shown
  const columnStyles: Record<number, { cellWidth: number | "auto"; halign?: "center" | "left" | "right" }> = showCredits
    ? {
        0: { cellWidth: 22 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 18, halign: "center" },
        3: { cellWidth: 18, halign: "center" },
        4: { cellWidth: 16, halign: "center" },
        5: { cellWidth: 18, halign: "center" },
        6: { cellWidth: 16, halign: "center" },
      }
    : {
        0: { cellWidth: 25 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 18, halign: "center" },
        5: { cellWidth: 18, halign: "center" },
      };

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
      minCellHeight: 8,
      valign: "middle",
      overflow: "visible",
    },
    alternateRowStyles: {
      fillColor: cardBg,
    },
    columnStyles,
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Add black background to new pages created by autoTable (page breaks)
      // data.pageNumber is the table's internal page count (1-based)
      // We check if cursor is at the top of the page (meaning new page was created)
      if (data.pageNumber > 1) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      }
    },
    didParseCell: (data) => {
      // Style the Grade column with colors
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

async function addFooterToAllPages(doc: jsPDF): Promise<void> {
  const primaryLime: [number, number, number] = [163, 255, 25];
  const cardBg: [number, number, number] = [38, 38, 38];
  const textWhite: [number, number, number] = [255, 255, 255];
  const borderGray: [number, number, number] = [64, 64, 64];

  // Load brain icon for footer
  let brainIconBase64: string | null = null;
  try {
    const response = await fetch("/brain-icon.png");
    const blob = await response.blob();
    const reader = new FileReader();
    brainIconBase64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    // Icon will not be shown if fetch fails
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background
    doc.setFillColor(...cardBg);
    doc.rect(0, 282, 210, 15, "F");

    // Top border line
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(0, 282, 210, 282);

    // Footer left side - Logo + "Generated using Smriti AI"
    const logoSize = 5;
    const logoX = 15;
    const logoY = 286;
    const gap = 2;

    // Add logo if available
    if (brainIconBase64) {
      doc.addImage(brainIconBase64, "PNG", logoX, logoY, logoSize, logoSize);
    }

    // Brand text next to logo - bold and sized to match logo height
    doc.setTextColor(...textWhite);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const textX = brainIconBase64 ? logoX + logoSize + gap : logoX;
    // Vertically center text with logo (baseline adjustment for 12pt font)
    doc.text("Smriti AI", textX, logoY + logoSize * 0.8);

    // Footer link - right side
    doc.setFontSize(8);
    doc.setTextColor(...primaryLime);
    doc.setFont("helvetica", "bold");
    doc.textWithLink("Get yours at smriti.live/result", 195, 290, {
      align: "right",
      url: "https://www.smriti.live/result",
    });
  }
}

function addSummaryTable(
  doc: jsPDF,
  semesters: ProcessedSemester[],
  cgpa: number,
  manualCredits?: ManualCreditsData | null
): number {
  const primaryLime: [number, number, number] = [163, 255, 25];
  const darkBg: [number, number, number] = [0, 0, 0];
  const cardBg: [number, number, number] = [38, 38, 38];
  const cardBgAlt: [number, number, number] = [28, 28, 28];
  const textWhite: [number, number, number] = [255, 255, 255];
  const borderGray: [number, number, number] = [64, 64, 64];

  // Always start summary on a new page
  doc.addPage();
  // Fill new page with black background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 297, "F");
  let startY = 20;

  // Summary Header - matching semester header style with rounded corners
  // Match table margins: left: 15, right: 15 (table width = 180)
  const tableMarginLeft = 15;
  const tableWidth = 180;
  const headerPaddingX = 8;
  const headerPaddingY = 2;
  const totalHeaderHeight = 10 + (headerPaddingY * 2);
  
  // Main rounded background
  doc.setFillColor(...cardBg);
  doc.roundedRect(tableMarginLeft, startY, tableWidth, totalHeaderHeight, 2, 2, "F");

  // Lime accent bar on left (with matching rounded corners on left side)
  doc.setFillColor(...primaryLime);
  doc.roundedRect(tableMarginLeft, startY, 3, totalHeaderHeight, 1, 1, "F");
  // Fill the right side of the accent to make it flat against content
  doc.rect(tableMarginLeft + 1.5, startY, 1.5, totalHeaderHeight, "F");

  // Title - vertically centered
  const textY = startY + totalHeaderHeight / 2 + 3;
  doc.setTextColor(...primaryLime);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SEMESTER SUMMARY", tableMarginLeft + headerPaddingX + 3, textY);

  startY += totalHeaderHeight + 4;

  const summaryData = semesters.map((sem) => {
    // Use manual credits if available (semester-level), otherwise use sem.credits
    const credits = manualCredits?.type === "semester" && manualCredits.semesterCredits?.[sem.euno]
      ? manualCredits.semesterCredits[sem.euno]
      : sem.credits;
    
    return [
      `Semester ${sem.euno}`,
      sem.filteredSubjects.length.toString(),
      credits.toString(),
      sem.totalMarks.toString(),
      sem.sgpa.toFixed(2),
    ];
  });

  // Add CGPA row
  const totalSubjects = semesters.reduce(
    (sum, s) => sum + s.filteredSubjects.length,
    0
  );
  const totalCredits = semesters.reduce((sum, s) => {
    const credits = manualCredits?.type === "semester" && manualCredits.semesterCredits?.[s.euno]
      ? manualCredits.semesterCredits[s.euno]
      : s.credits;
    return sum + credits;
  }, 0);
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
      minCellHeight: 8,
      valign: "middle",
      overflow: "visible",
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
    didDrawPage: (data) => {
      // Add black background to new pages created by autoTable (page breaks)
      if (data.pageNumber > 1) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      }
    },
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
