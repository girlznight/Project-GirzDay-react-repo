import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StickyNote from "../../assets/sticky-note.png";

function Home() {
  const [step, setStep] = useState("note"); // note | started | fade
  const navigate = useNavigate();

  const handleNoteClick = async () => {
    setStep("started");
    const userId = localStorage.getItem('userId');
    if (userId) {
      // 로그인 되어있을 경우(로컬 스토리지에 저장된 user.id 가 있을 경우)가장 큰 postid로 이동
      try {
        const res = await fetch("http://localhost:5000/post");
        const posts = await res.json();
        // id가 숫자일 수도, 문자열일 수도 있으니 Number로 변환
        const maxPost = posts.reduce((max, cur) =>
          Number(cur.id) > Number(max.id) ? cur : max, posts[0]
        );
        setTimeout(() => {
          setStep("fade");
          setTimeout(() => {
            navigate(`/post/${maxPost.id}`);
          }, 1000);
        }, 2000);
      } catch (e) {
        // 에러 시 back
        setTimeout(() => {
          setStep("fade");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }, 2000);
      }
    } else {
      // 비로그인: /login
      setTimeout(() => {
        setStep("fade");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }, 2000);
    }
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
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-start w-[90vw] max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gray-900">
          .Yellowmemo
        </h1>
        <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-normal">
          Think, memo, create your own idea board by just One-click
        </p>
      </div>

      {/* 중앙 포스트잇 or Get Started! */}
      <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh]">
        {step === "note" && (
          <img
            src={StickyNote}
            alt="sticky note"
            className="
              mt-5
              w-40 h-40
              sm:w-56 sm:h-56
              md:w-72 md:h-72
              lg:w-96 lg:h-96
              object-contain cursor-pointer animate-wind
              hover:transition-transform duration-500
            "
            style={{
              transformOrigin: "top center",
            }}
            onClick={handleNoteClick}
          />
        )}
        {step !== "note" && (
          <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 animate-fadein select-none">
            Get Started!
          </div>
        )}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-xs sm:text-sm text-center w-[90vw] max-w-2xl">
        <p>© 2025 Yellowmemo. All rights reserved to team Girlz Night.</p>
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
