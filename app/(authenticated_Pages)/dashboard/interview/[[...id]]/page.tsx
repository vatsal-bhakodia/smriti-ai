"use client";

import useSWR from "swr";
import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher: (url: string) => Promise<any> = (url: string) =>
  fetch(url).then((r) => r.json());

export default function InterviewQuizDetailPage({
  params,
}: {
  params: Promise<{ id?: string[] }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const quizId = useMemo(() => resolvedParams.id?.[0], [resolvedParams.id]);
  const { data, error } = useSWR(
    quizId ? `/api/interview/quiz/${quizId}` : null,
    fetcher
  );

  if (!quizId) return null;

  const quiz = data?.quiz;

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 bg-background text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Interview Quiz Details
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/interview")}
        >
          Back
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm">Failed to load</div>}
      {quiz && (
        <Card>
          <CardHeader>
            <CardTitle>
              {quiz.language} •{" "}
              {quiz.domains && quiz.domains.length
                ? quiz.domains.join(", ")
                : quiz.domain}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(quiz.questions || []).map((q: any, idx: number) => (
              <div key={q.id} className="space-y-2">
                <div className="font-medium">
                  {idx + 1}. {q.question}
                </div>
                <ul className="list-disc pl-6 text-sm">
                  {(q.options || []).map((opt: string) => (
                    <li key={opt}>{opt}</li>
                  ))}
                </ul>
                <div className="text-sm">
                  Correct:{" "}
                  <span className="font-semibold">{q.correctAnswer}</span>
                </div>
                {q.explanation && (
                  <div className="text-sm text-muted-foreground">
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
