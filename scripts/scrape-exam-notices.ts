import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

interface ExamNotice {
  title: string;
  link: string;
  uploadDate: string;
}

const EXAM_NOTICES_URL = "http://164.100.158.135/ExamResults/ExamResultsmain.htm";
const OUTPUT_DIR = path.join(process.cwd(), "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "exam-notices.json");

/**
 * Extract year from notice title by finding 4-digit numbers starting with "20"
 * Returns the first valid year found (2000-2099)
 */
function extractYearFromTitle(title: string): number | null {
  // Match 4-digit numbers starting with "20" (2000-2099)
  const yearMatch = title.match(/\b20\d{2}\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    if (year >= 2000 && year <= 2099) {
      return year;
    }
  }
  return null;
}

/**
 * Correct the upload date by extracting year from title if the parsed date seems incorrect
 * Records are grouped by year on the website, so if a date has an invalid year (too far in future),
 * we should correct it using the year from the title
 * Date format: "DD-MM-YY" or "DD-MM-YYYY"
 */
function correctUploadDate(uploadDate: string, title: string): string {
  if (!uploadDate || uploadDate === "N/A") {
    return uploadDate;
  }

  const parts = uploadDate.split("-");
  if (parts.length !== 3) {
    return uploadDate;
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);

  // Handle 2-digit years (assume 2000-2099)
  if (year < 100) {
    year += 2000;
  }

  // If year seems incorrect (too far in future), try to extract from title
  // Records are grouped by year, so an outlier year likely indicates an error
  const currentYear = new Date().getFullYear();
  if (year > currentYear + 2) {
    // Year seems too far in future, extract from title
    const titleYear = extractYearFromTitle(title);
    if (titleYear && titleYear >= 2000 && titleYear <= currentYear + 1) {
      year = titleYear;
      // Reconstruct date with corrected year
      const dayStr = String(day).padStart(2, "0");
      const monthStr = String(month).padStart(2, "0");
      const yearStr = String(year).slice(-2); // Use 2-digit year format
      return `${dayStr}-${monthStr}-${yearStr}`;
    }
  }

  return uploadDate;
}

async function scrapeExamNotices(): Promise<ExamNotice[]> {
  try {
    console.log("Fetching examination notices from:", EXAM_NOTICES_URL);

    const response = await axios.get(EXAM_NOTICES_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data as string);
    const notices: ExamNotice[] = [];

    // Find the table containing notices
    // The table has rows with notice links in first column and dates in second column
    // Skip the header row (first row usually contains th elements)
    $("table tr").each((index, element) => {
      const $row = $(element);
      const $cells = $row.find("td");

      // Skip rows that don't have at least 2 cells or are header rows
      if ($cells.length < 2 || $row.find("th").length > 0) {
        return;
      }

      // First cell contains the notice title/link
      const $linkCell = $cells.eq(0);
      const $link = $linkCell.find("a").first();

      if ($link.length > 0) {
        const title = $link.text().trim();
        let link = $link.attr("href") || "";

        // Skip if no title or link
        if (!title || !link) {
          return;
        }

        // Handle relative URLs - the links are relative paths like "2026/200126/Notice..."
        if (link && !link.startsWith("http")) {
          if (link.startsWith("http://ipu.ac.in/")) {
            // Already has full URL
          } else if (link.startsWith("/")) {
            link = `http://164.100.158.135${link}`;
          } else {
            // Relative path like "2026/200126/Notice..." or "../Pubinfo2025/..."
            if (link.startsWith("../")) {
              link = `http://164.100.158.135/${link.replace("../", "")}`;
            } else {
              link = `http://164.100.158.135/ExamResults/${link}`;
            }
          }
        }

        // Second cell contains the upload date
        let uploadDate = $cells.eq(1).text().trim();

        // Normalize title
        const normalizedTitle = title.replace(/\s+/g, " ").replace(/\n/g, " ");

        // Correct upload date by extracting year from title if needed
        uploadDate = correctUploadDate(uploadDate || "N/A", normalizedTitle);

        // Only add if we have both title and link
        if (normalizedTitle && link && normalizedTitle.length > 0) {
          notices.push({
            title: normalizedTitle,
            link,
            uploadDate,
          });
        }
      }
    });

    console.log(`Scraped ${notices.length} examination notices`);
    return notices;
  } catch (error) {
    console.error("Error scraping examination notices:", error);
    throw error;
  }
}

async function saveNotices(notices: ExamNotice[]): Promise<void> {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const data = {
      notices,
      lastUpdated: new Date().toISOString(),
      total: notices.length,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Saved ${notices.length} notices to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error saving notices:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Starting examination notices scraper...");
    const notices = await scrapeExamNotices();
    await saveNotices(notices);
    console.log("Scraping completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Scraping failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { scrapeExamNotices, saveNotices };
