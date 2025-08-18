import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="relative flex items-center">
      <img
        src={user.profileImageUrl}
        alt=""
        className="w-11 h-11 bg-gray-300 rounded-full mr-3 cursor-pointer"
        onClick={() => setProfileOpen((prev) => !prev)}
      />
      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {user.name || ""}
        </div>
      </div>
      {profileOpen && (
        <div className="absolute right-0 mt-14 w-56 bg-white rounded-lg shadow-xl animate-[fadeIn_0.15s_ease-out] z-10">
          {/* blue top bar */}
          <div className="h-1 rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-500" />

          <div className="py-2 text-gray-800 text-sm">
            

            <Link
              to="/profile/interviews"
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50"
              onClick={() => setProfileOpen(false)}
            >
              <svg
                className="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 3a2 2 0 00-2 2v1h14V5a2 2 0 00-2-2H5z" />
                <path
                  fillRule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm4 2a1 1 0 00-1 1v3h2v-3a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v3h2v-3a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              My Interviews
            </Link>

            <button
              className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline px-4 py-2 w-full text-left"
              onClick={handelLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard;
