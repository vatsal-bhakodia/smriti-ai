// scripts/backfillQuizResults.ts
/**
 * Safer, batched backfill for QuizResult.userId (UUID-safe)
 *
 * Usage:
 *   DRY_RUN=true BATCH_SIZE=200 npx ts-node --transpile-only scripts/backfillQuizResults.ts
 *   DRY_RUN=false BATCH_SIZE=200 npx ts-node --transpile-only scripts/backfillQuizResults.ts
 *
 * Defaults:
 *   DRY_RUN = true
 *   BATCH_SIZE = 200
 *
 * Behavior:
 *  - Finds QuizResult rows with userId == null in ascending id (UUID) order
 *  - Uses cursor pagination to process records in batches
 *  - For each batch, resolves userId from quiz.resource.topic.userId
 *  - Updates only rows that have a resolved userId, wrapped in a transaction
 *  - Logs per-batch progress and a final summary
 *
 * Safety:
 *  - Default is DRY_RUN=true to avoid accidental writes
 *  - Idempotent: updates are guarded so they only apply when userId IS NULL
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DRY_RUN = (process.env.DRY_RUN ?? "true").toLowerCase() === "true";
const BATCH_SIZE = Number(process.env.BATCH_SIZE ?? 200);
const MAX_LOG_IDS = 50; // limit IDs printed per batch to avoid huge logs

type Row = {
  id: string;
  quiz: {
    resource?: {
      topic?: {
        userId?: string | null;
      } | null;
    } | null;
  } | null;
};

async function fetchFirstBatch(): Promise<Row[]> {
  return prisma.quizResult.findMany({
    where: { userId: null },
    orderBy: { id: "asc" },
    take: BATCH_SIZE,
    include: {
      quiz: {
        include: {
          resource: {
            include: {
              topic: {
                select: { userId: true },
              },
            },
          },
        },
      },
    },
  });
}

async function fetchNextBatch(afterId: string): Promise<Row[]> {
  return prisma.quizResult.findMany({
    where: { userId: null },
    orderBy: { id: "asc" },
    cursor: { id: afterId },
    skip: 1,
    take: BATCH_SIZE,
    include: {
      quiz: {
        include: {
          resource: {
            include: {
              topic: {
                select: { userId: true },
              },
            },
          },
        },
      },
    },
  });
}

async function applyBatch(rows: Row[], batchNo: number) {
  const fetched = rows.length;
  if (fetched === 0) {
    return { fetched: 0, updated: 0, lastId: null as string | null };
  }

  const updates = rows
    .map((r) => {
      const userId = r.quiz?.resource?.topic?.userId ?? null;
      return { id: r.id, userId };
    })
    .filter((u) => u.userId !== null) as { id: string; userId: string }[];

  console.log(
    `Batch #${batchNo}: fetched ${fetched}. Candidates to update: ${updates.length}.`
  );

  const lastId = rows[rows.length - 1].id;

  if (DRY_RUN) {
    updates.forEach((u) =>
      console.log(
        `[DRY_RUN] would update QuizResult ${u.id} -> userId=${u.userId}`
      )
    );
    return { fetched, updated: 0, lastId };
  }

  if (updates.length === 0) {
    return { fetched, updated: 0, lastId };
  }

  // Build transactional updateMany operations guarded by userId === null
  const ops = updates.map((u) =>
    prisma.quizResult.updateMany({
      where: { id: u.id, userId: null },
      data: { userId: u.userId },
    })
  );

  // Run transaction: results will be an array of { count: number }
  const results = (await prisma.$transaction(ops)) as Array<{ count: number }>;

  // Determine which updates applied
  const appliedIds: string[] = [];
  for (let i = 0; i < results.length; i++) {
    if ((results[i]?.count ?? 0) > 0) {
      appliedIds.push(updates[i].id);
    }
  }

  const applied = appliedIds.length;
  const skipped = updates.length - applied;

  // Log summary of the batch (concise)
  let summaryMsg = `Batch #${batchNo}: applied ${applied}/${updates.length} updates`;
  if (skipped) summaryMsg += `, skipped ${skipped} (likely concurrent changes)`;
  summaryMsg += ".";
  console.log(summaryMsg);

  if (applied > 0) {
    const idsToLog = appliedIds.slice(0, MAX_LOG_IDS);
    console.log(
      `IDs updated (first ${idsToLog.length}${
        applied > MAX_LOG_IDS ? ` of ${applied}` : ""
      }): ${idsToLog.join(", ")}${applied > MAX_LOG_IDS ? " ..." : ""}`
    );
  }

  return { fetched, updated: applied, lastId };
}

async function main() {
  console.log("Starting QuizResult backfill");
  console.log(`DRY_RUN=${DRY_RUN}, BATCH_SIZE=${BATCH_SIZE}`);

  let cursor: string | null = null;
  let totalFetched = 0;
  let totalUpdated = 0;
  let batchNo = 0;

  try {
    // initial batch
    let rows = await fetchFirstBatch();

    while (rows.length > 0) {
      batchNo += 1;
      const { fetched, updated, lastId } = await applyBatch(rows, batchNo);

      totalFetched += fetched;
      totalUpdated += updated;
      cursor = lastId;

      // If this was a partial batch, we're done
      if (fetched < BATCH_SIZE) break;

      if (!cursor) break; // safety
      rows = await fetchNextBatch(cursor);
    }

    console.log("--- Summary ---");
    console.log(`Total rows fetched: ${totalFetched}`);
    if (DRY_RUN) {
      console.log("Dry run — no updates were applied.");
    } else {
      console.log(`Total rows updated: ${totalUpdated}`);
    }
    console.log("Backfill completed.");
  } catch (err) {
    console.error("Backfill failed with error:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
