"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type TabKey = "home" | "learn" | "flash" | "quiz" | "docs";
type LearnKey = "vocab" | "grammar";
type LangKey = "vi" | "en";

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

const texts = {
  vi: {
    title: "ai-noi-hoc-tieng-han-khong-kho",
    subtitle:
      "Học tiếng Hàn dễ như chơi — từ vựng, ngữ pháp, flashcard, quiz và tài liệu trong một nơi.",
    beta: "Beta",
    heroTag: "✨ Học theo cách đơn giản, đẹp và dễ nhớ",
    heroTitle: "Bắt đầu học tiếng Hàn theo nhịp riêng của bạn.",
    heroText:
      "Bạn có thể tự thêm từ mới, ghi chú ngữ pháp, lật flashcard, làm quiz và lưu tài liệu học tập ngay trong app.",
    start: "Bắt đầu học",
    docs: "Xem tài liệu",
    todayTitle: "Hôm nay học gì?",
    todayText: "5 từ vựng mới + 2 mẫu ngữ pháp + 1 quiz ngắn.",
    todayProgress: "Tiến độ hôm nay",
    home: "Trang chủ",
    learn: "Học tập",
    flash: "Flashcard",
    quiz: "Quiz",
    docsTab: "Tài liệu",
    mainTitle: "Chức năng chính",
    vocabTitle: "Từ vựng",
    grammarTitle: "Ngữ pháp",
    flashTitle: "Flashcard",
    quizTitle: "Quiz",
    docsTitle: "Tài liệu",
    learnTitle: "Học tập",
    addVocab: "Thêm từ vựng",
    addGrammar: "Thêm ngữ pháp",
    vocabList: "Danh sách từ vựng",
    grammarList: "Danh sách ngữ pháp",
    noVocab: "Chưa có từ nào.",
    noGrammar: "Chưa có ngữ pháp nào.",
    noFlash: "Chưa có từ nào để lật flashcard.",
    flipHint: "Bấm để lật thẻ",
    nextWord: "Từ tiếp theo",
    noQuiz: "Thêm ít nhất 3 từ để bắt đầu quiz.",
    quizScore: "Điểm hiện tại",
    uploadDocs: "Tải tài liệu lên",
    docHint: "Có thể upload PDF, ảnh hoặc file tài liệu học tập.",
    docList: "Danh sách tài liệu",
    noDocs: "Chưa có tài liệu nào.",
    open: "Mở",
    vocabPlaceholder: "Ví dụ: 학교",
    meaningPlaceholder: "Ví dụ: Trường học",
    grammarPatternPlaceholder: "Ví dụ: 은/는",
    grammarMeaningPlaceholder: "Ví dụ: Chủ đề của câu",
    addWordBtn: "➕ Thêm từ",
    addGrammarBtn: "➕ Thêm ngữ pháp",
  },
  en: {
    title: "ai-noi-hoc-tieng-han-khong-kho",
    subtitle:
      "Learn Korean in a simple way — vocabulary, grammar, flashcards, quizzes, and documents in one place.",
    beta: "Beta",
    heroTag: "✨ Learn in a simple, beautiful, and memorable way",
    heroTitle: "Start learning Korean at your own pace.",
    heroText:
      "You can add new words, note grammar points, flip flashcards, take quizzes, and store study documents right inside the app.",
    start: "Start learning",
    docs: "View documents",
    todayTitle: "What to study today?",
    todayText: "5 new words + 2 grammar patterns + 1 short quiz.",
    todayProgress: "Today’s progress",
    home: "Home",
    learn: "Learn",
    flash: "Flashcard",
    quiz: "Quiz",
    docsTab: "Documents",
    mainTitle: "Main features",
    vocabTitle: "Vocabulary",
    grammarTitle: "Grammar",
    flashTitle: "Flashcard",
    quizTitle: "Quiz",
    docsTitle: "Documents",
    learnTitle: "Learn",
    addVocab: "Add vocabulary",
    addGrammar: "Add grammar",
    vocabList: "Vocabulary list",
    grammarList: "Grammar list",
    noVocab: "No words yet.",
    noGrammar: "No grammar yet.",
    noFlash: "No words yet for flashcards.",
    flipHint: "Tap to flip card",
    nextWord: "Next word",
    noQuiz: "Add at least 3 words to start the quiz.",
    quizScore: "Current score",
    uploadDocs: "Upload documents",
    docHint: "You can upload PDFs, images, or study files.",
    docList: "Document list",
    noDocs: "No documents yet.",
    open: "Open",
    vocabPlaceholder: "Example: 학교",
    meaningPlaceholder: "Example: School",
    grammarPatternPlaceholder: "Example: 은/는",
    grammarMeaningPlaceholder: "Example: Topic marker",
    addWordBtn: "➕ Add word",
    addGrammarBtn: "➕ Add grammar",
  },
};

export default function Page() {
  const [tab, setTab] = useState<TabKey>("home");
  const [learnTab, setLearnTab] = useState<LearnKey>("vocab");
  const [language, setLanguage] = useState<LangKey>("vi");

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

  useEffect(() => {
    const savedVocab = localStorage.getItem("ainoi_vocab");
    const savedGrammar = localStorage.getItem("ainoi_grammar");
    const savedLang = localStorage.getItem("ainoi_lang");

    if (savedVocab) setVocab(JSON.parse(savedVocab));
    if (savedGrammar) setGrammar(JSON.parse(savedGrammar));
    if (savedLang === "vi" || savedLang === "en") setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("ainoi_vocab", JSON.stringify(vocab));
  }, [vocab]);

  useEffect(() => {
    localStorage.setItem("ainoi_grammar", JSON.stringify(grammar));
  }, [grammar]);

  useEffect(() => {
    localStorage.setItem("ainoi_lang", language);
  }, [language]);

  const t = texts[language];

  const tabs = [
    { key: "home" as const, label: t.home, icon: "🏠" },
    { key: "learn" as const, label: t.learn, icon: "📚" },
    { key: "flash" as const, label: t.flash, icon: "🧠" },
    { key: "quiz" as const, label: t.quiz, icon: "🎯" },
    { key: "docs" as const, label: t.docsTab, icon: "📂" },
  ];

  const stats = useMemo(
    () => [
      { label: t.vocabTitle, value: vocab.length, icon: "📘" },
      { label: t.grammarTitle, value: grammar.length, icon: "✏️" },
      { label: t.quizScore, value: score, icon: "⭐" },
    ],
    [vocab.length, grammar.length, score, t.vocabTitle, t.grammarTitle, t.quizScore]
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
      setQuizFeedback(language === "vi" ? "✅ Chính xác!" : "✅ Correct!");
    } else {
      setQuizFeedback(
        language === "vi" ? "❌ Chưa đúng, thử lại nhé!" : "❌ Not quite, try again!"
      );
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
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.brandBlock}>
          <div style={styles.brandIcon}>🌸</div>
          <div>
            <h1 style={styles.brand}>{t.title}</h1>
            <p style={styles.subtitle}>{t.subtitle}</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.langSwitch}>
            <button
              onClick={() => setLanguage("vi")}
              style={{
                ...styles.langButton,
                ...(language === "vi" ? styles.langButtonActive : {}),
              }}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage("en")}
              style={{
                ...styles.langButton,
                ...(language === "en" ? styles.langButtonActive : {}),
              }}
            >
              EN
            </button>
          </div>

          <div style={styles.badge}>{t.beta}</div>
        </div>
      </header>

      {/* BANNER */}
      <section style={styles.banner}>
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <div style={styles.heroTag}>{t.heroTag}</div>
            <h2 style={styles.heroTitle}>{t.heroTitle}</h2>
            <p style={styles.heroText}>{t.heroText}</p>

            <div style={styles.heroActions}>
              <button style={styles.primaryButton} onClick={() => setTab("learn")}>
                {t.start}
              </button>
              <button style={styles.secondaryButton} onClick={() => setTab("docs")}>
                {t.docs}
              </button>
            </div>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.heroCardIcon}>🌸</div>
            <h3 style={styles.heroCardTitle}>{t.todayTitle}</h3>
            <p style={styles.heroCardText}>{t.todayText}</p>

            <div style={styles.progressWrap}>
              <div style={styles.progressLabel}>
                <span>{t.todayProgress}</span>
                <span>70%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
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

      {/* NAV */}
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

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {tab === "home" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>{t.mainTitle}</h3>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📖</div>
                <h4 style={styles.featureTitle}>{t.vocabTitle}</h4>
                <p style={styles.featureText}>
                  {language === "vi"
                    ? "Thêm từ mới, lưu lại và học theo danh sách riêng của bạn."
                    : "Add new words, save them, and study from your own list."}
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>✏️</div>
                <h4 style={styles.featureTitle}>{t.grammarTitle}</h4>
                <p style={styles.featureText}>
                  {language === "vi"
                    ? "Ghi chú các mẫu câu và ngữ pháp quan trọng bằng tiếng Việt dễ hiểu."
                    : "Note important sentence patterns and grammar in simple English."}
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🃏</div>
                <h4 style={styles.featureTitle}>{t.flashTitle}</h4>
                <p style={styles.featureText}>
                  {language === "vi"
                    ? "Lật thẻ nhanh để ghi nhớ từ vựng và nghĩa dễ dàng hơn."
                    : "Flip cards to memorize words and meanings more easily."}
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🎯</div>
                <h4 style={styles.featureTitle}>{t.quizTitle}</h4>
                <p style={styles.featureText}>
                  {language === "vi"
                    ? "Làm bài kiểm tra ngắn để ôn tập và kiểm tra trí nhớ."
                    : "Take short quizzes to review and test your memory."}
                </p>
              </div>
            </div>
          </section>
        )}

        {tab === "learn" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>{t.learnTitle}</h3>

            <div style={styles.subNav}>
              <button
                onClick={() => setLearnTab("vocab")}
                style={{
                  ...styles.subButton,
                  ...(learnTab === "vocab" ? styles.subButtonActive : {}),
                }}
              >
                📖 {t.vocabTitle}
              </button>
              <button
                onClick={() => setLearnTab("grammar")}
                style={{
                  ...styles.subButton,
                  ...(learnTab === "grammar" ? styles.subButtonActive : {}),
                }}
              >
                ✏️ {t.grammarTitle}
              </button>
            </div>

            {learnTab === "vocab" && (
              <div style={styles.learnLayout}>
                <div style={styles.formCard}>
                  <h4 style={styles.contentTitle}>{t.addVocab}</h4>

                  <input
                    placeholder={t.vocabPlaceholder}
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder={t.meaningPlaceholder}
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    style={styles.input}
                  />

                  <button onClick={addVocab} style={styles.primaryButton}>
                    {t.addWordBtn}
                  </button>
                </div>

                <div style={styles.listCard}>
                  <h4 style={styles.contentTitle}>{t.vocabList}</h4>

                  {vocab.length === 0 ? (
                    <p style={styles.emptyText}>{t.noVocab}</p>
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
                  <h4 style={styles.contentTitle}>{t.addGrammar}</h4>

                  <input
                    placeholder={t.grammarPatternPlaceholder}
                    value={grammarPattern}
                    onChange={(e) => setGrammarPattern(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder={t.grammarMeaningPlaceholder}
                    value={grammarMeaning}
                    onChange={(e) => setGrammarMeaning(e.target.value)}
                    style={styles.input}
                  />

                  <button onClick={addGrammar} style={styles.primaryButton}>
                    {t.addGrammarBtn}
                  </button>
                </div>

                <div style={styles.listCard}>
                  <h4 style={styles.contentTitle}>{t.grammarList}</h4>

                  {grammar.length === 0 ? (
                    <p style={styles.emptyText}>{t.noGrammar}</p>
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
            <h3 style={styles.sectionTitle}>{t.flashTitle}</h3>

            {vocab.length === 0 ? (
              <p style={styles.emptyText}>{t.noFlash}</p>
            ) : (
              <div style={styles.flashCard} onClick={() => setFlip((prev) => !prev)}>
                <div style={styles.flashHint}>{t.flipHint}</div>
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
                    {t.nextWord}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {tab === "quiz" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>{t.quizTitle}</h3>

            {vocab.length < 3 || !currentQuiz ? (
              <p style={styles.emptyText}>{t.noQuiz}</p>
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
                <div style={styles.quizScore}>
                  {t.quizScore}: {score}
                </div>
              </div>
            )}
          </section>
        )}

        {tab === "docs" && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>{t.docsTab}</h3>

            <div style={styles.formCard}>
              <h4 style={styles.contentTitle}>{t.uploadDocs}</h4>
              <input type="file" multiple onChange={handleUploadDocs} style={styles.fileInput} />
              <p style={styles.helperText}>{t.docHint}</p>
            </div>

            <div style={styles.listCard}>
              <h4 style={styles.contentTitle}>{t.docList}</h4>

              {docs.length === 0 ? (
                <p style={styles.emptyText}>{t.noDocs}</p>
              ) : (
                docs.map((doc, index) => (
                  <div key={`${doc.name}-${index}`} style={styles.docItem}>
                    <span>📄 {doc.name}</span>
                    {doc.url}
                      {t.open}
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
    background: "linear-gradient(180deg, #fff7ef 0%, #fffdf8 45%, #fce7f3 100%)",
    color: "#1f2937",
    padding: "24px",
    paddingBottom: "96px",
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
    marginBottom: "20px",
  },

  brandBlock: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },

  brandIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #f9a8d4, #fecdd3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    boxShadow: "0 10px 24px rgba(244, 114, 182, 0.18)",
    flexShrink: 0,
  },

  brand: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 900,
    lineHeight: 1.15,
    color: "#be185d",
    letterSpacing: "-0.03em",
    textTransform: "lowercase",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "760px",
  },

  headerRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  langSwitch: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  langButton: {
    border: "1px solid #f3d9e6",
    background: "#fffdf8",
    color: "#374151",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },

  langButtonActive: {
    background: "#fff1f7",
    color: "#be185d",
    borderColor: "#f9a8d4",
  },

  badge: {
    background: "#fff1f7",
    color: "#be185d",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    border: "1px solid #f9a8d4",
  },

  banner: {
    borderRadius: "30px",
    overflow: "hidden",
    marginBottom: "24px",
    backgroundImage:
      "linear-gradient(135deg, rgba(255,247,239,0.96), rgba(252,231,243,0.92)), url('https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid #f3d9e6",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
  },

  bannerOverlay: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "20px",
    padding: "30px",
    backdropFilter: "blur(4px)",
  },

  bannerContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heroTag: {
    display: "inline-flex",
    alignItems: "center",
    background: "#fff1f7",
    border: "1px solid #f9a8d4",
    color: "#be185d",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 800,
    marginBottom: "14px",
    width: "fit-content",
  },

  heroTitle: {
    margin: 0,
    fontSize: "36px",
    lineHeight: 1.15,
    fontWeight: 900,
    color: "#111827",
    letterSpacing: "-0.04em",
  },

  heroText: {
    marginTop: "14px",
    marginBottom: "22px",
    fontSize: "16px",
    lineHeight: 1.8,
    color: "#6b7280",
    maxWidth: "640px",
  },

  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  primaryButton: {
    background: "linear-gradient(135deg, #f9a8d4, #f472b6)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(244, 114, 182, 0.24)",
  },

  secondaryButton: {
    background: "#fffdf8",
    color: "#111827",
    border: "1px solid #f3d9e6",
    borderRadius: "16px",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },

  heroCard: {
    width: "100%",
    background: "linear-gradient(135deg, #fff1f7, #fff7ef)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 14px 36px rgba(244, 114, 182, 0.10)",
    border: "1px solid #f9a8d4",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heroCardIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  heroCardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 900,
    color: "#9d174d",
  },

  heroCardText: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#be185d",
    lineHeight: 1.7,
  },

  progressWrap: {
    marginTop: "22px",
  },

  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#be185d",
    marginBottom: "8px",
    fontWeight: 700,
  },

  progressBar: {
    height: "12px",
    borderRadius: "999px",
    background: "#fbcfe8",
    overflow: "hidden",
  },

  progressFill: {
    width: "70%",
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #f9a8d4, #f472b6)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginBottom: "20px",
  },

  statCard: {
    background: "#fffdf8",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    border: "1px solid #f3d9e6",
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
    background: "#fffdf8",
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #f3d9e6",
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
    fontWeight: 800,
    padding: "10px 8px",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "13px",
  },

  navButtonActive: {
    background: "#fff1f7",
    color: "#be185d",
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
    background: "#fffdf8",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.05)",
    border: "1px solid #f3d9e6",
  },

  sectionTitle: {
    margin: 0,
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: 900,
    color: "#111827",
    letterSpacing: "-0.02em",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },

  featureCard: {
    background: "linear-gradient(180deg, #fffdf8, #fff1f7)",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #f3d9e6",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.03)",
  },

  featureIcon: {
    fontSize: "28px",
    marginBottom: "10px",
  },

  featureTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 900,
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
    border: "1px solid #f3d9e6",
    background: "#fffdf8",
    color: "#374151",
    borderRadius: "14px",
    padding: "10px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },

  subButtonActive: {
    background: "#fff1f7",
    color: "#be185d",
    borderColor: "#f9a8d4",
  },

  learnLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  formCard: {
    background: "#fffdf8",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #f3d9e6",
  },

  listCard: {
    background: "#fffdf8",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #f3d9e6",
  },

  contentTitle: {
    margin: 0,
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: 900,
    color: "#111827",
  },

  input: {
    width: "100%",
    border: "1px solid #f3d9e6",
    borderRadius: "14px",
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
    border: "1px solid #f3d9e6",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "10px",
    boxShadow: "0 6px 12px rgba(15, 23, 42, 0.03)",
  },

  listWord: {
    fontWeight: 900,
    fontSize: "16px",
    color: "#111827",
  },

  listMeaning: {
    marginTop: "4px",
    color: "#6b7280",
    fontSize: "14px",
  },

  flashCard: {
    background: "linear-gradient(135deg, #fff7ef, #fff1f7)",
    border: "1px solid #f9a8d4",
    borderRadius: "28px",
    padding: "34px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 14px 34px rgba(244, 114, 182, 0.10)",
  },

  flashHint: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "16px",
  },

  flashContent: {
    fontSize: "36px",
    fontWeight: 900,
    color: "#111827",
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flashActions: {
    marginTop: "20px",
  },

  quizCard: {
    background: "#fffdf8",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #f3d9e6",
  },

  quizQuestion: {
    fontSize: "28px",
    fontWeight: 900,
    color: "#111827",
    textAlign: "center",
    marginBottom: "18px",
    letterSpacing: "-0.02em",
  },

  quizOptions: {
    display: "grid",
    gap: "10px",
  },

  quizOption: {
    border: "1px solid #f3d9e6",
    background: "#ffffff",
    padding: "14px",
    borderRadius: "16px",
    fontWeight: 800,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
  },

  quizFeedback: {
    marginTop: "14px",
    fontWeight: 900,
    color: "#be185d",
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
    border: "1px solid #f3d9e6",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 6px 12px rgba(15, 23, 42, 0.03)",
  },

  docLink: {
    color: "#be185d",
    fontWeight: 800,
    textDecoration: "none",
  },
};
