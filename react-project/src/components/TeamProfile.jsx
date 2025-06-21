import React, { useState, useRef, useEffect } from 'react';

function TeamProfile({ initialProfile, onSave, onDelete, isAdmin }) {
  // props로 초기 데이터를 받거나, 없으면 기본값 사용
  const [profile, setProfile] = useState(
    initialProfile || {
      name: "새 팀원",
      description: "역할을 입력하세요",
      imageSrc: null,
    }
  );

  const fileInputRef = useRef(null);
  const descriptionTextareaRef = useRef(null);

  // 저장(확인) 버튼 핸들러
  const handleSave = () => {
    const url = `http://localhost:5000/team_profiles/${profile.id}`;
    fetch(url, {
      method: 'PUT', // 기존 데이터를 덮어쓰는 PUT 메소드 사용
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
    .then(response => response.json())
    .then(updatedProfile => {
      alert('저장되었습니다!');
      if (onSave) {
        onSave(updatedProfile); // 부모 컴포넌트에 저장된 데이터 전달
      }
    })
    .catch(error => console.error('Error saving profile:', error));
  };

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    if (window.confirm("정말로 이 프로필을 삭제하시겠습니까?")) {
      const url = `http://localhost:5000/team_profiles/${profile.id}`;
      fetch(url, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          alert('삭제되었습니다!');
          if (onDelete) {
            onDelete(profile.id); // 부모 컴포넌트에 삭제된 id 전달
          }
        } else {
          throw new Error('삭제에 실패했습니다.');
        }
      })
      .catch(error => console.error('Error deleting profile:', error));
    }
  };

  // 이미지 업로드 input 클릭 (관리자만 가능)
  const handleImageClick = () => {
    if (isAdmin) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 시 이미지 변경
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, imageSrc: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 이름, 설명 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  // 설명(textarea) 높이 자동 조절
  useEffect(() => {
    if (descriptionTextareaRef.current) {
      const textarea = descriptionTextareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [profile.description]);

  return (
    <div className="flex flex-col items-center p-4 w-60 mx-auto border rounded-lg shadow-sm min-h-[380px]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={!isAdmin}
      />

      <div
        className={`relative w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center shadow-md ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={handleImageClick}
      >
        {profile.imageSrc ? (
          <img src={profile.imageSrc} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">사진 업로드</span>
        )}
      </div>

      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="이름"
        className="text-xl font-bold text-center w-full bg-transparent border-none outline-none focus:ring-0 mb-1"
        readOnly={!isAdmin}
      />

      <textarea
        ref={descriptionTextareaRef}
        name="description"
        value={profile.description}
        onChange={handleChange}
        placeholder="내용"
        className="text-base text-center text-gray-700 w-full bg-transparent border-none outline-none focus:ring-0 resize-none overflow-hidden leading-snug"
        rows={1}
        readOnly={!isAdmin}
      />

      {/* 관리자일 때만 버튼 그룹 보이기 */}
      {isAdmin && (
        <div className="flex gap-2 mt-auto pt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamProfile;