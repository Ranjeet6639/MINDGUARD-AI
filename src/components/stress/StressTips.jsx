// src/components/stress/StressTips.jsx

const StressTips = ({ data }) => {
  const avg =
    data.reduce((sum, d) => sum + d.count, 0) / data.length;

  let tips = [];
  let level = "";

  if (avg <= 3) {
    level = "Low Stress 😊";
    tips = [
      "Your stress level is well managed",
      "Maintain healthy sleep habits",
      "Continue regular exercise"
    ];
  } else if (avg <= 6) {
    level = "Moderate Stress ⚠️";
    tips = [
      "Take short breaks during work",
      "Practice breathing exercises",
      "Limit caffeine intake"
    ];
  } else {
    level = "High Stress 🚨";
    tips = [
      "Try meditation or yoga daily",
      "Reduce screen time",
      "Talk to a mental health professional"
    ];
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>{level}</h3>
      <ul>
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default StressTips;
