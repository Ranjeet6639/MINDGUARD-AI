import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "./firebase";
import "./App.css";

const auth = getAuth();

function App() {
  // 🔐 Auth states
  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Stress states
  const [sleep, setSleep] = useState("");
  const [workload, setWorkload] = useState("");
  const [mood, setMood] = useState("");
  const [result, setResult] = useState("");
  const [level, setLevel] = useState("");

  // 🔁 Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 🔐 Login / Register
  const handleAuth = async () => {
    setAuthError("");

    if (!email || !password || (isRegister && !confirmPassword)) {
      setAuthError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧪 Stress analysis (FIXED)
  const analyzeStress = async () => {
    if (!sleep || !workload || !mood) {
      alert("Please fill all fields");
      return;
    }

    const s = Number(sleep);
    const w = Number(workload);
    const m = Number(mood);

    if (s <= 0 || w <= 0 || m <= 0 || w > 10 || m > 10) {
      alert("Enter valid values");
      return;
    }

    let stress = "";
    let stressLevel = "";

    if (s < 5 && w > 7 && m < 4) {
      stress = "😡 High Stress";
      stressLevel = "high";
    } else if (s < 6 || w > 6) {
      stress = "😟 Medium Stress";
      stressLevel = "medium";
    } else {
      stress = "😊 Low Stress";
      stressLevel = "low";
    }

    setResult(stress);
    setLevel(stressLevel);

    await addDoc(collection(db, "stressReports"), {
      uid: user.uid,
      email: user.email,
      sleep: s,
      workload: w,
      mood: m,
      stress,
      level: stressLevel,
      createdAt: new Date(),
    });
  };

  // 🔐 AUTH UI
  if (!user) {
    return (
      <div className="app">
        <div className="card">
          <h1>🧠 MindGuard AI</h1>
          <p className="subtitle">
            {isRegister ? "Create Account" : "Login"}
          </p>

          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister && (
            <input
              type="password"
              placeholder="🔁 Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button onClick={handleAuth} disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>

          {authError && <p className="error">{authError}</p>}

          <p className="toggle" onClick={() => setIsRegister(!isRegister)}>
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register"}
          </p>
        </div>
      </div>
    );
  }

  // 🧠 MAIN APP UI
  return (
    <div className="app">
      <div className="card">
        <h1>🧠 MindGuard AI</h1>
        <p className="subtitle">Daily Student Stress Check-In</p>

        <p className="user-email">👤 {user.email}</p>

        <input
          type="number"
          placeholder="😴 Sleep Hours"
          value={sleep}
          onChange={(e) => setSleep(e.target.value)}
        />

        <input
          type="number"
          placeholder="📚 Workload (1-10)"
          value={workload}
          onChange={(e) => setWorkload(e.target.value)}
        />

        <input
          type="number"
          placeholder="😊 Mood (1-10)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <button onClick={analyzeStress}>Analyze Stress</button>

        {result && <div className={`result ${level}`}>{result}</div>}

        <button className="logout" onClick={() => signOut(auth)} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
