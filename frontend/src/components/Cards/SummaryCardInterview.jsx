import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";
import { useNavigate } from "react-router-dom";




const SummaryCardInterview = ({
  interviewId,
  colors,
  role,
  topicsToFocus,

  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
  
}) => {
  const navigate = useNavigate();
  const handleCTA = (e) => {
    e.stopPropagation(); // Prevent parent click
    navigate(`/ai-interview/${interviewId}`);
  };
  return<div
      className="bg-white border border-gray-300/40 rounded-xl p-2 overflow-hidden cursor-pointer hover:shadow-xl shadow-gray-100 relative group"
      onClick={onSelect}
    >
      <div
        className="rounded-lg p-4 cursor-pointer relative"
        style={{
          background: colors.bgcolor,
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-md flex items-center justify-center mr-4">
            <span className="text-lg font-semibold text-black">
              {getInitials(role)}
            </span>
          </div>

          {/* Content Container */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              {/* Title and Skills */}
              <div>
                <h2 className="text-[17px] font-medium">{role}</h2>
                <p className="text-xs text-medium text-gray-900">
                  {topicsToFocus}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="hidden group-hover:flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1 rounded text-nowrap border border-rose-100 hover:border-rose-200 cursor-pointer absolute top-0 right-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 />
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 mt-4">
          

          <div className="text-[10px] font-medium text-black px-3 py-1 border-[0.5px] border-gray-900 rounded-full">
            {questions} Q&A
          </div>

          <div className="text-[10px] font-medium text-black px-3 py-1 border-[0.5px] border-gray-900 rounded-full">
            Last Updated: {lastUpdated}
          </div>
          <button
            className="bg-black text-sm font-semibold text-white px-5 py-1 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
            onClick={handleCTA}
            >
            Start Interview
          </button>
        </div>
        

        {/* Description */}
        <p className="text-[12px] text-gray-500 font-medium line-clamp-2 mt-3">
          {description}
        </p>
      </div>
    </div>
};

export default SummaryCardInterview;
