import React, { useState } from 'react';

export function FlashcardInput({ type, onDeckGenerated }: { type: 'pdf' | 'text' | 'youtube', onDeckGenerated: (deck: any[]) => void }) {
  const [input, setInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  const data: any = {};
    if (type === 'pdf' && file) {
      data.fileName = file.name;
    } else {
      data.input = input;
    }
    data.type = type;
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      onDeckGenerated(result.deck || []);
    } catch (err) {
      onDeckGenerated([
        { term: 'Error', definition: 'Could not generate flashcards.' }
      ]);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white shadow">
      {type === 'pdf' ? (
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      ) : type === 'youtube' ? (
        <input type="url" placeholder="Paste YouTube link" value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded" />
      ) : (
        <textarea placeholder="Paste or write your notes here" value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded" rows={5} />
      )}
      <button type="submit" disabled={loading || (type !== 'pdf' && !input) || (type === 'pdf' && !file)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>
    </form>
  );
}

export function FlashcardDeck({ deck }: { deck: any[] }) {
  const [cards, setCards] = useState(deck);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTerm, setEditTerm] = useState('');
  const [editDef, setEditDef] = useState('');

  // Spaced repetition: next review date (simple demo)
  function getNextReview(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString();
  }

  function handleEdit(idx: number) {
    setEditIdx(idx);
    setEditTerm(cards[idx].term);
    setEditDef(cards[idx].definition);
  }

  function handleSave(idx: number) {
    const updated = [...cards];
    updated[idx] = { ...updated[idx], term: editTerm, definition: editDef };
    setCards(updated);
    setEditIdx(null);
  }

  function handleExportTxt() {
    const txt = cards.map(c => `${c.term}\t${c.definition}`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportApkg() {
    alert('Anki .apkg export coming soon!');
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Your Flashcards</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={handleExportTxt} className="px-3 py-1 bg-green-600 text-white rounded">Export .txt</button>
        <button onClick={handleExportApkg} className="px-3 py-1 bg-purple-600 text-white rounded">Export .apkg</button>
      </div>
      {cards.length === 0 ? (
        <div className="text-gray-500">No flashcards generated yet.</div>
      ) : (
        <ul className="space-y-2">
          {cards.map((card, idx) => (
            <li key={idx} className="p-3 border rounded bg-gray-50 flex flex-col gap-2">
              {editIdx === idx ? (
                <>
                  <input value={editTerm} onChange={e => setEditTerm(e.target.value)} className="border rounded px-2 py-1" />
                  <input value={editDef} onChange={e => setEditDef(e.target.value)} className="border rounded px-2 py-1" />
                  <button onClick={() => handleSave(idx)} className="px-2 py-1 bg-blue-500 text-white rounded">Save</button>
                </>
              ) : (
                <>
                  <div><strong>{card.term}</strong>: {card.definition}</div>
                  <div className="text-xs text-gray-500">Next review: {getNextReview(idx + 1)}</div>
                  <button onClick={() => handleEdit(idx)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
