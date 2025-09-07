import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:9000";

const Editor = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || "Guest";

  const socketRef = useRef(null);
  const [code, setCode] = useState(`// Welcome ${username}, start coding...\n`);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // connect socket
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    // ✅ must match server.js event
    socketRef.current.emit("join-room", { roomId, username });

    // receive code updates
    socketRef.current.on("code-sync", (incoming) => {
      setCode(incoming);
    });

    // receive user list updates
    socketRef.current.on("user-list", (list) => {
      setUsers(list);
    });

    // cleanup
    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [roomId, username]);

  const handleChange = (value) => {
    setCode(value); // update local immediately
    if (socketRef.current) {
      socketRef.current.emit("code-change", { roomId, code: value });
    }
  };

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col p-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold text-green-400 mb-6">Code Sync</h2>

        <div className="flex-1 overflow-y-auto">
          <p className="text-gray-400 text-sm mb-2">Connected</p>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">
                  {u.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm">{u.username || "User"}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="mt-6 w-full py-2 rounded-lg bg-green-500 text-gray-900 font-semibold hover:bg-green-400 transition"
          onClick={() => {
            navigator.clipboard.writeText(roomId).then(() => {
              toast.success("Room ID copied!");
            });
          }}
        >
          Copy ROOM ID
        </button>

        <button
          className="mt-2 w-full py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition"
          onClick={handleLeave}
        >
          Leave
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4">
        <div className="h-full w-full bg-gray-700 rounded-lg shadow-inner p-4">
          <h1 className="text-xl text-gray-300 mb-4 break-all">Room: {roomId}</h1>
          <CodeMirror
            value={code}
            height="100%"
            theme={githubDark}
            extensions={[javascript({ jsx: true })]}
            onChange={handleChange}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
