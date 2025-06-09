import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StickyNote from "../../assets/sticky-note.png";
import FadeInOnScroll from "../../components/FadeInOnScroll"; // 앞서 안내한 스크롤 효과 컴포넌트

function Home() {
  const [step, setStep] = useState("note");
  const navigate = useNavigate();
  
  // 페이지가 로드될 때 스크롤 위치를 맨 위로 설정하고, 스크롤 복원 방지
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleNoteClick = async () => {
    setStep("started");
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const res = await fetch("http://localhost:5000/post");
        const posts = await res.json();
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
        setTimeout(() => {
          setStep("fade");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }, 2000);
      }
    } else {
      setTimeout(() => {
        setStep("fade");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }, 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcf8]">
      {/* 1. 메인(포스트잇) 섹션 */}
      <section
        className={`
          min-h-screen flex flex-col items-center justify-center relative
          transition-colors duration-1000
          ${step === "fade" ? "opacity-0 transition-opacity duration-1000" : "opacity-100"}
        `}
      >
        {/* 상단 제목/설명 */}
        <div className="absolute top-16 left-14 text-left w-[90vw] max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gray-900">
            .Yellowmemo
          </h1>
          <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-normal">
            Think, memo, create your own idea board by just One-click
          </p>
        </div>

        {/* 중앙 포스트잇 or Get Started! */}
        <div className="flex flex-col items-center justify-center">
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
        {/* 카피라이트 */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-xs sm:text-sm text-center w-[90vw] max-w-2xl">
          <p>© 2025 Yellowmemo. All rights reserved to team Girlz Night.</p>
        </div>
        {/* 애니메이션 */}

      </section>
      {/* 2. About(소개) 섹션 */}
      <section className="w-full flex flex-col items-center justify-center mt-24 mb-16 min-h-screen">
        <div className="w-full max-w-2xl px-4 space-y-10">
          <FadeInOnScroll>
            <p className="text-4xl font-semibold text-gray-900">작지만, 꼭 필요한 아이디어.</p>
          </FadeInOnScroll>

          <div className="space-y-3">
            <FadeInOnScroll delay={0}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">이 프로젝트는 어느 날, 책상 위에 놓인 노란색 포스트잇 한 장에서 시작되었습니다.</p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.1}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">순간 떠오른 생각, 스쳐가는 아이디어를 어디엔가 간직하고 공유하고 싶었습니다.</p>
            </FadeInOnScroll>
          </div>

          <div className="space-y-3">
            <FadeInOnScroll delay={0.2}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">
                이 앱은 복잡한 기능보다는 <strong className="text-gray-900">아이디어를 기록하는 그 자체</strong>에 집중하기 위해 제작 되었습니다.
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.3}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">
                React와 JSON server로 만들어졌으며, 
                
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.3}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">
                
                글과 포스트잇을 쓰고, 고치고, 지우는 모든 과정이 자연스럽고 간결하게 흐르도록 설계되었습니다.
              </p>
            </FadeInOnScroll>
          </div>

          <div className="space-y-3">
            <FadeInOnScroll delay={0.4}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">데이터를 간단히 저장하는 구조로 시작했지만,</p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.5}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">이 안에는 생각을 존중하는 작은 철학이 담겨 있습니다.</p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.6}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">빠르게 적고, 가볍게 남기며, 편하게 돌아볼 수 있도록.</p>
            </FadeInOnScroll>
          </div>

          <div className="space-y-3">
            <FadeInOnScroll delay={0.7}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">
                프로젝트는 {" "}
                <a
                  href="https://github.com/girlznight/Project-GirzDay-react-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  GitHub
                </a>
                에서 확인하실 수 있어요.
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.8}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">
                아이디어나 의견이 있다면 언제든지 들려주세요. 
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.8}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up">
                함께 더 좋은 메모 공간을 만들어가고 싶습니다.
              </p>
            </FadeInOnScroll>
            <br />
            <br />
            <FadeInOnScroll delay={0.8}>
              <p className="text-lg text-gray-700 leading-relaxed fade-in-up text-center">
                Team Girlz Night
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </section>
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
              .fade-in-up {
              opacity-0 translate-y-4 transition-all duration-700 ease-out;
            }

            .fade-in-up.appear {
              opacity-100 translate-y-0;
            }
            
            .fadeSlide {
              1s cubic-bezier(0.22, 1, 0.36, 1) forwards
            }

            html {
              background-color: #fcfcf8;
            }

          `}
        </style>
    </div>
  );
}

export default Home;
