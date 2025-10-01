"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateContent } from "@/lib/gemini-rest";
import { Input } from "@/components/ui/input";

export default function GeminiTestPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRun() {
    setLoading(true);
    setOutput("");
    setError(null);
    try {
      const text = await generateContent(prompt, {
        model: model || undefined,
        baseUrl: baseUrl || undefined,
      });
      setOutput(text);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 bg-background text-foreground">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Gemini REST Test (gemini-2.0-flash)</h1>
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Custom model (optional), e.g. gemini-2.0-flash" />
              <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="Custom base URL (optional)" />
            </div>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} placeholder="Type a prompt..." />
            <Button onClick={onRun} disabled={loading || !prompt.trim()}>
              {loading ? "Running..." : "Run"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm">{output}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


