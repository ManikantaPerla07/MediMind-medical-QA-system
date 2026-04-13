function normalizeConfidence(confidence) {
  const numericConfidence = Number(confidence);

  if (!Number.isFinite(numericConfidence)) {
    return 0;
  }

  return Math.min(1, Math.max(0, numericConfidence));
}

function getQuestionTypeStyles(questionType) {
  switch (questionType) {
    case 'factoid':
      return { backgroundColor: '#d1fae5', color: '#065f46' };
    case 'list':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    case 'how':
      return { backgroundColor: '#ede9fe', color: '#5b21b6' };
    case 'yes_no':
      return { backgroundColor: '#fef3c7', color: '#92400e' };
    case 'comparison':
      return { backgroundColor: '#fce7f3', color: '#9d174d' };
    case 'abstained':
      return { backgroundColor: '#fee2e2', color: '#991b1b' };
    case 'general':
    default:
      return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
}

function AnswerCard({ result, isDark = false }) {
  const confidenceValue = normalizeConfidence(result?.confidence);
  const confidencePercentage = Math.round(confidenceValue * 100);
  const questionType = result?.question_type || 'general';
  const badgeStyles = getQuestionTypeStyles(questionType);
  const finalAnswer = String(result?.final_answer || '');
  const hasNoReliableEvidence = finalAnswer.toUpperCase().includes('NO RELIABLE EVIDENCE');
  const showLowConfidenceBanner = Boolean(result?.low_confidence) && !hasNoReliableEvidence;

  const cardStyles = {
    backgroundColor: isDark ? '#161b22' : '#ffffff',
    borderColor: isDark ? '#21262d' : '#e2e8e2',
    color: isDark ? '#e6edf3' : '#111827',
  };

  const sourceBoxStyles = {
    backgroundColor: isDark ? '#0d2818' : '#f0fdf4',
  };

  const sourceSpanStyles = {
    color: '#40916c',
  };

  return (
    <section
      className="w-full max-w-3xl rounded-2xl border p-5 shadow-sm"
      style={cardStyles}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={badgeStyles}
        >
          {questionType}
        </span>

        <span className="text-sm font-semibold" style={{ color: '#1b4332' }}>
          {confidencePercentage}%
        </span>
      </div>

      {hasNoReliableEvidence ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          No reliable evidence found — please verify with a medical professional
        </div>
      ) : showLowConfidenceBanner ? (
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-900">
          Low confidence — verify with a medical professional
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            ANSWER
          </h2>
          <p className="text-sm leading-7" style={{ color: isDark ? '#e6edf3' : '#111827' }}>
            {result?.final_answer || 'No answer available.'}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm font-medium" style={{ color: isDark ? '#c9d1d9' : '#4b5563' }}>
            <span>Confidence</span>
            <span>{confidencePercentage}%</span>
          </div>
          <div
            className="h-[5px] overflow-hidden rounded-full"
            style={{ backgroundColor: isDark ? '#21262d' : '#e5ebe6' }}
            role="progressbar"
            aria-valuenow={confidencePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Confidence"
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${confidencePercentage}%`,
                backgroundImage: 'linear-gradient(90deg, #1b4332 0%, #40916c 100%)',
              }}
            />
          </div>
        </div>

        <div className="rounded-xl px-4 py-2.5" style={sourceBoxStyles}>
          <p className="text-sm leading-7" style={{ color: isDark ? '#d1fae5' : '#111827' }}>
            Key extract:{' '}
            <span style={sourceSpanStyles}>{result?.extracted_span || 'No extracted span available'}</span>{' '}
            · Source: <span style={sourceSpanStyles}>{result?.source || 'Source unavailable'}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default AnswerCard;