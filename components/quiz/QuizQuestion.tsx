type Props = {
    question: string;
    options: string[];
    selected: string | null;
    setSelected: (value: string) => void;
  };
  
  export default function QuizQuestion({
    question,
    options,
    selected,
    setSelected,
  }: Props) {
  return (
  <div>
    <h2 className="text-xl font-semibold mb-4 light:text-gray-900">{question}</h2>
    <div className="space-y-3">
      {options.map((opt) => (
        <div
          key={opt}
          onClick={() => setSelected(opt)}
          className={`p-3 rounded cursor-pointer border transition-colors ${
            selected === opt
              ? "bg-lime-400 text-black font-bold light:bg-lime-300"
              : "border-white/10 bg-zinc-800 hover:bg-zinc-700 light:border-gray-200 light:bg-white/80 light:hover:bg-white/90 light:text-gray-900"
          }`}
        >
          {opt}
        </div>
      ))}
    </div>
  </div>
);

  }
  