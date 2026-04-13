function truncateText(text, maxLength) {
  const value = String(text || '');

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function HistoryPanel({ history = [], onSelect, isDark = false }) {
  const recentQuestions = [...history].slice(-5).reverse();

  const cardStyles = {
    backgroundColor: isDark ? '#161b22' : '#ffffff',
    borderColor: isDark ? '#21262d' : '#e2e8e2',
    color: isDark ? '#e6edf3' : '#111827',
  };

  const itemBaseClasses = isDark
    ? 'border-[#21262d] bg-[#161b22] hover:bg-[#0d2818] focus-visible:bg-[#0d2818]'
    : 'border-[#e2e8e2] bg-white hover:bg-[#f0fdf4] focus-visible:bg-[#f0fdf4]';

  return (
    <aside
      className="w-full max-w-2xl rounded-2xl border p-4 shadow-sm"
      style={cardStyles}
    >
      <div className="mb-4 flex items-center gap-2 text-[#1b4332]" style={isDark ? { color: '#1b4332' } : undefined}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h2 className="text-sm font-semibold" style={{ color: '#1b4332' }}>
          Recent questions
        </h2>
      </div>

      {recentQuestions.length === 0 ? (
        <p className="text-sm text-slate-500">No questions asked yet</p>
      ) : (
        <div className="space-y-3">
          {recentQuestions.map((item, index) => (
            <button
              key={`${item.question}-${index}`}
              type="button"
              onClick={() => onSelect(item.question)}
              className={`w-full rounded-2xl border p-4 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] focus-visible:ring-offset-2 ${itemBaseClasses}`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white">
                  ?
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-6" style={{ color: isDark ? '#e6edf3' : '#111827' }}>
                    {truncateText(item.question, 60)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {truncateText(item.answer, 80)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

export default HistoryPanel;