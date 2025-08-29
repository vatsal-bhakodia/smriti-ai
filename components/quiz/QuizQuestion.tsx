type Props = {
  question: string;
  options: string[];
  selected: string | null;
  setSelected: (value: string) => void;
  questionNumber?: number;
  totalQuestions?: number;
};

export default function QuizQuestion({
  question,
  options,
  selected,
  setSelected,
  questionNumber,
  totalQuestions,
}: Props) {
  const questionId = `question-${questionNumber || 'current'}`;
  const fieldsetId = `options-${questionNumber || 'current'}`;

  return (
    <div role="group" aria-labelledby={questionId}>
      <h2 id={questionId} className="text-xl font-semibold mb-4">
        {questionNumber && totalQuestions
          ? `Question ${questionNumber} of ${totalQuestions}: ${question}`
          : question}
      </h2>

      <fieldset className="space-y-3" aria-labelledby={questionId}>
        <legend className="sr-only">
          Select your answer for: {question}
        </legend>

        {options.map((opt, index) => {
          const optionId = `${fieldsetId}-option-${index}`;
          const isSelected = selected === opt;

          return (
            <label
              key={opt}
              htmlFor={optionId}
              className={`block p-3 rounded cursor-pointer border transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                isSelected
                  ? "bg-lime-400 text-black font-bold border-lime-500 ring-2 ring-lime-500"
                  : "border-white/10 bg-zinc-800 hover:bg-zinc-700 hover:border-white/20"
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={`quiz-question-${questionNumber || 'current'}`}
                value={opt}
                checked={isSelected}
                onChange={() => setSelected(opt)}
                className="sr-only"
                aria-describedby={`${optionId}-status`}
              />
              <div className="flex items-center justify-between">
                <span className="flex-1">{opt}</span>
                {isSelected && (
                  <span className="ml-2 text-sm font-medium" aria-hidden="true">
                    ✓
                  </span>
                )}
              </div>
              <span id={`${optionId}-status`} className="sr-only">
                {isSelected ? "Selected answer" : "Not selected"}
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}