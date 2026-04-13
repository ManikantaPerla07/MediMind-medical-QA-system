import { useEffect, useRef, useState } from 'react';
import { askQuestion, checkHealth } from './api/qaApi';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [isDark, setIsDark] = useState(false);
  const [passageCount, setPassageCount] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hoveredHistoryIndex, setHoveredHistoryIndex] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const verifyHealth = async () => {
      const data = await checkHealth();

      if (!isMounted) {
        return;
      }

      if (data) {
        setApiStatus('online');
        setPassageCount(Number(data.passages) || 0);
      } else {
        setApiStatus('offline');
      }
    };

    verifyHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [result, isLoading, history]);

  const handleSubmit = async (question) => {
    const trimmedQuestion = String(question || '').trim();

    if (!trimmedQuestion) {
      return;
    }

    setCurrentQuestion(question);
    setIsLoading(true);
    setError(null);

    try {
      const data = await askQuestion(trimmedQuestion);
      setHistory((previousHistory) => [
        ...previousHistory,
        {
          question: trimmedQuestion,
          answer: data.final_answer,
          type: data.question_type,
          conf: Math.round(data.confidence * 100),
          confidence: data.confidence,
          extracted_span: data.extracted_span,
          source: data.source,
          low_confidence: data.low_confidence,
        },
      ]);
      setResult(data);
      setInputValue('');
    } catch (requestError) {
      setError(requestError?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPalette = {
    appBg: isDark ? '#0d1117' : '#f4f7f4',
    sidebarBg: isDark ? '#0a1628' : '#1b4332',
    sidebarBorder: isDark ? '#21262d' : 'transparent',
    topbarBg: isDark ? '#161b22' : '#ffffff',
    topbarBorder: isDark ? '#21262d' : '#e2e8e2',
    chatBg: isDark ? '#0d1117' : '#f4f7f4',
    inputAreaBg: isDark ? '#161b22' : '#ffffff',
    inputAreaBorder: isDark ? '#21262d' : '#e2e8e2',
    inputWrapBg: isDark ? '#0d1117' : '#f9faf9',
    inputWrapBorder: isDark ? '#30363d' : '#d1d5db',
    welcomeTitle: isDark ? '#74c69d' : '#1b4332',
    welcomeText: isDark ? '#8b949e' : '#6b7280',
    chipBg: isDark ? '#0d2818' : '#ffffff',
    chipBorder: isDark ? '#1b4332' : '#d1fae5',
    chipText: isDark ? '#6ee7b7' : '#065f46',
    userBubbleBg: '#1b4332',
    userBubbleText: isDark ? '#d1fae5' : '#ffffff',
    aiBubbleBg: isDark ? '#161b22' : '#ffffff',
    aiBubbleBorder: isDark ? '#21262d' : '#e2e8e2',
    answerText: isDark ? '#c9d1d9' : '#1f2937',
    topbarTitle: isDark ? '#74c69d' : '#1b4332',
    topbarSub: isDark ? '#8b949e' : '#6b7280',
    statTagBg: isDark ? '#0d2818' : '#f0fdf4',
    statTagText: isDark ? '#4ade80' : '#166534',
    modeBtnBg: isDark ? '#21262d' : '#ffffff',
    modeBtnBorder: isDark ? '#30363d' : '#d1d5db',
    confBg: isDark ? '#21262d' : '#f3f4f6',
    sourceBg: isDark ? '#0d2818' : '#f0fdf4',
    sourceText: isDark ? '#8b949e' : '#6b7280',
    loadingText: isDark ? '#6ee7b7' : '#40916c',
    dots: isDark ? '#6ee7b7' : '#40916c',
  };

  const typeBadgeStyles = {
    factoid: { background: '#d1fae5', color: '#065f46' },
    list: { background: '#dbeafe', color: '#1d4ed8' },
    how: { background: '#ede9fe', color: '#5b21b6' },
    yes_no: { background: '#fef3c7', color: '#92400e' },
    comparison: { background: '#fce7f3', color: '#9d174d' },
    abstained: { background: '#fee2e2', color: '#991b1b' },
    general: { background: '#f3f4f6', color: '#374151' },
  };

  const statusDotColor =
    apiStatus === 'online' ? '#4ade80' : apiStatus === 'offline' ? '#ef4444' : '#facc15';

  const prompts = [
    { label: 'Symptoms', value: 'What are the symptoms of diabetes?' },
    { label: 'How it works', value: 'How does diabetes affect the body?' },
    { label: 'Treatment', value: 'What are the treatment options for diabetes?' },
    { label: 'Compare', value: 'Compare type 1 diabetes and type 2 diabetes.' },
    { label: 'Yes/No', value: 'Is diabetes reversible?' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: currentPalette.appBg,
        fontSize: '15px',
      }}
    >
      <aside
        style={{
          width: '260px',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 10px',
          flexShrink: 0,
          background: currentPalette.sidebarBg,
          borderRight: isDark ? `1px solid ${currentPalette.sidebarBorder}` : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '6px 6px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDark ? '#1b4332' : '#40916c',
              border: isDark ? '1px solid #40916c' : 'none',
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff' }}>
            Medi<span style={{ color: '#74c69d' }}>Mind</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setResult(null);
            setError(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '10px 14px',
            borderRadius: '9px',
            border: '1px solid rgba(116,198,157,0.3)',
            background: 'rgba(116,198,157,0.08)',
            color: '#74c69d',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '18px',
            width: '100%',
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
          New question
        </button>

        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '7px',
            padding: '0 4px',
          }}
        >
          Recent
        </div>

        <div style={{ overflowY: 'auto' }}>
          {[...history].reverse().map((item, index) => (
            <div
              key={`${item.question}-${index}`}
              onClick={() => handleSubmit(item.question)}
              onMouseEnter={() => setHoveredHistoryIndex(index)}
              onMouseLeave={() => setHoveredHistoryIndex(null)}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                marginBottom: '2px',
                cursor: 'pointer',
                background: hoveredHistoryIndex === index ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.question}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>
                {(item.type || 'general').toUpperCase()} · {item.conf || 0}%
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: statusDotColor,
              }}
            />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              {apiStatus} · {passageCount} passages
            </span>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderBottom: `1px solid ${currentPalette.topbarBorder}`,
            background: currentPalette.topbarBg,
          }}
        >
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: currentPalette.topbarTitle }}>MediMind</div>
            <div style={{ fontSize: '12px', color: currentPalette.topbarSub }}>
              Medical Question Answering System
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '4px 11px',
                borderRadius: '20px',
                fontSize: '12px',
                background: currentPalette.statTagBg,
                color: currentPalette.statTagText,
              }}
            >
              16K+ passages
            </span>
            <span
              style={{
                padding: '4px 11px',
                borderRadius: '20px',
                fontSize: '12px',
                background: currentPalette.statTagBg,
                color: currentPalette.statTagText,
              }}
            >
              No external APIs
            </span>
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                border: isDark ? '1px solid #40916c' : '1px solid #d1d5db',
                background: isDark ? '#0d2818' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDark ? '#74c69d' : '#1b4332',
              }}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v3M12 19.5v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1.5 12h3M19.5 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: currentPalette.chatBg,
          }}
        >
          {history.length === 0 && !isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeIn 0.5s ease' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  background: isDark ? '#0d2818' : '#1b4332',
                  border: '1px solid #40916c',
                  margin: '0 auto 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: currentPalette.welcomeTitle,
                  marginBottom: '5px',
                }}
              >
                Welcome to MediMind
              </div>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: currentPalette.welcomeText,
                  marginBottom: '18px',
                }}
              >
                Ask a medical question and receive answers grounded in medical literature.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', justifyContent: 'center' }}>
                {prompts.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSubmit(item.value)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: currentPalette.chipBg,
                      border: `1px solid ${currentPalette.chipBorder}`,
                      color: currentPalette.chipText,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {history.map((item, index) => {
            const typeKey = item.type || 'general';
            const typeStyle = typeBadgeStyles[typeKey] || typeBadgeStyles.general;

            return (
              <div key={`${item.question}-${index}`}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    animation: 'fadeIn 0.3s ease',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      background: currentPalette.userBubbleBg,
                      color: currentPalette.userBubbleText,
                      borderRadius: '18px 18px 4px 18px',
                      padding: '11px 16px',
                      maxWidth: '72%',
                      fontSize: '14px',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.question}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: isDark ? '#0d2818' : '#1b4332',
                      border: '1px solid #40916c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>

                  <div
                    style={{
                      background: currentPalette.aiBubbleBg,
                      border: `1px solid ${currentPalette.aiBubbleBorder}`,
                      borderRadius: '4px 18px 18px 18px',
                      padding: '15px 17px',
                      flex: 1,
                      maxWidth: '82%',
                      fontSize: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '999px',
                          padding: '3px 10px',
                          background: typeStyle.background,
                          color: typeStyle.color,
                          textTransform: 'uppercase',
                        }}
                      >
                        {typeKey}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '999px',
                          padding: '3px 10px',
                          background: currentPalette.confBg,
                          color: currentPalette.answerText,
                        }}
                      >
                        {item.conf || 0}%
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.8,
                        color: currentPalette.answerText,
                        marginBottom: '10px',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.answer || 'No answer available.'}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '10px',
                          color: currentPalette.sourceText,
                          marginBottom: '4px',
                        }}
                      >
                        <span>Confidence</span>
                        <span>{item.conf || 0}%</span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: '999px',
                          background: currentPalette.confBg,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(item.conf || 0, 3)}%`,
                            minWidth: '6px',
                            height: '100%',
                            background: 'linear-gradient(90deg,#1b4332,#40916c)',
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        background: currentPalette.sourceBg,
                        color: currentPalette.sourceText,
                        borderRadius: '8px',
                        fontSize: '11px',
                        padding: '8px 12px',
                        lineHeight: 1.55,
                      }}
                    >
                      Key extract: {item.extracted_span || 'Not available'} · Source: {item.source || 'Not available'}
                    </div>

                    {item.very_low_confidence ? (
                      <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 12,
                        color: '#991b1b',
                        marginTop: 10
                      }}>
                        Very low confidence — I could not find reliable 
                        medical information. Try rephrasing your question.
                      </div>
                    ) : item.low_confidence ? (
                      <div style={{
                        background: '#fefce8',
                        border: '1px solid #fde68a',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 12,
                        color: '#92400e',
                        marginTop: 10
                      }}>
                        Moderate confidence — Please verify with a 
                        medical professional.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                <div
                  style={{
                    background: currentPalette.userBubbleBg,
                    color: currentPalette.userBubbleText,
                    borderRadius: '18px 18px 4px 18px',
                    padding: '11px 16px',
                    maxWidth: '72%',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {currentQuestion}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: isDark ? '#0d2818' : '#1b4332',
                    border: '1px solid #40916c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'blink 1s infinite',
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>

                <div
                  style={{
                    background: currentPalette.aiBubbleBg,
                    border: `1px solid ${currentPalette.aiBubbleBorder}`,
                    borderRadius: '4px 18px 18px 18px',
                    padding: '15px 17px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: currentPalette.dots,
                        animation: 'dotBounce 1.2s infinite',
                      }}
                    />
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: currentPalette.dots,
                        animation: 'dotBounce 1.2s infinite 0.2s',
                      }}
                    />
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: currentPalette.dots,
                        animation: 'dotBounce 1.2s infinite 0.4s',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '13px', color: currentPalette.loadingText }}>
                    Extracting information from medical literature...
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '12px',
              }}
            >
              {error}
            </div>
          ) : null}

          <div ref={chatEndRef} />
        </div>

        <div
          style={{
            background: currentPalette.inputAreaBg,
            borderTop: `1px solid ${currentPalette.inputAreaBorder}`,
            padding: '16px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end',
              borderRadius: '14px',
              padding: '10px 12px',
              border: `1.5px solid ${inputFocused ? '#40916c' : currentPalette.inputWrapBorder}`,
              background: currentPalette.inputWrapBg,
            }}
          >
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit(inputValue);
                }
              }}
              rows={2}
              placeholder="Ask a medical question..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                height: '42px',
                lineHeight: 1.5,
                color: currentPalette.answerText,
              }}
            />
            <button
              type="button"
              onClick={() => handleSubmit(inputValue)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                border: isDark ? '1px solid #40916c' : 'none',
                background: '#1b4332',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="white" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h12m0 0-5-5m5 5-5 5" />
              </svg>
            </button>
          </div>
          <div
            style={{
              fontSize: '11px',
              marginTop: '6px',
              textAlign: 'center',
              color: isDark ? '#6e7681' : '#9ca3af',
            }}
          >
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;