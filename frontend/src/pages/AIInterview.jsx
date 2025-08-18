import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import RecorderPanel from "../components/RecordedPanel";
import VideoPreviewModal from "../components/VideoPreviewModal";
import InstructionDialog from "../components/InstructionDialogBox";


import useMockInterviewSession from "../hooks/useMockInterviewSession";

const READ_SEC   = 5;
const ANSWER_SEC = 90;


export default function AIInterview() {
  const { interviewID } = useParams();

  const navigate   = useNavigate();

 

  /* ───────── interview session ───────── */
  const session = useMockInterviewSession(interviewID);

  /* ───────── local ui state ───────── */
  const [previewBlob,    setPreviewBlob]    = useState(null);
  const [previewMetrics, setPreviewMetrics] = useState(null);

  const [showInstr,  setShowInstr]  = useState(true); // instruction dialog
  const [readTimer,  setReadTimer]  = useState(READ_SEC);
  const [recording,  setRecording]  = useState(false);

  const prevQRef = useRef(-1);

  /* ───────── reset per-question ui ───────── */
  useEffect(() => {
    if (
      session.current < session.questions.length &&
      session.current !== prevQRef.current
    ) {
      prevQRef.current = session.current;
      setShowInstr(true);      // show instructions again
    }
  }, [session.current, session.questions.length]);

  /* ───────── countdown → recording ───────── */
  useEffect(() => {
    if (showInstr) {
      setReadTimer(READ_SEC);
      setRecording(false);
      return; // wait for user to close dialog
    }

    const id = setInterval(() => {
      setReadTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRecording(true); // auto-start recording
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [showInstr]);

  /* ───────── navigate once summary ready ───────── */
  useEffect(() => {
    if (session.status === "done") {
      navigate("/profile/interviews");
    }
  }, [session.status, navigate]);


  if (session.status === "error") {
    return (
      <div className="text-center py-20 text-red-600">
        Something went wrong while contacting the server.
        <br />
        Please try again later.
      </div>
    );
  }

  if (session.questions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-600">
        Loading questions…
      </div>
    );
  }

  /* ───────── after last upload, wait for summary ───────── */
  if (session.current >= session.questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <span className="loader mb-4" />
        <h2 className="text-2xl font-semibold text-blue-700">
          Interview submitted!
        </h2>
        <p className="text-gray-600">
          Our AI is analysing your answers.
          <br />
          You’ll be redirected when the summary is ready.
        </p>
      </div>
    );
  }

  /* ───────── main render ───────── */
  const currentQ = session.questions[session.current];

  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      <div className="container mx-auto px-4 pt-8 pb-20 relative z-10">
        {/* instruction dialog */}
        <InstructionDialog
          open={showInstr}
          onClose={() => setShowInstr(false)}
          totalQ={session.questions.length}
          current={session.current}
        />

        {/* inter-question overlay */}
        {session.movingToNext && (
          <div className="fixed inset-0 bg-amber-50/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
            <span className="loader" />
            <p className="text-lg font-medium text-black">
              Processing your answer…
            </p>
          </div>
        )}

        <h1 className="text-3xl font-bold text-black mb-8 text-center">
          AI Mock Interview
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#FFFEF8] p-8 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 border border-amber-100 transition">
          <div>
            <QuestionCard
              question={currentQ}
              index={session.current}
              total={session.questions.length}
              readTimer={recording ? 0 : readTimer}
            />
          </div>
          <div>
            <RecorderPanel
              recording={recording}
              maxSec={ANSWER_SEC}
              onPreview={(blob, metrics) => {
                setRecording(false);
                setPreviewBlob(blob);
                setPreviewMetrics(metrics);
              }}
            />
          </div>
        </div>

        <VideoPreviewModal
          blob={previewBlob}
          open={!!previewBlob}
          onClose={() => {
            setPreviewBlob(null);
            setPreviewMetrics(null);
          }}
          onSubmit={() => {
            session.submitAnswer(previewBlob, previewMetrics);
            setPreviewBlob(null);
            setPreviewMetrics(null);
          }}
          loading={session.status === "uploading"}
        />
      </div>
    </div>
  );
}

/* ───────── loader css (Tailwind) ───────── */
const loaderStyle = `
@layer utilities {
  .loader {
    @apply relative h-12 w-12;
  }
  .loader::before,
  .loader::after {
    content: "";
    @apply absolute inset-0 rounded-full border-4 border-blue-600;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
  }
  .loader::after {
    @apply border-2 border-blue-400;
    border-top-color: transparent;
    animation-direction: reverse;
  }
  @keyframes spin {
    to { transform: rotate(360deg) }
  }
}`;

if (typeof document !== "undefined" && !document.getElementById("spinner-style")) {
  const style = document.createElement("style");
  style.id = "spinner-style";
  style.textContent = loaderStyle;
  document.head.appendChild(style);
}