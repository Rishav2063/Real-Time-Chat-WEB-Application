import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatpage from "./pages/Chatpage/index.js";
import Textchat from "./pages/Textchat/index.js";
import Groupcreat from "./pages/Groupcreate/index.js";
import Login from "./pages/Login/index.js";
import Signup from "./pages/Signup/index.js";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatpage/>} />
        <Route path="/textchat" element={<Textchat/>}/>
        <Route path='/groupcreate' element={<Groupcreat/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
  );
};

export default AppRouter;