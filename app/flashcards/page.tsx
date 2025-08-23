"use client";
import React, { useState } from 'react';
import { FlashcardDeck, FlashcardInput } from '../../components/flashcards';

export default function FlashcardsPage() {
  const [inputType, setInputType] = useState<'pdf' | 'text' | 'youtube'>('text');
  const [deck, setDeck] = useState<any[]>([]);
  const [aiResult, setAiResult] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAI(task: 'summary' | 'mindmap' | 'roadmap') {
    setAiLoading(true);
    setAiResult('');
    // For demo, use text input only
    const input = document.querySelector('textarea')?.value || '';
    if (!input) {
      setAiResult('Please enter some text for AI processing.');
      setAiLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/resource-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: 'demo', task, input })
      });
      const data = await res.json();
      setAiResult(data.summary || data.answer || data.mindmap || 'No result');
    } catch (err) {
      setAiResult('Error fetching AI result.');
    }
    setAiLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">AI Flashcard Generator</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setInputType('pdf')} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">PDF</button>
        <button onClick={() => setInputType('text')} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Text</button>
        <button onClick={() => setInputType('youtube')} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">YouTube</button>
      </div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => handleAI('summary')} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">AI Summarize</button>
        <button onClick={() => handleAI('mindmap')} className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">Mind Map</button>
        <button onClick={() => handleAI('roadmap')} className="px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600">Road Map</button>
      </div>
      {aiLoading && <div className="mb-2 text-gray-500">Loading AI result...</div>}
      {aiResult && <div className="mb-4 p-3 border rounded bg-gray-50"><strong>AI Result:</strong> <pre>{aiResult}</pre></div>}
      <FlashcardInput type={inputType} onDeckGenerated={setDeck} />
      <FlashcardDeck deck={deck} />
    </div>
  );
}
