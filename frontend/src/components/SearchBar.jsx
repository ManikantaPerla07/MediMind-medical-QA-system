import { useState } from 'react';

function SearchBar({ onSubmit, isLoading, isDark }) {
  const [question, setQuestion] = useState('');

  const trimmedQuestion = question.trim();
  const canSend = Boolean(trimmedQuestion) && !isLoading;

  const handleSubmit = () => {
    if (!canSend) {
      return;
    }

    onSubmit(trimmedQuestion);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleSubmit();
  };

  const cardClasses = isDark
    ? 'border-[#21262d] bg-[#161b22] text-slate-100'
    : 'border-[#e2e8e2] bg-white text-slate-900';

  const labelClasses = isDark ? 'text-[#74c69d]' : 'text-[#1b4332]';

  return (
    <section
      className={`w-full max-w-2xl rounded-2xl border p-5 shadow-sm transition focus-within:border-[#1b4332] focus-within:ring-2 focus-within:ring-[#1b4332]/20 ${cardClasses}`}
    >
      <label htmlFor="medical-question" className={`mb-3 block text-sm font-semibold ${labelClasses}`}>
        Ask a medical question
      </label>

      <textarea
        id="medical-question"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Ask a medical question... (Enter to send)"
        className={`w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 ${isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900'}`}
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="Send question"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1b4332] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.25]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h12m0 0-5-5m5 5-5 5" />
          </svg>
        </button>

        <p className="flex-1 text-center text-xs text-slate-500">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </section>
  );
}

export default SearchBar;