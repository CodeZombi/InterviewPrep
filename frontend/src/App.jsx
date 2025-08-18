import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ResumeAnalyzer from "./pages/Home/ResumeAnalyzer";
import ProfileInterviews from "./pages/ProfileInterviews";
import InterviewSummaryPage from "./pages/InterviewSummaryPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import UserProvider from "./context/userContext";
import AIInterview from "./pages/AIInterview";
import FinalScreen from "./pages/FinalScreen";
import DashboardInterview from "./pages/Home/DashboardInterview";
const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<LandingPage />} />
            <Route path='/dashboard-mock-interviews' element={<DashboardInterview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route
              path="/interview-prep/:sessionId"
              element={<InterviewPrep />}
            />
            <Route
              path="/ai-interview/:interviewID"
              element={<AIInterview />}
            />
            <Route 
              path="/profile/interviews" 
              element={<ProfileInterviews />} 
            />
            <Route 
              path="/mockinterview/:id" 
              element={<InterviewSummaryPage />} 
            />
            <Route
              path="/mockinterview/submitted"
              element={<FinalScreen />}
            />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
