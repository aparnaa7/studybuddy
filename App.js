import { useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import Confetti from "react-confetti";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [tip, setTip] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [badge, setBadge] = useState("");
  const [tab, setTab] = useState("notes");

  const quotes = [
    "Keep going, your future self will thank you!",
    "Small steps every day make a big difference.",
    "Consistency is key",
    "Focus on progress, not perfection.",
    "Discipline is choosing what matters most.",
    "Every expert was once a beginner.",
    "Disciplined ones are the only ones living life rest of all are just slave to their moods "
  ];
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setNotes([]);
    setTasks([]);
    setTip("");
    setBadge("");
    setShowConfetti(false);
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const list = [...notes, noteText];
    setNotes(list);
    setNoteText("");
    if (list.length === 3) setBadge("📓 Note Master! You've written 3 notes!");
    if (list.length === 5) setBadge("📓 Note Hero! You've written 5 notes!");
  };

  const removeNote = (i) => {
    setNotes(notes.filter((_, idx) => idx !== i));
  };

  const addTask = () => {
    if (!taskText.trim()) return;
    const list = [...tasks, { text: taskText, done: false }];
    setTasks(list);
    setTaskText("");
    setTip("💡Break it into smaller steps and tackle one at a time!");
    if (list.length === 3) setBadge("✅ Homework Hero! You've added 3 tasks!");
    if (list.length === 5) setBadge("✅ Homework Star! You've added 5 tasks!");
  };

  const toggleMode = (i) => {
    const list = tasks.map((t, idx) =>
      idx === i ? { ...t, done: !t.done } : t
    );
    setTasks(list);
    if (list.length && list.every((t) => t.done)) {
      setShowConfetti(true);
      setBadge("🎉 All homework done! You're a Superstar!");
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

const theme = {
    background: darkMode ? "#1a1a2e" : "#f0f4f7",
    text: darkMode ? "#f0f4f7" : "#1a1a2e",
    card: darkMode ? "#162447" : "white",
    button: darkMode ? "#0f3460" : "#2575fc"
  };

return (
    <div style={{ background: theme.background, color: theme.text, minHeight: "100vh", padding: 20 }}>
      {showConfetti && <Confetti />}
      <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        {!user ? (
          <div>
            <h1>Hello Student 👋</h1>
            <p style={{ fontStyle: "italic", marginBottom: 20 }}>{quote}</p>
            <button
              onClick={login}
              style={{ padding: "10px 20px", borderRadius: 20, background: theme.button, color: "white" }}
            >
              Login with Google
            </button>
          </div>
        ) : (
          <div>
            <h2>Welcome, {user.displayName }!</h2>

            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ margin: "10px 0", padding: "6px 15px", borderRadius: 20, background: theme.button, color: "white" }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <p style={{ fontStyle: "italic" }}>{quote}</p>
            {badge && <div style={{ margin: "10px 0", padding: "8px 12px", background: "#ffe066", borderRadius: 10, fontWeight: "bold" }}>{badge}</div>}

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 15 }}>
              <button
                onClick={() => setTab("notes")}
                style={{
                  padding: "6px 15px",
                  borderRadius: 10,
                  border: "none",
                  marginRight: 5,
                  background: tab === "notes" ? theme.button : theme.card,
                  color: tab === "notes" ? "white" : theme.text
                }}
              >
                Notes
              </button>
              <button
                onClick={() => setTab("homework")}
                style={{
                  padding: "6px 15px",
                  borderRadius: 10,
                  background: tab === "homework" ? theme.button : theme.card,
                  color: tab === "homework" ? "white" : theme.text
                }}
              >
                Homework
              </button>
            </div>

            {tab === "notes" && (
              <div style={{ background: theme.card, padding: 15, borderRadius: 10, margin: "15px 0" }}>
                <h3>Notes</h3>
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write a note.."
                  style={{ borderRadius: 10, marginRight: 5 }}
                />
                <button
                  onClick={addNote}
                  style={{ padding: "6px 12px", borderRadius: 10, background: theme.button, color: "white" }}
                >
                  Add
                </button>
                {notes.map((n, i) => (
                  <div key={i} style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span>{n}</span>
                    <button
                      onClick={() => removeNote(i)}
                      style={{ marginLeft: 10, padding: "4px 10px", borderRadius: 10, background: "#ff6b6b", color: "white" }}
                    >
                      Del
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "homework" && (
              <div style={{ background: theme.card, padding: 15, borderRadius: 10, margin: "15px 0" }}>
                <h3>Homework</h3>
                <input
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="Add homework.."
                  style={{ padding: 6, borderRadius: 10, marginRight: 5 }}
                />
                <button
                  onClick={addTask}
                  style={{ padding: "6px 12px", borderRadius: 10, background: theme.button, color: "white" }}
                >
                  Add
                </button>

                {tip && <div style={{ marginTop: 10, fontStyle: "italic", color: "#2575fc" }}>{tip}</div>}

                {tasks.map((t, i) => (
                  <div key={i} style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                    <button
                      onClick={() => toggleMode(i)}
                      style={{ marginLeft: 10, padding: "4px 10px", borderRadius: 10, background: "#ff6b6b", color: "white" }}
                    >
                      {t.done ? "Undo" : "Done"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={logout}
              style={{ padding: "6px 15px", borderRadius: 20, background: "#ff6b6b", color: "white" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

