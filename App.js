import { useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import Confetti from "react-confetti";

function App() {

  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [homework, setHomework] = useState([]);
  const [homeworkInput, setHomeworkInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [badge, setBadge] = useState("");

  const quotes = [
    "Keep going, your future self will thank you!",
    "Small steps every day make a big difference.",
    "Focus on progress, not perfection.",
    "Discipline is choosing what matters most.",
    "Every expert was once a beginner."
  ];
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  // Google login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setNotes([]);
    setHomework([]);
    setSuggestion("");
    setBadge("");
    setShowConfetti(false);
  };

  // Notes
  const addNote = () => {
    if (!noteInput.trim()) return;
    const newNotes = [...notes, noteInput];
    setNotes(newNotes);
    setNoteInput("");

    if (newNotes.length === 3) setBadge("📓 Note Master! You’ve written 3 notes!");
    if (newNotes.length === 5) setBadge("📓 Note Hero! You’ve written 5 notes!");
  };

  // Homework
  const addHomework = () => {
    if (!homeworkInput.trim()) return;
    const newHW = [...homework, { task: homeworkInput, done: false }];
    setHomework(newHW);
    setHomeworkInput("");
    setSuggestion("💡 Break it into smaller steps and tackle one at a time!");

    if (newHW.length === 3) setBadge("✅ Homework Hero! You’ve added 3 tasks!");
    if (newHW.length === 5) setBadge("✅ Homework Star! You’ve added 5 tasks!");
  };

  const toggleHomework = (i) => {
    const updated = homework.map((hw, idx) =>
      idx === i ? { ...hw, done: !hw.done } : hw
    );
    setHomework(updated);

    // all done confetti
    if (updated.length && updated.every((hw) => hw.done)) {
      setShowConfetti(true);
      setBadge("🎉 All homework done! You're a Superstar!");
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  // dark/light theme
  const theme = {
    background: darkMode ? "#1a1a2e" : "#f0f4f7",
    text: darkMode ? "#f0f4f7" : "#1a1a2e",
    card: darkMode ? "#162447" : "white",
    button: darkMode ? "#0f3460" : "#2575fc"
  };

  return (
    <div style={{
      fontFamily: "Arial",
      background: theme.background,
      color: theme.text,
      minHeight: "100vh",
      padding: 20
    }}>
      {showConfetti && <Confetti />}
      <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        
        {!user ? (
          <div>
            <h2>Hello Student 👋</h2>
            <p style={{ fontStyle: "italic", marginBottom: 20 }}>{quote}</p>
            <button onClick={handleLogin}
              style={{
                padding: "10px 20px",
                borderRadius: 20,
                border: "none",
                background: theme.button,
                color: "white",
                cursor: "pointer"
              }}>
              Login with Google
            </button>
          </div>
        ) : (
          <div>
            <h2>Welcome, {user.displayName || "Student"}!</h2>
            
            <button onClick={() => setDarkMode(!darkMode)}
              style={{
                margin: "10px 0",
                padding: "6px 15px",
                borderRadius: 20,
                border: "none",
                background: theme.button,
                color: "white"
              }}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <p style={{ fontStyle: "italic" }}>{quote}</p>

            {badge && (
              <div style={{
                margin: "10px 0",
                padding: "8px 12px",
                background: "#ffe066",
                borderRadius: 10,
                fontWeight: "bold"
              }}>
                {badge}
              </div>
            )}

            {/* Notes */}
            <div style={{
              background: theme.card,
              padding: 15,
              borderRadius: 10,
              margin: "15px 0"
            }}>
              <h3>Notes</h3>
              <input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write a note..."
                style={{ padding: 6, borderRadius: 10, marginRight: 5 }}
              />
              <button onClick={addNote}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: theme.button,
                  color: "white"
                }}>
                Add
              </button>
              {notes.map((n, i) => (
                <div key={i} style={{ marginTop: 8 }}>{n}</div>
              ))}
            </div>

            {/* Homework */}
            <div style={{
              background: theme.card,
              padding: 15,
              borderRadius: 10,
              margin: "15px 0"
            }}>
              <h3>Homework</h3>
              <input
                value={homeworkInput}
                onChange={(e) => setHomeworkInput(e.target.value)}
                placeholder="Add homework..."
                style={{ padding: 6, borderRadius: 10, marginRight: 5 }}
              />
              <button onClick={addHomework}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: theme.button,
                  color: "white"
                }}>
                Add
              </button>

              {suggestion && (
                <div style={{
                  marginTop: 10,
                  fontStyle: "italic",
                  color: "#2575fc"
                }}>
                  {suggestion}
                </div>
              )}

              {homework.map((hw, i) => (
                <div key={i} style={{ marginTop: 8 }}>
                  <span style={{
                    textDecoration: hw.done ? "line-through" : "none"
                  }}>
                    {hw.task}
                  </span>
                  <button onClick={() => toggleHomework(i)}
                    style={{
                      marginLeft: 10,
                      padding: "4px 10px",
                      borderRadius: 10,
                      border: "none",
                      background: "#ff6b6b",
                      color: "white"
                    }}>
                    {hw.done ? "Undo" : "Done"}
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleLogout}
              style={{
                padding: "6px 15px",
                borderRadius: 20,
                border: "none",
                background: "#ff6b6b",
                color: "white"
              }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
