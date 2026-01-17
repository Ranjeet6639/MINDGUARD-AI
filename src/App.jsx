import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "./firebase";
import "./App.css";

// 📊 Chart
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const auth = getAuth();

function App() {
  // 🔐 Auth
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState("");

  // 🧠 Stress
  const [sleep, setSleep] = useState("");
  const [workload, setWorkload] = useState("");
  const [mood, setMood] = useState("");
  const [result, setResult] = useState("");
  const [level, setLevel] = useState("");

  // 📈 Graph
  const [graphData, setGraphData] = useState([]);

  // 🔥 Streak + Rewards
  const [streak, setStreak] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);

  // 🤖 AI
  const [aiAdvice, setAiAdvice] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // 🔁 Auth listener
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 🔥 Fetch streak + rewards
  useEffect(() => {
    if (!user) return;
    const fetchStreak = async () => {
      const ref = doc(db, "userStreaks", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setStreak(snap.data().currentStreak);
        setRewardPoints(snap.data().rewardPoints || 0);
      }
    };
    fetchStreak();
  }, [user]);

  // 🔐 Login / Register
  const handleAuth = async () => {
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setAuthError(e.message);
    }
  };

  // 🔥 Update streak + reward points
  const updateStreak = async () => {
    const today = new Date().toISOString().split("T")[0];
    const ref = doc(db, "userStreaks", user.uid);
    const snap = await getDoc(ref);

    // 🆕 First check-in
    if (!snap.exists()) {
      await setDoc(ref, {
        currentStreak: 1,
        longestStreak: 1,
        rewardPoints: 10,
        lastCheckInDate: today,
      });
      setStreak(1);
      setRewardPoints(10);
      return;
    }

    const data = snap.data();
    if (data.lastCheckInDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toISOString().split("T")[0];

    let newStreak =
      data.lastCheckInDate === y ? data.currentStreak + 1 : 1;

    let pointsEarned = 10;
    if (newStreak === 7) pointsEarned += 50;
    if (newStreak === 30) pointsEarned += 200;

    const updatedPoints = (data.rewardPoints || 0) + pointsEarned;

    await updateDoc(ref, {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, data.longestStreak),
      rewardPoints: updatedPoints,
      lastCheckInDate: today,
    });

    setStreak(newStreak);
    setRewardPoints(updatedPoints);
  };

  // 🧪 Stress analysis
  const analyzeStress = async () => {
    const s = +sleep,
      w = +workload,
      m = +mood;

    let stress = "",
      lvl = "",
      value = 0,
      advice = "";

    if (s < 5 && w > 7 && m < 4) {
      stress = "😡 High Stress";
      lvl = "high";
      value = 9;
      advice = "🚨 High stress detected."
      "• Reduce workload immediately\n• Avoid isolation\n• Practice guided breathing\n• Talk to someone you trust ⚕️ If this continues, consult: • Psychologist • Psychiatrist • Primary care doctor ;";
      setShowAlert(true);
    } else if (s < 6 || w > 6) {
      stress = "😟 Medium Stress";
      lvl = "medium";
      value = 6;
     advice = "⚠️ Moderate stress. Improve sleep routine • Take regular breaks • Light exercise / meditation • Consider a counselor if persistent ";
      setShowAlert(false);
    } else {
      stress = "😊 Low Stress";
      lvl = "low";
      value = 3;
      advice = "✅ You’re doing well. • Maintain healthy routines • Stay consistent • Keep tracking daily 🌱" ;
      setShowAlert(false);
    }

    setResult(stress);
    setLevel(lvl);
    setAiAdvice(advice);

    setGraphData((g) => [
      ...g,
      { time: new Date().toLocaleTimeString(), value },
    ]);

    await addDoc(collection(db, "stressReports"), {
      uid: user.uid,
      stress,
      level: lvl,
      createdAt: new Date(),
    });

    await updateStreak();
  };

  // 📊 Chart
  const chartData = {
    labels: graphData.map((d) => d.time),
    datasets: [
      {
        label: "Stress Trend",
        data: graphData.map((d) => d.value),
        borderColor: "#00ffcc",
        tension: 0.4,
      },
    ],
  };


  // 🔐 AUTH UI
  if (!user) {
    return (
      <div className="app">
        <div className="card">
          <h1>🧠 MindGuard AI</h1>

          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button onClick={handleAuth}>
            {isRegister ? "Register" : "Login"}
          </button>

          <p className="toggle" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login instead" : "Create account"}
          </p>

          {authError && <p className="error">{authError}</p>}
        </div>
      </div>
    );
  }

  // 🧠 MAIN UI
  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <div className="header">
  <h1>🧠 MindGuard AI</h1>

  <div className="right-stats">
    <div className="streak-badge">🔥 {streak}</div>
    <div className="reward-badge">⭐ {rewardPoints}</div>
  </div>
</div>
        </div>

        <input type="number" placeholder="Sleep Hours" onChange={(e) => setSleep(e.target.value)} />
        <input type="number" placeholder="Workload (1–10)" onChange={(e) => setWorkload(e.target.value)} />
        <input type="number" placeholder="Mood (1–10)" onChange={(e) => setMood(e.target.value)} />

        <button onClick={analyzeStress}>Analyze Stress</button>

        {result && <div className={`result ${level}`}>{result}</div>}
        {aiAdvice && <div className="ai-advice">{aiAdvice}</div>}
        {showAlert && <div className="alert">🚨 Seek professional help if needed.</div>}

        <Line data={chartData} />

        <button className="logout" onClick={() => signOut(auth)}>Logout</button>
        <p className="doctor">
  🚨 Emergency? Call the ambulance now:
  <a href="tel:102"><b> 102</b></a>
</p>

      </div>
      

      {/* 🤖 Floating AI Bot */}
      <div className="ai-bot">🤖</div>
    </div>
  );
}

export default App;
