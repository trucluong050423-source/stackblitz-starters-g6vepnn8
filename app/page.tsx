"use client";

import { useState, useEffect } from "react";

type WordItem = {
  word: string;
  meaning: string;
};

export default function Page() {
  const [tab, setTab] = useState("home");
  const [subTab, setSubTab] = useState("vocab");

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [list, setList] = useState<WordItem[]>([]);

  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("korean");
    if (saved) setList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("korean", JSON.stringify(list));
  }, [list]);

  const add = () => {
    if (!word || !meaning) return;
    setList([...list, { word, meaning }]);
    setWord("");
    setMeaning("");
  };

  const current = list[index];

  const next = () => {
    if (list.length > 0) {
      setIndex((index + 1) % list.length);
    }
  };

  const getOptions = () => {
    if (list.length < 3 || !current) return [];

    const correct = current.meaning;
    const wrong1 = list[Math.floor(Math.random() * list.length)]?.meaning;
    const wrong2 = list[Math.floor(Math.random() * list.length)]?.meaning;

    return [correct, wrong1, wrong2]
      .filter(Boolean)
      .sort(() => 0.5 - Math.random());
  };

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: 20, textAlign: "center" }}>
      <h1 style={{ color: "#58cc02" }}>
        ai-noi-hoc-tieng-han-khong-kho 🌸
      </h1>

      {/* MENU */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={() => setTab("home")}>🏠 Trang chủ</button>
        <button onClick={() => setTab("learn")}>📚 Học tập</button>
        <button onClick={() => setTab("flash")}>🧠 Flashcard</button>
        <button onClick={() => setTab("quiz")}>🎯 Quiz</button>
        <button onClick={() => setTab("docs")}>📂 Tài liệu</button>
      </div>

      {/* TRANG CHỦ */}
      {tab === "home" && (
        <div>
          <h2>👋 Chào mừng bạn!</h2>
          <p>Học tiếng Hàn dễ như chơi ✨</p>
        </div>
      )}

      {/* HỌC TẬP */}
      {tab === "learn" && (
        <div>
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => setSubTab("vocab")}>📖 Từ vựng</button>
            <button onClick={() => setSubTab("grammar")}>✏️ Ngữ pháp</button>
          </div>

          {/* TỪ VỰNG */}
          {subTab === "vocab" && (
            <div>
              <h3>Thêm từ vựng</h3>

              <input
                placeholder="학교"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                style={{ margin: 5, padding: 8 }}
              />
              <br />

              <input
                placeholder="Trường học"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                style={{ margin: 5, padding: 8 }}
              />
              <br />

              <button onClick={add} style={{ marginTop: 8 }}>
                ➕ Add
              </button>

              <hr />

              {list.map((item, i) => (
                <p key={i}>
                  {item.word} - {item.meaning}
                </p>
              ))}
            </div>
          )}

          {/* NGỮ PHÁP */}
          {subTab === "grammar" && (
            <div>
              <h3>Ngữ pháp cơ bản</h3>
              <p>은/는 → Chủ đề</p>
              <p>이/가 → Chủ ngữ</p>
              <p>을/를 → Tân ngữ</p>
            </div>
          )}
        </div>
      )}

      {/* FLASHCARD */}
      {tab === "flash" && (
        <div>
          {list.length === 0 ? (
            <p>Chưa có từ</p>
          ) : (
            <div
              onClick={() => setFlip(!flip)}
              style={{
                padding: 40,
                background: "#f1f1f1",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              {flip ? current?.meaning : current?.word}
            </div>
          )}
        </div>
      )}

      {/* QUIZ */}
      {tab === "quiz" && (
        <div>
          {list.length < 3 || !current ? (
            <p>Thêm ít nhất 3 từ</p>
          ) : (
            <>
              <h3>{current.word}</h3>

              {getOptions().map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    alert(opt === current.meaning ? "✅ Đúng" : "❌ Sai");
                    next();
                  }}
                  style={{ display: "block", margin: "5px auto", padding: 10 }}
                >
                  {opt}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* TÀI LIỆU */}
      {tab === "docs" && (
        <div>
          <h3>📂 Tài liệu học</h3>
          <p>📘 Sách TOPIK (thêm sau)</p>
          <p>📄 PDF học tiếng Hàn</p>
          <p>🎥 Video học</p>
        </div>
      )}
    </div>
  );
}
