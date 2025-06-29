import './index.css';

import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home/Home"; 
import Post from "./pages/Post/Post";
import Register from "./pages/Register/Register";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Login from "./pages/Login/Login";
import PostEdit from "./pages/PostEdit/PostEdit";
import PostCreate from "./pages/PostCreate/PostCreate";
import OurTeam from "./pages/OurTeam/OurTeam";
import JapanProgram from "./pages/JapanProgram/JapanProgram";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/edit/:id" element={<PostEdit />} />
        <Route path="/post/create" element={<PostCreate />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/program-introduce" element={<JapanProgram />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;