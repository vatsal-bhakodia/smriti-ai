// components/topic/TopicQuizProgress.tsx
"use client";

import { use } from "react";
import { LoaderCircle } from "lucide-react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TopicQuizProgress({ topicId }: { topicId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/topic/${topicId}/quiz-progress`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-destructive">
        Failed to load quiz progress data.
      </div>
    );
  }

  const userAnswers = data?.data || [];
  const totalQuestionsAnswered = userAnswers.length;
  const correctAnswers = userAnswers.filter((answer: any) => answer.isCorrect).length;
  const percentage = totalQuestionsAnswered > 0 ? (correctAnswers / totalQuestionsAnswered) * 100 : 0;
  const averageScore = totalQuestionsAnswered > 0 ? (correctAnswers / totalQuestionsAnswered * 100).toFixed(2) : "N/A";

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Questions Answered</CardTitle>
          <CardDescription>Total number of questions answered for this topic.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalQuestionsAnswered}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Correct Answers</CardTitle>
          <CardDescription>Overall correct answers across all quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{correctAnswers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
          <CardDescription>Average correct answers per quiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{averageScore}%</p>
        </CardContent>
      </Card>
    </div>
  );
}