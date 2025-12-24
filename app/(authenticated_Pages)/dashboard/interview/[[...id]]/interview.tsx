"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Question = {
  id: string;
  question: string;
  options: string[];
  difficulty?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type InterviewAnalytics = {
  averageScore: number;
  questionsPractised: number;
  totalQuestionsAnswered: number;
  latestScore: number | null;
  performanceTrend: Array<{ date: string; averageScore: number }>;
  aiInsights?: string | null;
};

type InterviewHistory = {
  quizzes: Array<{
    id: string;
    language: string;
    domain: string;
    domains?: string[];
    createdAt: string;
    results?: Array<{
      id: string;
      score: number;
      totalQuestions: number;
      createdAt: string;
    }>;
  }>;
};

export default function InterviewPrepPage() {
  const [language, setLanguage] = useState<string>("Python");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState<string>("");
  const [domainError, setDomainError] = useState<string>("");
  const [count, setCount] = useState<number>(10);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: analytics, mutate: refreshAnalytics } =
    useSWR<InterviewAnalytics>(
      "/api/interview/analytics?insights=true",
      fetcher
    );
  const { data: history, mutate: refreshHistory } = useSWR<InterviewHistory>(
    "/api/interview/history",
    fetcher
  );

  // History filters
  const [historySearch, setHistorySearch] = useState<string>("");
  const [historyFrom, setHistoryFrom] = useState<string>("");
  const [historyTo, setHistoryTo] = useState<string>("");
  const [historyLang, setHistoryLang] = useState<string>("ALL");
  const historyLanguages = useMemo(
    () =>
      Array.from(
        new Set((history?.quizzes || []).map((q) => q.language))
      ).sort(),
    [history]
  );

  async function generateQuiz() {
    setQuizId(null);
    setQuestions([]);
    setAnswers({});
    if (selectedDomains.length === 0) {
      setDomainError("Please add at least one topic/domain");
      return;
    }
    const payload: any = { language, count, domains: selectedDomains };
    const { data } = await axios.post<{
      quizId: string;
      questions: Question[];
    }>("/api/interview/generate", payload);
    setQuizId(data.quizId);
    setQuestions(data.questions);
  }

  function addDomain() {
    const value = newDomain.trim();
    if (!value) return;
    if (selectedDomains.includes(value)) {
      setDomainError("Already added");
      return;
    }
    if (selectedDomains.length >= 8) {
      setDomainError("You can add up to 8 domains");
      return;
    }
    setSelectedDomains((prev) => [...prev, value]);
    setNewDomain("");
    setDomainError("");
  }

  function removeDomain(value: string) {
    setSelectedDomains((prev) => prev.filter((d) => d !== value));
  }

  function selectAnswer(qid: string, option: string) {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  }

  const allAnswered = useMemo(
    () => questions.length > 0 && questions.every((q) => answers[q.id]),
    [questions, answers]
  );

  async function submit() {
    if (!quizId || !allAnswered) return;
    setSubmitting(true);
    try {
      await axios.post("/api/interview/submit", {
        quizId,
        answers: Object.entries(answers).map(
          ([questionId, selectedOption]) => ({ questionId, selectedOption })
        ),
      });
      setQuizId(null);
      setQuestions([]);
      setAnswers({});
      refreshHistory();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 bg-background text-foreground">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Interview Preparation
        </h1>

        {/* Setup / Stats / Trend (hidden while an active quiz is shown) */}
        {questions.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Setup */}
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                  {/* Language */}
                  <div className="lg:col-span-4 flex flex-col space-y-1">
                    <label className="text-sm font-medium">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                        <SelectItem value="Java">Java</SelectItem>
                        <SelectItem value="C++">C++</SelectItem>
                        <SelectItem value="Go">Go</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Count */}
                  <div className="lg:col-span-2 flex flex-col space-y-1">
                    <label className="text-sm font-medium">Questions</label>
                    <Input
                      type="number"
                      min={5}
                      max={25}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      placeholder="5–25"
                      className="w-28 text-center" // 👈 keeps number centered & fixes width
                    />
                  </div>
                  {/* Add Domain */}
                  <div className="lg:col-span-12 flex gap-2 flex-col sm:flex-row">
                    <Input
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addDomain();
                        }
                      }}
                      placeholder="Add domain (e.g., Concurrency)"
                      aria-label="Add custom domain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addDomain}
                      disabled={!newDomain.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Errors */}
                {domainError && (
                  <div className="text-xs text-red-500">{domainError}</div>
                )}

                {/* Preset domains */}
                <div className="space-y-2">
                  <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
                    {[
                      "DSA",
                      "Web Development",
                      "System Design",
                      "Databases",
                      "OOP",
                      "Concurrency",
                    ].map((preset) => (
                      <Button
                        key={preset}
                        size="sm"
                        variant={
                          selectedDomains.includes(preset)
                            ? "default"
                            : "outline"
                        }
                        className="rounded-full whitespace-nowrap transition"
                        onClick={() =>
                          setSelectedDomains((prev) =>
                            prev.includes(preset)
                              ? prev.filter((p) => p !== preset)
                              : [...prev, preset]
                          )
                        }
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                  <div className="min-h-10 flex flex-wrap gap-2">
                    {selectedDomains.map((d) => (
                      <Badge
                        key={d}
                        variant="secondary"
                        onClick={() => removeDomain(d)}
                        className="cursor-pointer hover:bg-gray-200 transition"
                      >
                        {d} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Generate */}
                <div className="flex justify-end">
                  <Button
                    onClick={generateQuiz}
                    disabled={selectedDomains.length === 0}
                    className="w-full sm:w-auto"
                  >
                    Generate MCQs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Stat
                    label="Average Score"
                    value={`${analytics?.averageScore ?? 0}%`}
                  />
                  <Stat
                    label="Latest Score"
                    value={`${analytics?.latestScore ?? "-"}%`}
                  />
                  <Stat
                    label="Practised"
                    value={analytics?.questionsPractised ?? 0}
                  />
                  <Stat
                    label="Total Answered"
                    value={analytics?.totalQuestionsAnswered ?? 0}
                  />
                </div>
                {analytics?.aiInsights && (
                  <div className="mt-4 p-3 rounded-md bg-muted/40 text-sm max-h-48 overflow-auto">
                    <ReactMarkdown>{analytics.aiInsights}</ReactMarkdown>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-auto text-sm space-y-1">
                  {(analytics?.performanceTrend || []).map((p) => (
                    <div key={p.date} className="flex justify-between">
                      <span>{new Date(p.date).toLocaleDateString()}</span>
                      <span>{p.averageScore}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Section */}
        {questions.length > 0 && (
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <div className="font-medium wrap-break-word whitespace-pre-wrap">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <Button
                        key={opt}
                        variant={answers[q.id] === opt ? "default" : "outline"}
                        onClick={() => selectAnswer(q.id, opt)}
                        className="justify-start h-auto py-3 px-4 text-left wrap-break-word whitespace-normal"
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button disabled={!allAnswered || submitting} onClick={submit}>
                Submit
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Previous Quizzes (hidden while an active quiz is shown) */}
        {questions.length === 0 && (
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Previous Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">
                    Search
                  </label>
                  <Input
                    placeholder="Topic/domain contains..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">From</label>
                  <Input
                    type="date"
                    value={historyFrom}
                    onChange={(e) => setHistoryFrom(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">To</label>
                  <Input
                    type="date"
                    value={historyTo}
                    onChange={(e) => setHistoryTo(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">
                    Language
                  </label>
                  <Select value={historyLang} onValueChange={setHistoryLang}>
                    <SelectTrigger>
                      <SelectValue placeholder="All languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      {historyLanguages.map((lng) => (
                        <SelectItem key={lng} value={lng}>
                          {lng}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHistorySearch("");
                    setHistoryFrom("");
                    setHistoryTo("");
                    setHistoryLang("ALL");
                  }}
                >
                  Clear filters
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                {(history?.quizzes || [])
                  .filter((q) => {
                    // Date filter
                    const created = new Date(q.createdAt).getTime();
                    const fromOk = historyFrom
                      ? created >= new Date(historyFrom + "T00:00:00").getTime()
                      : true;
                    const toOk = historyTo
                      ? created <= new Date(historyTo + "T23:59:59").getTime()
                      : true;
                    if (!fromOk || !toOk) return false;
                    // Language filter
                    if (historyLang !== "ALL" && q.language !== historyLang)
                      return false;
                    // Text filter on domains/domain
                    const text = historySearch.trim().toLowerCase();
                    if (!text) return true;
                    const label = (
                      q.domains?.length ? q.domains.join(", ") : q.domain
                    )
                      .toString()
                      .toLowerCase();
                    return label.includes(text);
                  })
                  .map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-3 border rounded-md p-3 hover:bg-muted/30"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="font-medium truncate">
                          {q.language} •{" "}
                          {q.domains?.length ? q.domains.join(", ") : q.domain}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(q.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right w-14">
                          {q.results && q.results[0] ? (
                            <div>
                              {Math.round(
                                (q.results[0].score /
                                  q.results[0].totalQuestions) *
                                  100
                              )}
                              %
                            </div>
                          ) : (
                            <div>-</div>
                          )}
                        </div>
                        <PastQuizDialog
                          quizId={q.id}
                          title={`${q.language} • ${
                            q.domains?.length ? q.domains.join(", ") : q.domain
                          }`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function PastQuizDialog({ quizId, title }: { quizId: string; title: string }) {
  const { data, error, isLoading } = useSWR<{ quiz?: any }>(
    `/api/interview/quiz/${quizId}`,
    (u: string) => fetch(u).then((r) => r.json())
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isLoading && <div className="text-sm">Loading...</div>}
        {error && <div className="text-sm text-red-500">Failed to load</div>}
        {data?.quiz && (
          <div className="space-y-4">
            {(data.quiz.questions || []).map((q: any, idx: number) => {
              const latest = data.quiz.results?.[0];
              const selectedMap: Record<string, string> = Object.fromEntries(
                (latest?.answers || []).map((a: any) => [
                  a.questionId,
                  a.selectedOption,
                ])
              );
              const selected = selectedMap[q.id];
              return (
                <div key={q.id} className="space-y-2">
                  <div className="font-medium">
                    {idx + 1}. {q.question}
                  </div>
                  <ul className="list-disc pl-6 text-sm">
                    {(q.options || []).map((opt: string) => {
                      const isCorrect = opt === q.correctAnswer;
                      const isSelected = opt === selected;
                      return (
                        <li
                          key={opt}
                          className={
                            isCorrect
                              ? "text-green-600"
                              : isSelected
                              ? "text-red-600"
                              : ""
                          }
                        >
                          {opt}
                          {isCorrect && (
                            <span className="ml-2 text-xs">(correct)</span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="ml-2 text-xs">(your answer)</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {q.explanation && (
                    <div className="text-sm text-muted-foreground">
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
