"use client";
import { useState } from "react";
import OutputCard from "../components/OutputCard";

export default function Home() {
  const [match, setMatch] = useState("");
  const [homeForm, setHomeForm] = useState(5);
  const [awayForm, setAwayForm] = useState(5);
  const [injury, setInjury] = useState("none");
  const [homecourt, setHomecourt] = useState("home");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePredict() {
    if (!match) return;
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/predict", {
      method: "POST",
      body: JSON.stringify({
        match, homeForm, awayForm, injury, homecourt
      })
    });

    const data = await res.json();
    setResult(data.output);
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Bruce NBA Model
      </h1>

      <input
        className="w-full p-4 border rounded-xl mb-4"
        placeholder="输入比赛，如：Spurs vs Wolves"
        value={match}
        onChange={e => setMatch(e.target.value)}
      />

      <div className="mb-4">
        <label>主队状态：{homeForm}/10</label>
        <input type="range" min="0" max="10"
          className="w-full"
          value={homeForm}
          onChange={e => setHomeForm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label>客队状态：{awayForm}/10</label>
        <input type="range" min="0" max="10"
          className="w-full"
          value={awayForm}
          onChange={e => setAwayForm(e.target.value)}
        />
      </div>

      <select
        className="w-full p-4 border rounded-xl mb-4"
        value={injury}
        onChange={e => setInjury(e.target.value)}
      >
        <option value="none">无主力缺阵</option>
        <option value="home">主队主力缺阵</option>
        <option value="away">客队主力缺阵</option>
      </select>

      <select
        className="w-full p-4 border rounded-xl mb-4"
        value={homecourt}
        onChange={e => setHomecourt(e.target.value)}
      >
        <option value="home">主队主场</option>
        <option value="away">客队主场</option>
        <option value="neutral">中立场</option>
      </select>

      <button
        onClick={handlePredict}
        className="w-full p-4 bg-black text-white rounded-xl text-lg"
      >
        {loading ? "预测中..." : "立即预测"}
      </button>

      {result && <OutputCard result={result} />}
    </div>
  );
}