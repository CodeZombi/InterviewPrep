import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();


  return (
    <header className="flex justify-between items-center mb-12 px-2 md:px-0">
      <span
        className="text-xl text-black font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Interview Prep AI
      </span>
      {user ? (
        <ProfileInfoCard />
      ) : (
        <button
          className="bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login / Sign Up
        </button>
      )}
    </header>
  );
}

export default function ProfileInterviews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* fetch list */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/mockInterview/mymock-sessions");
        setRows(data.interviews || []);
      } catch (err) {
        toast.error("Failed to fetch interviews.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this interview?")) return;
    try {
      await axiosInstance.delete(`/mockInterview/${id}`);
      setRows(prev => prev.filter(iv => iv._id !== id));
      toast.success("Interview deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  /* render */
  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      <div className="container mx-auto px-4 pt-8 pb-20 relative z-10">
        <Navbar />
        <h1 className="text-2xl font-bold text-black text-center mb-8">
          My Mock Interviews
        </h1>

        <div className="flex flex-col items-center gap-8">
          {loading ? (
            <p className="text-black text-base">Loading interviews…</p>
          ) : rows.length === 0 ? (
            <p className="text-black italic text-base">No mock interviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {rows.map(iv => {
                const ratings = iv.questions.map(q => q.rating).filter(r => r != null);
                const avgRating = ratings.length
                  ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                  : null;

                return (
                  <div
                    key={iv._id}
                    className="bg-[#FFFEF8] border border-amber-100 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition p-6 space-y-3"
                  >
                    {/* header */}
                    <div className="flex justify-between text-sm text-black mb-2">
                      <span>
                        <span className="font-semibold">Interview ID:</span> {iv._id}
                      </span>
                      <span>
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(iv.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* avg rating */}
                    <div className="text-sm text-black">
                      <span className="font-semibold">Avg. Rating:</span>{" "}
                      {avgRating || "⏳ waiting…"}
                    </div>

                    {/* actions */}
                    <div className="flex items-center gap-4 mt-2">
                      <Link
                        to={`/mockinterview/${iv._id}`}
                        className="bg-black text-white text-sm font-semibold px-4 py-1 rounded-full hover:bg-amber-100 hover:text-black border border-amber-50 hover:border-amber-300 transition-colors"
                      >
                        View Full Summary →
                      </Link>
                      <button
                        onClick={() => handleDelete(iv._id)}
                        className="text-amber-600 text-xs font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>

                    {/* per-question status */}
                    {iv.questions.map((q, i) => (
                      <div key={i} className="pt-3 border-t border-amber-100 text-sm space-y-1">
                        <p className="font-medium flex items-center gap-2 text-black">
                          Q{i + 1}:
                          {q.summary ? (
                            <>
                              <span className="text-green-600">✅</span>
                              <span className="line-clamp-1">{q.summary}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-yellow-600 animate-pulse">⏳</span>
                              <span className="text-black">Summary in progress…</span>
                            </>
                          )}
                        </p>
                        {q.rating != null && (
                          <p className="text-black">
                            Rating: <strong>{q.rating}</strong>/5
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm bg-amber-50 text-black text-center p-5 mt-10">
        
      </div>
    </div>
  );
}