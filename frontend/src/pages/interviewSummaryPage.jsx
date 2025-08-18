import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function InterviewSummaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* fetch once */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/mockInterview/${id}`);
        setData(data.interview);
      } catch {
        toast.error("Failed to fetch interview summary.");
        navigate("/profile/interviews");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) return <div className="p-6 text-center">Loading summary…</div>;
  if (!data)   return null;

  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      <div className="container mx-auto px-4 pt-8 pb-20 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-amber-700 hover:text-black font-semibold transition mb-6 bg-amber-100 px-4 py-2 rounded-full shadow-sm border border-amber-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interviews
        </button>

        <h1 className="text-3xl font-bold text-black mb-8 text-center">
          {data.company || "Interview"} Summary
        </h1>

        <div className="space-y-8">
          {data.questions.map((q, i) => (
            <div
              key={i}
              className="border border-amber-100 rounded-2xl p-6 shadow-xs hover:shadow-lg shadow-amber-100 bg-white transition-all"
            >
              {/* header */}
              <div className="flex items-center justify-between text-sm text-black mb-2">
                <span className="font-semibold">Question {i + 1}</span>
                {q.rating != null && <Badge rating={q.rating} />}
              </div>

              <p className="font-semibold text-black mb-2">{q.text}</p>

              {q.summary ? (
                <>
                  {/* AI summary */}
                  <div>
                    <span className="font-semibold text-amber-700">AI Summary:</span>
                    <p className="text-black whitespace-pre-wrap mt-1 leading-relaxed">
                      {q.summary}
                    </p>
                  </div>

                  {/* Rating bar */}
                  <div className="space-y-1 pt-2">
                    <div className="text-sm text-black">
                      Rating: <span className="font-bold">{q.rating}/5</span>
                    </div>
                    <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(q.rating / 5) * 100}%`,
                          backgroundColor: getRatingColor(q.rating),
                        }}
                      />
                    </div>
                  </div>

                  {/* Voice-coach box */}
                  {q.analysis?.voiceCoach?.coachSummary && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3 text-sm text-black">
                      <strong>Voice Coach Summary:</strong>
                      <pre className="whitespace-pre-wrap mt-1 text-sm">
                        {q.analysis.voiceCoach.coachSummary}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-amber-600 italic pt-2">Summary not available.</div>
              )}

              {/* Transcript accordion */}
              {q.transcription && (
                <details className="text-sm text-black pt-2">
                  <summary className="cursor-pointer font-medium text-amber-700 hover:underline">
                    View Transcript
                  </summary>
                  <pre className="whitespace-pre-wrap pt-2 text-black">
                    {q.transcription}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function Badge({ rating }) {
  const label =
    rating >= 4.5 ? "🌟 Excellent" :
    rating >= 3.5 ? "👍 Good"     :
    rating >= 2.5 ? "🧐 Average"  : "⚠️ Needs Work";

  const bg =
    rating >= 4.5 ? "bg-amber-500" :
    rating >= 3.5 ? "bg-amber-400" :
    rating >= 2.5 ? "bg-amber-300" : "bg-amber-200";

  return (
    <span className={`text-xs font-semibold text-black px-2 py-0.5 rounded-full ${bg}`}>
      {label}
    </span>
  );
}

function getRatingColor(rating) {
  if (rating >= 4.5) return "#f59e0b"; // amber-500
  if (rating >= 3.5) return "#fbbf24"; // amber-400
  if (rating >= 2.5) return "#fde68a"; // amber-300
  return "#fef3c7"; // amber-100
}