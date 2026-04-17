import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Forums from "./pages/Forums";
import Discussion from "./pages/Discussion";
import Signup from "./pages/Signup";

import "./stylesheets/App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forum/:forum_id" element={<Forum />} />
        <Route path="/discussion/:discussion_id" element={<Discussion />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
