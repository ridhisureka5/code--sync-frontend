import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

// connect to backend
const socket = io("http://localhost:9000");

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#4BB543",
              color: "#fff",
            },
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<Editor socket={socket} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
