import React, { useState, useEffect, useRef } from 'react';
import TeamProfile from "../../components/TeamProfile";
import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";

function OurTeam() {
  const [team, setTeam] = useState([]);
  const [showSide, setShowSide] = useState(false);
  const sidebarRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 관리자 여부 확인
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    // userId가 1 또는 2일 경우 관리자로 설정
    if (currentUserId === '1' || currentUserId === '2') {
      setIsAdmin(true);
    }
  }, []);

  // 처음 렌더링될 때 db.json에서 팀 프로필 데이터 불러오기
  useEffect(() => {
    fetch('http://localhost:5000/team_profiles')
      .then(res => res.json())
      .then(data => setTeam(data));
  }, []);

  // side bar 외부 클릭 시 닫음
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // TeamProfile 컴포넌트에서 저장 후 호출될 함수
  const handleProfileSave = (updatedProfile) => {
    setTeam(currentTeam => 
      currentTeam.map(member => 
        member.id === updatedProfile.id ? updatedProfile : member
      )
    );
  };

  // 새 프로필 추가 핸들러
  const handleAddProfile = () => {
    const newProfile = {
      name: "새 팀원",
      description: "역할을 입력하세요.",
      imageSrc: null,
    };

    fetch('http://localhost:5000/team_profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    })
    .then(res => res.json())
    .then(addedProfile => {
      setTeam(currentTeam => [...currentTeam, addedProfile]);
      alert('새 프로필이 추가되었습니다!');
    })
    .catch(error => console.error('Error adding profile:', error));
  };

  // 프로필 삭제 핸들러
  const handleProfileDelete = (idToDelete) => {
    setTeam(currentTeam => currentTeam.filter(member => member.id !== idToDelete));
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      {/* 사이드바 및 토글 버튼 */}
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 mt-10 text-gray-900 text-center">
        Introduce our team
      </h1>

      {/* 반응형 그리드 레이아웃 */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {team.map(member => (
            <TeamProfile 
              key={member.id} 
              initialProfile={member}
              onSave={handleProfileSave}
              onDelete={handleProfileDelete}
              isAdmin={isAdmin}
            />
          ))}
          
          {/* 관리자일 때만 프로필 추가 버튼 보이기 */}
          {isAdmin && (
            <div className="flex items-center justify-center w-60 min-h-[380px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <button
                onClick={handleAddProfile}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Add new profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OurTeam;
