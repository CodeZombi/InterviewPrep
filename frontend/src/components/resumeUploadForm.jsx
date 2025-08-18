import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "react-circular-progressbar/dist/styles.css";

export default function ResumeUploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (result.length && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const clearAll = () => {
    setFile(null);
    setResult([]);
  };

  const handleUpload = async () => {
    if (!file || loading) return;
    setLoading(true);
    toast.info("Analyzing resume…");

    const fd = new FormData();
    fd.append("resume", file);

    try {
      const r = await fetch("https://interviewprep-4qy0.onrender.com/analyze-resume-pdf", {
        method: "POST",
        body: fd,
      });
      const j = await r.json();
      setResult(j.analysis || []);
      toast.success("Analysis complete!");
    } catch {
      toast.error("Server error while analyzing.");
    }
    setLoading(false);
  };

  const overall =
    result.length > 0
      ? Math.round(result.reduce((s, r) => s + (Number(r.score) || 0), 0) / result.length)
      : 0;

  const verdict =
    overall >= 8 ? "Excellent" : overall >= 6 ? "Good" : overall >= 4 ? "Average" : "Needs Work";

  const badgeClasses = (score) => {
    if (score >= 8) return "bg-amber-100 text-amber-800 animate-pulse";
    if (score >= 6) return "bg-yellow-100 text-yellow-800 animate-pulse";
    if (score >= 4) return "bg-orange-100 text-orange-800 animate-pulse";
    return "bg-red-100 text-red-800 animate-pulse";
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFCEF] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-xl mx-auto bg-[#FFFEF8] rounded-2xl shadow-lg border border-amber-100 p-8 space-y-10">
        <h2 className="text-3xl font-bold mb-2 text-black text-center">
          Resume Analyzer
        </h2>
        <p className="text-base text-black text-center mb-6">
          Upload your resume <span className="text-black">(PDF)</span> and get instant insights on strengths, gaps, and areas of improvement.
        </p>

        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-amber-300/60 rounded-xl p-8 cursor-pointer hover:bg-amber-50/40 transition">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <span className="text-lg font-semibold text-amber-600">
            {file ? file.name : "Click to select PDF"}
          </span>
        </label>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 rounded-full bg-black py-3 text-white font-semibold hover:bg-amber-100 hover:text-black border border-amber-50 hover:border-amber-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8v4" strokeWidth="4" strokeLinecap="round" />
              </svg>
            )}
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          {result.length > 0 && (
            <button
              onClick={clearAll}
              className="rounded-full border border-amber-600 py-3 px-4 text-amber-600 font-semibold hover:bg-amber-50 transition"
            >
              Upload Again
            </button>
          )}
        </div>

        {result.length > 0 && (
          <section ref={resultsRef} className="space-y-10 mt-10">
            <article className="flex items-center gap-6 rounded-xl bg-amber-50 ring-1 ring-amber-200 p-6">
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={overall * 10}
                  text={`${overall}`}
                  styles={buildStyles({
                    pathColor: "#fbbf24",
                    trailColor: "#fde68a",
                    textColor: "#000000",
                  })}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">
                  Overall Score: {overall}/10
                </h3>
                <span className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(overall)}`}>
                  {verdict}
                </span>
              </div>
            </article>

            {result.map((section, idx) => {
              const data = Object.entries(section.criteria).map(([k, v]) => ({
                name: k[0].toUpperCase() + k.slice(1),
                value: Number(v) || 0,
              }));

              return (
                <article
                  key={section.section}
                  className="rounded-xl bg-white shadow ring-1 ring-amber-100 p-6 space-y-6 transform transition duration-300 hover:-translate-y-1"
                  style={{ animation: `fadeIn 0.4s ease ${idx * 0.08}s both` }}
                >
                  <header className="flex items-center justify-between">
                    <h3 className="text-xl font-bold capitalize tracking-wide text-black">
                      {section.section}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClasses(section.score)}`}>
                      {section.score}/10
                    </span>
                  </header>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" domain={[0, 10]} hide />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: "#000000" }} />
                        <Tooltip cursor={{ fill: "rgba(251,191,36,0.08)" }} contentStyle={{ fontSize: "12px", color: "#000" }} />
                        <defs>
                          <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#fde68a" />
                            <stop offset="100%" stopColor="#fbbf24" />
                          </linearGradient>
                        </defs>
                        <Bar dataKey="value" fill={`url(#grad-${idx})`} radius={[8, 8, 8, 8]} barSize={18} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="space-y-2 mt-2">
                    {section.suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 bg-amber-50/50 p-2 rounded-md text-sm font-medium text-black"
                      >
                        <span className="text-amber-600 mt-0.5">✅</span>
                        <span className="text-black">{s}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}