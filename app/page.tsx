"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type TabKey = "home" | "learn" | "flash" | "quiz" | "docs";
type LearnKey = "vocab" | "grammar";

type VocabItem = {
  word: string;
  meaning: string;
};

type GrammarItem = {
  pattern: string;
  meaning: string;
};

type DocItem = {
  name: string;
  url: string;
};

const DEFAULT_VOCAB: VocabItem[] = [
  { word: "안녕하세요", meaning: "Xin chào" },
  { word: "감사합니다", meaning: "Cảm ơn" },
  { word: "학교", meaning: "Trường học" },
  { word: "학생", meaning: "Học sinh" },
  { word: "선생님", meaning: "Giáo viên" },
];

const DEFAULT_GRAMMAR: GrammarItem[] = [
  { pattern: "은/는", meaning: "Chủ đề của câu" },
  { pattern: "이/가", meaning: "Chủ ngữ" },
  { pattern: "을/를", meaning: "Tân ngữ" },
  { pattern: "입니다", meaning: "Là / là (trang trọng)" },
  { pattern: "있다 / 없다", meaning: "Có / Không có" },
];

export default function Page() {
  const [tab, setTab] = useState<TabKey>("home");
  const [learnTab, setLearnTab] = useState<LearnKey>("vocab");

  const [vocab, setVocab] = useState<VocabItem[]>(DEFAULT_VOCAB);
  const [grammar, setGrammar] = useState<GrammarItem[]>(DEFAULT_GRAMMAR);

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  const [grammarPattern, setGrammarPattern] = useState("");
  const [grammarMeaning, setGrammarMeaning] = useState("");

  const [docs, setDocs] = useState<DocItem[]>([]);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Load saved data
  useEffect(() => {
    const savedVocab = localStorage.getItem("ainoi_vocab");
    const savedGrammar = localStorage.getItem("ainoi_grammar");

    if (savedVocab) setVocab(JSON.parse(savedVocab));
    if (savedGrammar) setGrammar(JSON.parse(savedGrammar));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("ainoi_vocab", JSON.stringify(vocab));
  }, [vocab]);

  useEffect(() => {
    localStorage.setItem("ainoi_grammar", JSON.stringify(grammar));
  }, [grammar]);

  const tabs = [
    { key: "home" as const, label: "Trang chủ", icon: "🏠" },
    { key: "learn" as const, label: "Học tập", icon: "📚" },
    { key: "flash" as const, label: "Flashcard", icon: "🧠" },
    { key: "quiz" as const, label: "Quiz", icon: "🎯" },
    { key: "docs" as const, label: "Tài liệu", icon: "📂" },
  ];

  const stats = useMemo(
    () => [
      { label: "Từ vựng", value: vocab.length, icon: "📘" },
      { label: "Ngữ pháp", value: grammar.length, icon: "✏️" },
      { label: "Điểm quiz", value: score, icon: "⭐" },
    ],
    [vocab.length, grammar.length, score]
  );

  const addVocab = () => {
    if (!word.trim() || !meaning.trim()) return;

    setVocab([
      ...vocab,
      {
        word: word.trim(),
        meaning: meaning.trim(),
      },
    ]);

    setWord("");
    setMeaning("");
  };

  const addGrammar = () => {
    if (!grammarPattern.trim() || !grammarMeaning.trim()) return;

    setGrammar([
      ...grammar,
      {
        pattern: grammarPattern.trim(),
        meaning: grammarMeaning.trim(),
      },
    ]);

    setGrammarPattern("");
    setGrammarMeaning("");
  };

  const currentFlash = vocab[flashIndex];
  const currentQuiz = vocab[quizIndex];

  const getQuizOptions = () => {
    if (vocab.length < 3 || !currentQuiz) return [];

    const correct = currentQuiz.meaning;
    const wrongs = vocab
      .filter((_, i) => i !== quizIndex)
      .map((item) => item.meaning)
      .filter((item, index, arr) => arr.indexOf(item) === index)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return [correct, ...wrongs].sort(() => Math.random() - 0.5);
  };

  const handleQuizAnswer = (answer: string) => {
    if (!currentQuiz) return;

    if (answer === currentQuiz.meaning) {
      setScore((prev) => prev + 1);
      setQuizFeedback("✅ Chính xác!");
    } else {
      setQuizFeedback("❌ Chưa đúng, thử lại nhé!");
    }

    setTimeout(() => {
      setQuizFeedback(null);
      setQuizIndex((prev) => (prev + 1) % vocab.length);
    }, 900);
  };

  const handleUploadDocs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newDocs = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setDocs((prev) => [...prev, ...newDocs]);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.brand}>ai-noi-hoc-tieng-han-khong-kho 🌸</h1>
          <p style={styles.subtitle}>
            Website học tiếng Hàn riêng của bạn — có từ vựng, ngữ pháp, flashcard, quiz và tài liệu.
          </p>
        </div>

        <div style={styles.badge}>Beta</div>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <h2 style={styles.heroTitle}>Học tiếng Hàn theo cách dễ nhớ hơn.</h2>
          <p style={styles.heroText}>
            Tự thêm từ mới, ghi nhớ ngữ pháp, lật flashcard, làm quiz và lưu tài liệu học tập trong một nơi.
          </p>

          <div style={styles.heroActions}>
            <button style={styles.primaryButton} onClick={() => setTab("learn")}>
              Bắt đầu học
            </button>
            <button style={styles.secondaryButton} onClick={() => setTab("docs")}>
              Xem tài liệu
            </button>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardIcon}>🇰🇷</div>
            <h3 style={styles.heroCardTitle}>Hôm nay học gì?</h3>
            <p style={styles.heroCardText}>
              5 từ vựng mới + 2 mẫu ngữ pháp + 1 quiz ngắn.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.statsGrid}>
        {stats.map((item) => (
          <div key={item.label} style={styles.statCard}>
            <div style={styles.statIcon}>{item.icon}</div>
            <div>
              <div style={styles.statValue}>{item.value}</div>
              <div style={styles.statLabel}>{item.label}</div>
            </div>
          </div>
        ))}
      </section>

      <nav style={styles.nav}>
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            style={{
              ...styles.navButton,
              ...(tab === item.key ? styles.navButtonActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {tab === "home" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Chức năng chính</h3>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📖</div>
                <h4 style={styles.featureTitle}>Từ vựng</h4>
                <p style={styles.featureText}>
                  Thêm từ mới, lưu lại và học theo danh sách riêng của bạn.
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>✏️</div>
                <h4 style={styles.featureTitle}>Ngữ pháp</h4>
                <p style={styles.featureText}>
                  Ghi chú các mẫu câu và ngữ pháp quan trọng bằng tiếng Việt dễ hiểu.
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🃏</div>
                <h4 style={styles.featureTitle}>Flashcard</h4>
                <p style={styles.featureText}>
                  Lật thẻ nhanh để ghi nhớ từ vựng và nghĩa dễ dàng hơn.
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🎯</div>
                <h4 style={styles.featureTitle}>Quiz</h4>
                <p style={styles.featureText}>
                  Làm bài kiểm tra ngắn để ôn tập và kiểm tra trí nhớ.
                </p>
              </div>
            </div>
          </section>
        )}

        {tab === "learn" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Học tập</h3>

            <div style={styles.subNav}>
              <button
                onClick={() => setLearnTab("vocab")}
                style={{
                  ...styles.subButton,
                  ...(learnTab === "vocab" ? styles.subButtonActive : {}),
                }}
              >
                📖 Từ vựng
              </button>
              <button
                onClick={() => setLearnTab("grammar")}
                style={{
                  ...styles.subButton,
                  ...(learnTab === "grammar" ? styles.subButtonActive : {}),
                }}
              >
                ✏️ Ngữ pháp
              </button>
            </div>

            {learnTab === "vocab" && (
              <div style={styles.learnLayout}>
                <div style={styles.formCard}>
                  <h4 style={styles.contentTitle}>Thêm từ vựng</h4>

                  <input
                    placeholder="Ví dụ: 학교"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder="Ví dụ: Trường học"
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    style={styles.input}
                  />

                  <button onClick={addVocab} style={styles.primaryButton}>
                    ➕ Thêm từ
                  </button>
                </div>

                <div style={styles.listCard}>
                  <h4 style={styles.contentTitle}>Danh sách từ vựng</h4>

                  {vocab.length === 0 ? (
                    <p style={styles.emptyText}>Chưa có từ nào.</p>
                  ) : (
                    vocab.map((item, index) => (
                      <div key={`${item.word}-${index}`} style={styles.listItem}>
                        <div>
                          <div style={styles.listWord}>{item.word}</div>
                          <div style={styles.listMeaning}>{item.meaning}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {learnTab === "grammar" && (
              <div style={styles.learnLayout}>
                <div style={styles.formCard}>
                  <h4 style={styles.contentTitle}>Thêm ngữ pháp</h4>

                  <input
                    placeholder="Ví dụ: 은/는"
                    value={grammarPattern}
                    onChange={(e) => setGrammarPattern(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder="Ví dụ: Chủ đề của câu"
                    value={grammarMeaning}
                    onChange={(e) => setGrammarMeaning(e.target.value)}
                    style={styles.input}
                  />

                  <button onClick={addGrammar} style={styles.primaryButton}>
                    ➕ Thêm ngữ pháp
                  </button>
                </div>

                <div style={styles.listCard}>
                  <h4 style={styles.contentTitle}>Danh sách ngữ pháp</h4>

                  {grammar.length === 0 ? (
                    <p style={styles.emptyText}>Chưa có ngữ pháp nào.</p>
                  ) : (
                    grammar.map((item, index) => (
                      <div key={`${item.pattern}-${index}`} style={styles.listItem}>
                        <div>
                          <div style={styles.listWord}>{item.pattern}</div>
                          <div style={styles.listMeaning}>{item.meaning}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {tab === "flash" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Flashcard</h3>

            {vocab.length === 0 ? (
              <p style={styles.emptyText}>Chưa có từ nào để lật flashcard.</p>
            ) : (
              <div style={styles.flashCard} onClick={() => setFlip((prev) => !prev)}>
                <div style={styles.flashHint}>Bấm để lật thẻ</div>
                <div style={styles.flashContent}>
                  {flip ? currentFlash?.meaning : currentFlash?.word}
                </div>

                <div style={styles.flashActions}>
                  <button
                    style={styles.secondaryButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlashIndex((prev) => (prev + 1) % vocab.length);
                      setFlip(false);
                    }}
                  >
                    Từ tiếp theo
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {tab === "quiz" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Quiz</h3>

            {vocab.length < 3 || !currentQuiz ? (
              <p style={styles.emptyText}>Thêm ít nhất 3 từ để bắt đầu quiz.</p>
            ) : (
              <div style={styles.quizCard}>
                <div style={styles.quizQuestion}>{currentQuiz.word}</div>

                <div style={styles.quizOptions}>
                  {getQuizOptions().map((option, index) => (
                    <button
                      key={`${option}-${index}`}
                      onClick={() => handleQuizAnswer(option)}
                      style={styles.quizOption}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {quizFeedback && <div style={styles.quizFeedback}>{quizFeedback}</div>}
                <div style={styles.quizScore}>Điểm hiện tại: {score}</div>
              </div>
            )}
          </section>
        )}

        {tab === "docs" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Tài liệu</h3>

            <div style={styles.formCard}>
              <h4 style={styles.contentTitle}>Tải tài liệu lên</h4>
              <input type="file" multiple onChange={handleUploadDocs} style={styles.fileInput} />
              <p style={styles.helperText}>
                Có thể upload PDF, ảnh hoặc file tài liệu học tập.
              </p>
            </div>

            <div style={styles.listCard}>
              <h4 style={styles.contentTitle}>Danh sách tài liệu</h4>

              {docs.length === 0 ? (
                <p style={styles.emptyText}>Chưa có tài liệu nào.</p>
              ) : (
                docs.map((doc, index) => (
                  <div key={`${doc.name}-${index}`} style={styles.docItem}>
                    <span>📄 {doc.name}</span>
                    <a href={doc.url} target="_blank" rel="noreferrer" style={styles.docLink}>
                      Mở
                    </a>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f7fff7 0%, #ffffff 40%, #f5f7fb 100%)",
    color: "#1f2937",
    padding: "24px",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "28px",
  },

  brand: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#16a34a",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "720px",
  },

  badge: {
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "20px",
    alignItems: "stretch",
    marginBottom: "24px",
  },

  heroLeft: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
    border: "1px solid #eef2f7",
  },

  heroRight: {
    display: "flex",
  },

  heroCard: {
    width: "100%",
    background: "linear-gradient(135deg, #dcfce7, #f0fdf4)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(22, 163, 74, 0.10)",
    border: "1px solid #bbf7d0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heroCardIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },

  heroCardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#14532d",
  },

  heroCardText: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#166534",
    lineHeight: 1.7,
  },

  heroTitle: {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.2,
    fontWeight: 900,
    color: "#111827",
    letterSpacing: "-0.03em",
  },

  heroText: {
    marginTop: "14px",
    marginBottom: "20px",
    fontSize: "16px",
    lineHeight: 1.8,
    color: "#6b7280",
    maxWidth: "620px",
  },

  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  primaryButton: {
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(34, 197, 94, 0.22)",
  },

  secondaryButton: {
    background: "white",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginBottom: "20px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    border: "1px solid #eef2f7",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  statIcon: {
    fontSize: "24px",
  },

  statValue: {
    fontSize: "20px",
    fontWeight: 900,
    color: "#111827",
  },

  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },

  nav: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginBottom: "24px",
    background: "#ffffff",
    padding: "10px",
    borderRadius: "18px",
    border: "1px solid #eef2f7",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  navButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    border: "none",
    background: "transparent",
    color: "#6b7280",
    fontWeight: 700,
    padding: "10px 8px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "13px",
  },

  navButtonActive: {
    background: "#dcfce7",
    color: "#166534",
  },

  navIcon: {
    fontSize: "18px",
  },

  main: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  section: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    border: "1px solid #eef2f7",
  },

  sectionTitle: {
    margin: 0,
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#111827",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },

  featureCard: {
    background: "#f9fafb",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #eef2f7",
  },

  featureIcon: {
    fontSize: "26px",
    marginBottom: "10px",
  },

  featureTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
  },

  featureText: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#6b7280",
    lineHeight: 1.7,
    fontSize: "14px",
  },

  subNav: {
    display: "flex",
    gap: "10px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  subButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    borderRadius: "14px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },

  subButtonActive: {
    background: "#dcfce7",
    color: "#166534",
    borderColor: "#bbf7d0",
  },

  learnLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  formCard: {
    background: "#f9fafb",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #eef2f7",
  },

  listCard: {
    background: "#f9fafb",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #eef2f7",
  },

  contentTitle: {
    margin: 0,
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
  },

  input: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "12px 14px",
    marginBottom: "10px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
  },

  emptyText: {
    color: "#6b7280",
    margin: 0,
  },

  listItem: {
    background: "#ffffff",
    border: "1px solid #eef2f7",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "10px",
  },

  listWord: {
    fontWeight: 800,
    fontSize: "16px",
    color: "#111827",
  },

  listMeaning: {
    marginTop: "4px",
    color: "#6b7280",
    fontSize: "14px",
  },

  flashCard: {
    background: "linear-gradient(135deg, #ecfdf5, #ffffff)",
    border: "1px solid #bbf7d0",
    borderRadius: "24px",
    padding: "32px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(22, 163, 74, 0.10)",
  },

  flashHint: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "16px",
  },

  flashContent: {
    fontSize: "34px",
    fontWeight: 900,
    color: "#111827",
    minHeight: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flashActions: {
    marginTop: "20px",
  },

  quizCard: {
    background: "#f9fafb",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #eef2f7",
  },

  quizQuestion: {
    fontSize: "26px",
    fontWeight: 900,
    color: "#111827",
    textAlign: "center",
    marginBottom: "18px",
  },

  quizOptions: {
    display: "grid",
    gap: "10px",
  },

  quizOption: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
  },

  quizFeedback: {
    marginTop: "14px",
    fontWeight: 800,
    color: "#166534",
    textAlign: "center",
  },

  quizScore: {
    marginTop: "10px",
    color: "#6b7280",
    textAlign: "center",
  },

  fileInput: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
  },

  helperText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  docItem: {
    background: "#ffffff",
    border: "1px solid #eef2f7",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  docLink: {
    color: "#16a34a",
    fontWeight: 700,
    textDecoration: "none",
  },
};
