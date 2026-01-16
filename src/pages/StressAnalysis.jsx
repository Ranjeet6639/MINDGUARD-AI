import { useState } from "react";
import StressGraph from "../components/stress/StressGraph";
import StressTips from "../components/stress/StressTips";

const StressAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [stressData, setStressData] = useState([]);

  const handleAnalyzeStress = async () => {
    setLoading(true);
    setShowResult(false);

    try {
      // ⏳ Optional: keep 3–4 sec UX delay
      setTimeout(async () => {
        const response = await fetch(
          "http://localhost:5000/api/stress-analysis",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        const result = await response.json();

        // ✅ IMPORTANT: adjust key if backend differs
        setStressData(result.dailyStress);

        setLoading(false);
        setShowResult(true);

        // 🔽 Auto-scroll to bottom
        setTimeout(() => {
          document
            .querySelector(".stress-container")
            ?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);

      }, 3500);

    } catch (error) {
      console.error("Stress analysis failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="stress-container" style={{ padding: "20px" }}>
      
      <h2>Stress Analysis</h2>

      <button
        onClick={handleAnalyzeStress}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        {loading ? "Analyzing..." : "Analyze Stress"}
      </button>

      {loading && (
        <p style={{ marginTop: "20px" }}>
          Analyzing stress levels, please wait...
        </p>
      )}

      {showResult && (
        <div style={{ marginTop: "30px" }}>
          <StressTips data={stressData} />
          <StressGraph data={stressData} />
        </div>
      )}
    </div>
  );
};

export default StressAnalysis;
