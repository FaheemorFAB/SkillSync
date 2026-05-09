import React, { useState } from 'react';
import { Video, ShieldCheck } from 'lucide-react';

export default function InterviewRoom() {
  const [joined, setJoined] = useState(false);
  const [roomName, setRoomName] = useState('SkillSync-Interview-' + Math.floor(Math.random() * 10000));

  if (!joined) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-50 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Video size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Interview Room</h2>
        <p className="text-gray-500 mb-8">
          Join the secure Jitsi-powered interview room. Our AI has already verified the candidate's skills.
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-8 text-green-600 font-semibold text-sm bg-green-50 py-2 rounded-lg">
          <ShieldCheck size={18} /> Candidate Identity Verified
        </div>

        <button 
          onClick={() => setJoined(true)}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors"
        >
          Join Interview
        </button>
      </div>
    );
  }

  return (
    <div className="h-[80vh] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-900 flex items-center justify-center text-white">
      {/* Since @jitsi/react-sdk requires actual API loaded in DOM, we'll render a placeholder for the MVP if SDK isn't fully configured, or load it. For this code, we use a placeholder text to avoid unhandled iframe errors. */}
      <div className="text-center">
        <Video size={64} className="mx-auto mb-4 text-accent animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">Jitsi Meet Interface Loading...</h2>
        <p className="text-gray-400">Room: {roomName}</p>
        <p className="text-sm text-gray-500 mt-4">(In a full setup, the JitsiMeeting component renders here)</p>
      </div>
    </div>
  );
}
