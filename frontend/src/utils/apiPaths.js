export const BASE_URL = "https://interviewprep-5zie.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions", // Generate interview questions and answers using Gemini
    GENERATE_INTERVIEW_QUESTIONS: "/api/ai/generate-interview-questions", // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: "/api/ai/generate-explanation", // Generate concept explanation using Gemini
  },


  SESSION: {
    CREATE: "/api/sessions/create", // Create a new interview session with questions
    GET_ALL: "/api/sessions/my-sessions", //  Get all user sessions
    GET_ONE: (id) => `/api/sessions/${id}`, // Get session details with questions
    DELETE: (id) => `/api/sessions/${id}`, // Delete a session
  },

  INTERVIEW: {
    CREATE: "/api/interview/create", // Create a new mock interview
    GET_ALL: "/api/interview/my-interviews", // Get all user mock interviews
    GET_ONE: (id) => `/api/interview/${id}`, // Get mock interview details
    DELETE: (id) => `/api/interview/${id}`, // Delete a mock interview
  },

  INTERVIEW_QUESTION: {
    SESSION: {
    CREATE: "/api/sessions/create-interview", // Create a new interview session with questions
    GET_ALL: "/api/sessions/my-interview-sessions", //  Get all user sessions
    GET_ONE: (id) => `/api/interview-sessions/${id}`, // Get session details with questions
    DELETE: (id) => `/api/interview-sessions/${id}`, // Delete a session
  },

  ADD_TO_SESSION: "/api/questions/add", // Add more questions to a session
    PIN: (id) => `/api/questions/${id}/pin`, // Pin or Unpin a question
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`, // Update/Add a note to a question
  },
};
