import React, { useState, useRef, useEffect } from 'react';

function JapanProgramDetail({ initialData, onSave, onDelete, isAdmin }) {
  const [program, setProgram] = useState(
    initialData || {
      title: "새 프로그램",
      description: "내용을 입력하세요.",
      imageSrc: null,
    }
  );

  const fileInputRef = useRef(null);
  const descriptionTextareaRef = useRef(null);

  const handleSave = () => {
    const url = `http://localhost:5000/japan_programs/${program.id}`;
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    })
    .then(res => {
      if (!res.ok) throw new Error('저장에 실패했습니다.');
      return res.json();
    })
    .then(updated => {
      alert('저장되었습니다!');
      if (onSave) onSave(updated);
    })
    .catch(error => {
      console.error("프로그램 저장 중 오류 발생:", error);
      alert("오류가 발생하여 저장하지 못했습니다.");
    });
  };

  const handleDelete = () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    const url = `http://localhost:5000/japan_programs/${program.id}`;
    fetch(url, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('삭제에 실패했습니다.');
      alert('삭제되었습니다!');
      if (onDelete) onDelete(program.id);
    })
    .catch(error => {
      console.error("프로그램 삭제 중 오류 발생:", error);
      alert("오류가 발생하여 삭제하지 못했습니다.");
    });
  };

  const handleImageClick = () => {
    if (isAdmin) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProgram(p => ({ ...p, imageSrc: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgram(p => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    if (descriptionTextareaRef.current) {
      const textarea = descriptionTextareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [program.description]);

  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-sm bg-white w-full max-w-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={!isAdmin}
      />
      <div
        className={`w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center ${isAdmin ? 'cursor-pointer' : ''}`}
        onClick={handleImageClick}
      >
        {program.imageSrc ? (
          <img src={program.imageSrc} alt={program.title} className="w-full h-full object-cover rounded-md" />
        ) : (
          <span className="text-gray-500">사진 업로드</span>
        )}
      </div>
      <input
        type="text"
        name="title"
        value={program.title}
        onChange={handleChange}
        placeholder="제목"
        className="text-2xl font-bold w-full bg-transparent border-none outline-none focus:ring-0 mb-2"
        readOnly={!isAdmin}
      />
      <textarea
        ref={descriptionTextareaRef}
        name="description"
        value={program.description}
        onChange={handleChange}
        placeholder="내용"
        className="text-base text-gray-700 w-full bg-transparent border-none outline-none focus:ring-0 resize-none overflow-hidden leading-relaxed"
        rows={1}
        readOnly={!isAdmin}
      />
      {isAdmin && (
        <div className="flex gap-2 mt-auto pt-4">
          <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
            Confirm
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default JapanProgramDetail;
