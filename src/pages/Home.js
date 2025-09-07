import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created a new room");
    console.log("Creating a new room with ID:", id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedRoom = roomId.trim();
    const trimmedUser = username.trim();
    if (!trimmedRoom || !trimmedUser) {
      toast.error("Room ID and Username are required!");
      return;
    }
    navigate(`/editor/${trimmedRoom}`, { state: { username: trimmedUser } });
    console.log("Joining Room:", trimmedRoom, "as", trimmedUser);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <Toaster position="top-center" />
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-6">Code Sync</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-400 text-gray-900 font-bold hover:bg-green-500 transition duration-300"
          >
            Join
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          Don’t have a room?{" "}
          <button
            className="text-green-400 hover:underline"
            onClick={createNewRoom}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default Home;
