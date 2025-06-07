import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StickyNote from "../../assets/sticky-note.png"; // 경로 맞게 수정

function Home() {
  const [step, setStep] = useState("note"); // note | started | fade
  const navigate = useNavigate();

  const handleNoteClick = () => {
    setStep("started");
    setTimeout(() => {
      setStep("fade");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }, 3000);
  };

  return (
    <div
      className={`
        min-h-screen w-full flex flex-col items-center justify-center
        bg-[#fcfcf8] transition-colors duration-1000
        ${step === "fade" ? "opacity-0 transition-opacity duration-1000" : "opacity-100"}
      `}
    >
      {/* 상단 제목/설명 */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-start">
        <h1 className="text-6xl font-bold mb-2 text-gray-900">.Yellowmemo</h1>
        <p className="text-2xl text-gray-700 font-normal">
          Think, memo, create your own idea board by just One-click
        </p>
      </div>

      {/* 중앙 포스트잇 or Get Started! */}
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {step === "note" && (
          <img
            src={StickyNote}
            alt="sticky note"
            className="mt-5 w-80 h-80 object-contain cursor-pointer animate-wind hover:transition-transform duration-500"
            style={{
              transformOrigin: "top center",
            }}
            onClick={handleNoteClick}
          />
        )}
        {step !== "note" && (
          <div className="text-4xl font-semibold text-gray-700 animate-fadein select-none">
            Get Started!
          </div>
        )}
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm text-center ">
        <p>© 2025 Yellowmemo. All rights reserved to team Girlz Night .</p>
      </div>
      {/* 흔들림 애니메이션 */}
      <style>
        {`
          @keyframes wind {
            0% { transform: rotate(-5deg); }
            10% { transform: rotate(-7deg); }
            20% { transform: rotate(-3deg); }
            30% { transform: rotate(-8deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(-9deg); }
            60% { transform: rotate(-3deg);}
            70% { transform: rotate(-7deg);}
            80% { transform: rotate(-4deg);}
            90% { transform: rotate(-8deg);}
            100% { transform: rotate(-5deg);}
          }
          .animate-wind {
            animation: wind 2.2s cubic-bezier(.36,.07,.19,.97) infinite;
          }
          @keyframes fadein {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .animate-fadein {
            animation: fadein 0.8s;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
