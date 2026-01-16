// src/components/stress/StressGraph.jsx

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const StressGraph = ({ data }) => {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Stress Count Per Day</h3>

      <Line
        data={{
          labels: data.map(d => d.date),
          datasets: [
            {
              label: "Stress Count",
              data: data.map(d => d.count),
              tension: 0.4,
              fill: false
            }
          ]
        }}
      />
    </div>
  );
};

export default StressGraph;
