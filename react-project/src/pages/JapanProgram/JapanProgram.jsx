import React, { useState, useEffect, useRef } from 'react';
import JapanProgramDetail from '../../components/JapanProgramDetail';
import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";

function JapanProgram() {
  const [programs, setPrograms] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSide, setShowSide] = useState(false);
  const sidebarRef = useRef(null);

  // 관리자 여부 및 데이터 로딩
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId === '1' || currentUserId === '2') {
      setIsAdmin(true);
    }

    fetch('http://localhost:5000/japan_programs')
      .then(res => {
        if (!res.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPrograms(data);
        } else {
          console.error("오류: 받아온 데이터가 배열이 아닙니다.", data);
          setPrograms([]); // 데이터가 배열이 아닐 경우, 에러 방지를 위해 빈 배열로 설정
        }
      })
      .catch(error => {
        console.error("프로그램 정보를 가져오는 중 오류 발생:", error);
        setPrograms([]); // 에러 발생 시 빈 배열로 설정
      });
  }, []);

  // 사이드바 외부 클릭 핸들러
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 저장 후 상태 업데이트
  const handleSave = (updatedProgram) => {
    setPrograms(current => 
      current.map(p => p.id === updatedProgram.id ? updatedProgram : p)
    );
  };

  // 삭제 후 상태 업데이트
  const handleDelete = (idToDelete) => {
    setPrograms(current => current.filter(p => p.id !== idToDelete));
  };

  // 새 프로그램 추가
  const handleAdd = () => {
    const newProgram = {
      title: "새 프로그램",
      description: "내용을 입력하세요.",
      imageSrc: null,
    };

    fetch('http://localhost:5000/japan_programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProgram),
    })
    .then(res => {
      if (!res.ok) throw new Error('프로그램 추가에 실패했습니다.');
      return res.json();
    })
    .then(added => {
      setPrograms(current => [...current, added]);
      alert('새 프로그램 카드가 추가되었습니다!');
    })
    .catch(error => {
      console.error("프로그램 추가 중 오류 발생:", error);
      alert("오류가 발생하여 프로그램을 추가하지 못했습니다.");
    });
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 mt-10 text-gray-900 text-center">
        현지학기제 프로그램
      </h1>

      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {programs.map(program => (
            <JapanProgramDetail 
              key={program.id} 
              initialData={program}
              onSave={handleSave}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
          
          {isAdmin && (
            <div className="flex items-center justify-center w-full max-w-sm min-h-[420px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <button
                onClick={handleAdd}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Add new program"
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

export default JapanProgram;
