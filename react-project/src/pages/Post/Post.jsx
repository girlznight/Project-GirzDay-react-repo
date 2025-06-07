import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import SidebarToggleButton from "../../components/SidebarToggleButton";

function Post() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SidebarToggleButton onClick={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* 나머지 메인 컨텐츠 */}
    </>
  );
}

export default Post;
