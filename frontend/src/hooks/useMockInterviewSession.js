import { useState, useCallback, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function useMockInterviewSession(interviewID) {

  const [mockID,  setmockID]  = useState(null);
  const [questions,    setQuestions]    = useState([]);
  const [current,      setCurrent]      = useState(0);
  const [status,       setStatus]       = useState("idle");      
  const [statusesPerQ, setStatusesPerQ] = useState([]);          
  const [result,       setResult]       = useState(null);

  const [movingToNext, setMovingToNext] = useState(false);       

  const pollRef = useRef(null);

  
  const createdRef = useRef(false);

  useEffect(() => {
    if (!interviewID || createdRef.current) return; 
    createdRef.current = true;

    (async () => {
      try {
        const { data } = await axiosInstance.post("/mockInterview/create", { interviewID });
        setmockID(data.mockID);
        setQuestions(data.questions.map((q) => q.text));
        const total = data.totalQ ?? data.questions.length;
        setStatusesPerQ(Array(total).fill("idle"));
      } catch (err) {
        console.error("[useMockInterview] create error:", err);
        setStatus("error");
      }
    })();
  }, [interviewID]);


  
  useEffect(() => {
    if (!mockID) return;

    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get(`/mockInterview/${mockID}/status`);
        const newStatuses = Array.isArray(data) ? data : data.statuses;
        if (Array.isArray(newStatuses)) setStatusesPerQ(newStatuses);
      } catch {/* ignore polling failures */ }
    }, 5000);

    return () => clearInterval(pollRef.current);
  }, [mockID]);

  /* ───────── upload an answer ───────── */
  const submitAnswer = useCallback(
    async (blob, metrics = null) => {
      if (!mockID || !blob) return;

      setStatus("uploading");
      setMovingToNext(true);

      // optimistic status update
      setStatusesPerQ((prev) => {
        const next = [...prev];
        next[current] = "processing";
        return next;
      });

      try {
        const form = new FormData();
        form.append("video", blob, `answer-${Date.now()}.webm`);
        form.append("index",        current);
        form.append("questionText", questions[current]);
        if (metrics) form.append("metrics", JSON.stringify(metrics));

        await axiosInstance.post(`/mockInterview/${mockID}/transcribe`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // go to next question
        setCurrent((p) => p + 1);
      } catch (err) {
        console.error("[useMockInterview] upload error:", err);
        setStatus("error");
        setStatusesPerQ((prev) => {
          const next = [...prev];
          next[current] = "error";
          return next;
        });
      } finally {
        setStatus("idle");
        setMovingToNext(false);
      }
    },
    [mockID, current, questions]
  );

  /* ───────── fetch summary when all Qs done ───────── */
  useEffect(() => {
    if (!mockID || !questions.length) return;
    const allDone = statusesPerQ.length && statusesPerQ.every((s) => s === "done");
    if (!allDone || status === "done") return;

    (async () => {
      try {
        const { data } = await axiosInstance.get(`/mockInterview/${mockID}/result`);
        setResult(data.data);
        setStatus("done");
        clearInterval(pollRef.current);
      } catch (err) {
        console.error("[useMockInterview] result fetch error:", err);
        setStatus("error");
      }
    })();
  }, [statusesPerQ, status, mockID, questions.length]);

  return {
    mockID,
    questions,
    current,
    status,
    statusesPerQ,
    movingToNext,
    result,
    submitAnswer,
  };
}