import React, { useState } from 'react'
import { Video, Plus, Copy, ExternalLink, Clock, User, CheckCircle, X } from 'lucide-react'
import toast from '../../lib/toast.jsx'

const MOCK_ROOMS = [
  { id: '1', candidate: 'Alex Johnson', challenge: 'Real-Time Dashboard', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', score: 985, status: 'scheduled', scheduled_at: '2026-05-10T14:00:00', room_name: 'skillsync-room-alex-1715' },
  { id: '2', candidate: 'James Liu', challenge: 'FastAPI Microservice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', score: 920, status: 'active', room_name: 'skillsync-room-james-9823' },
]

function JitsiRoom({ roomName, onClose }) {
  const jitsiUrl = `https://meet.jit.si/${roomName}`
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '900px', width: '95vw' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Interview Room</h3>
            <p className="text-xs text-gray-500 font-mono">{roomName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard.writeText(jitsiUrl); toast.success('Link copied!') }}
              className="btn btn-secondary btn-sm gap-2"><Copy size={13} /> Copy Link</button>
            <button onClick={onClose} className="btn btn-secondary btn-sm"><X size={15} /></button>
          </div>
        </div>

        {/* Jitsi iframe */}
        <div className="jitsi-container">
          <iframe
            src={`https://meet.jit.si/${roomName}#userInfo.displayName="Interviewer"&config.startWithVideoMuted=false&config.startWithAudioMuted=false&interfaceConfig.SHOW_JITSI_WATERMARK=false`}
            allow="camera; microphone; fullscreen; display-capture"
            width="100%" height="100%"
            style={{ border: 'none', borderRadius: '16px' }}
            title="Interview Room"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">Share this link with your candidate to join</p>
          <a href={jitsiUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm gap-2">
            <ExternalLink size={13} /> Open in new tab
          </a>
        </div>
      </div>
    </div>
  )
}

export default function InterviewRoomsPage() {
  const [rooms, setRooms] = useState(MOCK_ROOMS)
  const [activeRoom, setActiveRoom] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newCandidate, setNewCandidate] = useState('')

  const createRoom = () => {
    if (!newCandidate.trim()) return
    const roomName = `skillsync-${newCandidate.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`
    const room = { id: Date.now().toString(), candidate: newCandidate, challenge: 'Open Interview', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newCandidate}`, score: null, status: 'scheduled', room_name: roomName }
    setRooms(r => [room, ...r])
    setNewCandidate('')
    setCreating(false)
    toast.success(`Room created for ${newCandidate}`)
    setActiveRoom(room)
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Rooms</h1>
            <p className="text-gray-400 text-sm mt-1">1-click Jitsi Meet video interviews with top candidates</p>
          </div>
          <button onClick={() => setCreating(true)} className="btn btn-primary">
            <Plus size={16} /> New Room
          </button>
        </div>
      </div>

      <div className="page-body space-y-4">
        {creating && (
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-3">Create Interview Room</h3>
            <div className="flex gap-3">
              <input className="input flex-1" placeholder="Candidate name..." value={newCandidate} onChange={e => setNewCandidate(e.target.value)} onKeyDown={e => e.key === 'Enter' && createRoom()} autoFocus />
              <button onClick={createRoom} className="btn btn-primary">Create</button>
              <button onClick={() => setCreating(false)} className="btn btn-secondary"><X size={15} /></button>
            </div>
          </div>
        )}

        {rooms.map(room => (
          <div key={room.id} className="card p-5 flex items-center gap-4">
            <img src={room.avatar} alt={room.candidate} className="w-12 h-12 rounded-full border border-white/10" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-white">{room.candidate}</h3>
                <span className="badge" style={{
                  background: room.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
                  color: room.status === 'active' ? '#10B981' : '#818CF8',
                }}>
                  {room.status === 'active' && <span className="live-dot mr-1" style={{ width: 6, height: 6 }} />}
                  {room.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{room.challenge}</p>
              {room.score && <p className="text-xs text-indigo-400 mt-0.5">Score: {room.score} pts</p>}
              {room.scheduled_at && (
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> {new Date(room.scheduled_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => { navigator.clipboard.writeText(`https://meet.jit.si/${room.room_name}`); toast.success('Link copied!') }}
                className="btn btn-secondary btn-sm gap-2">
                <Copy size={12} /> Copy Link
              </button>
              <button onClick={() => setActiveRoom(room)} className="btn btn-primary btn-sm gap-2">
                <Video size={13} /> Join Room
              </button>
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="text-center py-16 text-gray-500 card">
            <Video size={40} className="mx-auto mb-3 opacity-30" />
            <p>No interview rooms yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {activeRoom && <JitsiRoom roomName={activeRoom.room_name} onClose={() => setActiveRoom(null)} />}
    </div>
  )
}
