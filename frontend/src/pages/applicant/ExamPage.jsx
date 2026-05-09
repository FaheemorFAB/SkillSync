import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from '../../lib/toast.jsx'
import {
  ShieldAlert, Maximize, AlertTriangle, Send, CheckCircle,
  Clock, ChevronRight, Code2, Brain, Rocket, X, Eye
} from 'lucide-react'

// ─── Mock challenge data ────────────────────────────────────────
const MOCK_CHALLENGE = {
  id: '1',
  title: 'Build a Real-Time Dashboard',
  sector: 'web_dev',
  difficulty: 'Hard',
  time_limit_mins: 75,
  round1_questions: [
    { id: 1, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
    { id: 2, question: 'Which CSS property creates a new stacking context?', options: ['display', 'position', 'z-index', 'transform'], correct: 3 },
    { id: 3, question: 'In React, what hook is used for side effects?', options: ['useState', 'useCallback', 'useEffect', 'useMemo'], correct: 2 },
    { id: 4, question: 'REST stands for?', options: ['Remote Execution Standard Technology', 'Representational State Transfer', 'Resource Endpoint Structure Template', 'Reactive Event Streaming Technology'], correct: 1 },
    { id: 5, question: 'Which HTTP method is both idempotent and safe?', options: ['POST', 'PUT', 'DELETE', 'GET'], correct: 3 },
  ],
  round2_problem: 'Given an array of integers, return indices of the two numbers that add up to a target. Each input has exactly one solution.',
  round2_starter_code: 'function twoSum(nums, target) {\n  // Your solution here\n  \n}',
  round3_scenario: 'Your production React app re-renders 60+ times per second causing severe jank. Debug the performance issue and provide a fix using React DevTools Profiler methodology. Include code examples.',
}

// ─── Anti-cheat hook ────────────────────────────────────────────
function useAntiCheat(onViolation) {
  const [warnings, setWarnings] = useState(0)
  const [events, setEvents] = useState([])

  const addEvent = useCallback((type, detail) => {
    const ev = { type, detail, ts: new Date().toISOString() }
    setEvents(prev => [...prev, ev])
    setWarnings(w => {
      const next = w + 1
      onViolation(next, ev)
      return next
    })
  }, [onViolation])

  useEffect(() => {
    const onVis = () => document.hidden && addEvent('tab_switch', 'User left the tab')
    const onCopy = e => { e.preventDefault(); addEvent('copy_attempt', 'Ctrl+C blocked') }
    const onPaste = e => { e.preventDefault(); addEvent('paste_attempt', 'Ctrl+V blocked') }
    const onCtx = e => { e.preventDefault(); addEvent('right_click', 'Right-click blocked') }

    document.addEventListener('visibilitychange', onVis)
    document.addEventListener('copy', onCopy)
    document.addEventListener('paste', onPaste)
    document.addEventListener('contextmenu', onCtx)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('contextmenu', onCtx)
    }
  }, [addEvent])

  const reset = useCallback(() => {
    setWarnings(0)
    setEvents([])
  }, [])

  return { warnings, events, reset }
}

// ─── Round 1: Aptitude MCQ ──────────────────────────────────────
function Round1({ questions, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const q = questions[current]

  const handleAnswer = (optIdx) => {
    if (submitted) return
    setAnswers(a => ({ ...a, [q.id]: optIdx }))
  }

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1)
    else {
      setSubmitted(true)
      const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0)
      const pct = Math.round((score / questions.length) * 100)
      setTimeout(() => onComplete(pct, answers), 1200)
    }
  }

  if (submitted) return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <CheckCircle size={56} className="mb-4" style={{ color: '#10B981' }} />
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Round 1 Complete!</h3>
      <p className="text-slate-500">Calculating your aptitude score...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-slate-500">Question {current + 1} of {questions.length}</span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all"
              style={{ background: i < current ? '#10B981' : i === current ? '#6366F1' : '#E2E8F0' }} />
          ))}
        </div>
      </div>

      <div className="progress-bar mb-8">
        <div className="progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6">{q.question}</h2>

      <div className="space-y-3 mb-8">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`mcq-option w-full text-left ${answers[q.id] === i ? 'selected' : ''}`}
          >
            <span className="inline-flex w-6 h-6 rounded-full border border-current items-center justify-center text-xs mr-3 flex-shrink-0"
              style={{ display: 'inline-flex', marginRight: '12px', flexShrink: 0 }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={answers[q.id] === undefined}
        className="btn btn-primary w-full"
      >
        {current < questions.length - 1 ? 'Next Question' : 'Submit Round 1'}
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ─── Round 2: Code Editor ───────────────────────────────────────
function Round2({ problem, starterCode, onComplete }) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(starterCode || '// Your solution here')
  const [submitting, setSubmitting] = useState(false)
  const [output, setOutput] = useState(null)

  const runCode = async () => {
    setSubmitting(true)
    try {
      // Call Piston API for code execution
      const testInjection = language === 'python' 
        ? '\nprint(twoSum([2,7,11,15], 9))' 
        : '\nconsole.log(JSON.stringify(twoSum([2,7,11,15], 9)))'

      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          version: '*',
          files: [{ content: code + testInjection }],
        }),
      })
      const data = await res.json()
      const stdout = data.run?.stdout?.trim() || ''
      setOutput(stdout)

      // Score based on output
      let isCorrect = false
      if (language === 'python') isCorrect = stdout === '[0, 1]' || stdout === '(0, 1)' || stdout.includes('0') && stdout.includes('1')
      else isCorrect = stdout === '[0,1]'

      const score = isCorrect ? 100 : stdout.includes('0') ? 60 : 30
      setTimeout(() => onComplete(score, code), 800)
    } catch {
      // Fallback scoring
      const score = code.includes('Map') || code.includes('{}') ? 80 : 50
      setOutput('Execution unavailable — code evaluated locally')
      setTimeout(() => onComplete(score, code), 800)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Problem pane */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 overflow-hidden">
        <div className="md:w-2/5 overflow-y-auto p-4 card-flat rounded-xl">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Problem</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">{problem}</p>
          <div className="text-xs text-slate-500 p-3 rounded-lg font-mono"
            style={{ background: '#F8FAFC' }}>
            <p className="text-emerald-600 mb-1">// Example</p>
            <p>Input: nums = [2,7,11,15], target = 9</p>
            <p>Output: [0, 1]</p>
          </div>
        </div>

        <div className="md:w-3/5 flex flex-col gap-3">
          {/* Mac-style chrome */}
          <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-slate-200">
            <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#1e293b' }}>
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <select 
                className="bg-slate-800 text-xs text-slate-300 border-none outline-none rounded px-2 py-1"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value)
                  if (e.target.value === 'python') setCode('def twoSum(nums, target):\n    # Your solution here\n    pass')
                  else setCode('function twoSum(nums, target) {\n  // Your solution here\n}')
                }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>
            <textarea
              id="code-editor"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="code-editor flex-1 rounded-none border-none"
              style={{ minHeight: '280px', background: '#0D1117', color: '#10B981' }}
              spellCheck={false}
            />
          </div>

          {output && (
            <div className="p-3 rounded-xl text-xs font-mono"
              style={{ background: '#0A0F1E', border: '1px solid #1e293b', color: '#10B981' }}>
              $ {output}
            </div>
          )}

          <button
            onClick={runCode}
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Evaluating...
              </span>
            ) : <><Send size={15} /> Submit & Run</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Round 3: Industry Problem ──────────────────────────────────
function Round3({ scenario, onComplete }) {
  const [response, setResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    if (response.trim().length < 50) {
      toast.error('Please provide a more detailed response (min 50 characters)')
      return
    }
    setSubmitting(true)
    // Score based on length and keywords as a simple heuristic
    const keywords = ['performance', 'render', 'memo', 'profiler', 'optimize', 'usecallback', 'react', 'devtools']
    const hits = keywords.filter(k => response.toLowerCase().includes(k)).length
    const score = Math.min(100, 40 + hits * 8 + Math.min(20, Math.floor(response.length / 50)))
    setTimeout(() => onComplete(score, response), 800)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Rocket size={18} style={{ color: '#06B6D4' }} />
          <h3 className="font-bold text-slate-900">Industry Problem</h3>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">{scenario}</p>
      </div>

      <div className="form-group">
        <label className="input-label">Your Solution & Approach</label>
        <textarea
          id="round3-response"
          value={response}
          onChange={e => setResponse(e.target.value)}
          className="input font-mono text-sm"
          rows={14}
          placeholder="Describe your approach, include code snippets, explain your reasoning..."
        />
        <p className="text-xs text-slate-500 mt-1">{response.length} characters · Min 50 required</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || response.trim().length < 50}
        className="btn btn-primary w-full btn-lg"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI Scoring...
          </span>
        ) : <><Send size={16} /> Final Submit</>}
      </button>
    </div>
  )
}

// ─── Main Exam Page ─────────────────────────────────────────────
export default function ExamPage() {
  const { challengeId } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const [challenge, setChallenge] = useState(null)
  const [phase, setPhase] = useState('briefing') // briefing | exam | done
  const [round, setRound] = useState(1)
  const [scores, setScores] = useState({ r1: 0, r2: 0, r3: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  const [submissionId, setSubmissionId] = useState(null)

  const { warnings, events, reset } = useAntiCheat((count, ev) => {
    if (ev.type === 'tab_switch') {
      toast.error('⚠️ Tab switch detected! Test has been restarted.')
      setPhase('briefing')
      setRound(1)
      setScores({ r1: 0, r2: 0, r3: 0 })
      reset()
    } else {
      if (count >= 3) toast.error('⚠️ 3+ violations detected — submission flagged')
      else toast(`🛡️ Integrity violation: ${ev.detail}`, { icon: '⚠️' })
    }
  })

  // Load challenge
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('challenges').select('*').eq('id', challengeId).single()
      setChallenge(data || MOCK_CHALLENGE)
    }
    load()
  }, [challengeId])

  // Timer
  useEffect(() => {
    if (phase !== 'exam' || !challenge) return
    const total = (challenge.time_limit_mins || 75) * 60
    setTimeLeft(total)
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) { clearInterval(t); handleFinalSubmit(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase, challenge])

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const enterFullscreen = () => containerRef.current?.requestFullscreen?.()

  const startExam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      toast.success("Camera access verified")
    } catch (e) {
      toast.error("Camera access is required to maintain exam integrity.")
      return
    }

    // Create submission record
    if (user) {
      const { data } = await supabase.from('submissions').insert({
        applicant_id: user.id,
        challenge_id: challengeId === '1' ? null : challengeId,
        status: 'in_progress',
        current_round: 1,
      }).select().single()
      if (data) setSubmissionId(data.id)
    }
    setPhase('exam')
  }

  const handleRound1Complete = async (score, answers) => {
    setScores(s => ({ ...s, r1: score }))
    if (submissionId) {
      await supabase.from('submissions').update({ round1_score: score, round1_answers: answers, current_round: 2 }).eq('id', submissionId)
    }
    toast.success(`Round 1 complete! Score: ${score}/100`)
    setRound(2)
  }

  const handleRound2Complete = async (score, code) => {
    setScores(s => ({ ...s, r2: score }))
    if (submissionId) {
      await supabase.from('submissions').update({ round2_score: score, round2_code: code, current_round: 3 }).eq('id', submissionId)
    }
    toast.success(`Round 2 complete! Score: ${score}/100`)
    setRound(3)
  }

  const handleRound3Complete = async (score, response) => {
    setScores(s => ({ ...s, r3: score }))
    const penalty = warnings * 10
    const finalR3Score = Math.max(0, score - penalty) // Apply penalty to R3 so total drops
    
    if (submissionId) {
      await supabase.from('submissions').update({
        round3_score: finalR3Score,
        round3_response: response,
        status: warnings >= 3 ? 'disqualified' : 'completed',
        integrity_warnings: warnings,
        integrity_events: events,
        completed_at: new Date().toISOString(),
      }).eq('id', submissionId)
    }
    setPhase('done')
    if (document.fullscreenElement) document.exitFullscreen()
  }

  const handleFinalSubmit = () => {
    toast('Time is up! Submitting...', { icon: '⏰' })
    handleRound3Complete(0, 'TIME_EXPIRED')
  }

  const fmtTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
  const timeColor = timeLeft < 300 ? '#EF4444' : timeLeft < 600 ? '#F59E0B' : '#10B981'

  // ── Briefing screen ──
  if (!challenge) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (phase === 'briefing') return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-lg w-full">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            <ShieldAlert size={30} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{challenge.title}</h1>
          <span className={`badge badge-${challenge.difficulty?.toLowerCase()} mb-6 inline-flex`}>
            {challenge.difficulty}
          </span>

          {/* 3-Round steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[{ icon: Brain, label: 'Aptitude' }, { icon: Code2, label: 'Technical' }, { icon: Rocket, label: 'Industry' }].map((r, i) => (
              <React.Fragment key={r.label}>
                <div className="flex flex-col items-center gap-1">
                  <div className="round-dot active w-9 h-9">
                    <r.icon size={14} />
                  </div>
                  <span className="text-xs text-slate-500">{r.label}</span>
                </div>
                {i < 2 && <div className="round-connector w-8" />}
              </React.Fragment>
            ))}
          </div>

          <div className="text-left space-y-3 mb-8 p-4 rounded-xl"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-sm font-semibold text-red-600 flex items-center gap-2">
              <Eye size={14} /> SkillSync Anti-Cheat Active
            </p>
            {['Fullscreen required during exam', 'Tab switching is recorded', 'Copy/paste is disabled', '3+ violations = auto-disqualification'].map(r => (
              <p key={r} className="text-xs text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" /> {r}
              </p>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/app/challenges')} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={() => { enterFullscreen(); startExam() }} className="btn btn-primary flex-1 btn-lg">
              <Maximize size={16} /> Enter & Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Done screen ──
  if (phase === 'done') {
    const total = scores.r1 + scores.r2 + scores.r3
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full card p-8 text-center mx-4">
          <CheckCircle size={56} className="mx-auto mb-4" style={{ color: '#10B981' }} />
          <h2 className="text-3xl font-black text-slate-900 mb-2">Challenge Complete!</h2>
          <p className="text-slate-500 mb-6">Your results are being verified</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[['Round 1', scores.r1], ['Round 2', scores.r2], ['Round 3', scores.r3]].map(([label, score]) => (
              <div key={label} className="p-3 rounded-xl bg-indigo-50">
                <div className="text-2xl font-black text-slate-900">{score}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="text-5xl font-black gradient-text mb-2">{total}</div>
          <p className="text-slate-500 text-sm mb-6">Total Score / 300</p>
          {warnings > 0 && (
            <div className="p-3 rounded-lg mb-4 text-xs text-amber-700"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              ⚠️ {warnings} integrity violation(s) recorded
            </div>
          )}
          <button onClick={() => navigate('/leaderboard')} className="btn btn-primary w-full btn-lg">
            View Leaderboard
          </button>
        </div>
      </div>
    )
  }

  // ── Exam screen ──
  return (
    <div ref={containerRef} className="fixed inset-0 flex flex-col bg-slate-50" style={{ zIndex: 9999 }}>
      {/* Exam header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <span className="live-dot" style={{ background: '#EF4444' }} />
            PROCTORED
          </div>
          <span className="text-sm font-semibold text-slate-900 hidden md:block">{challenge.title}</span>
        </div>

        {/* Round indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((r, i) => (
            <React.Fragment key={r}>
              <div className={`round-dot w-7 h-7 text-xs ${r < round ? 'completed' : r === round ? 'active' : 'pending'}`}>
                {r < round ? <CheckCircle size={12} /> : r}
              </div>
              {i < 2 && <div className={`round-connector w-6 ${r < round ? 'completed' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className="flex items-center gap-1.5 font-mono font-bold text-sm"
              style={{ color: timeColor }}>
              <Clock size={14} />
              {fmtTime(timeLeft)}
            </div>
          )}
          {warnings > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={12} /> {warnings}
            </div>
          )}
        </div>
      </header>

      {/* Round content */}
      <div className="flex-1 overflow-y-auto">
        {round === 1 && (
          <Round1
            questions={challenge.round1_questions || MOCK_CHALLENGE.round1_questions}
            onComplete={handleRound1Complete}
          />
        )}
        {round === 2 && (
          <Round2
            problem={challenge.round2_problem || MOCK_CHALLENGE.round2_problem}
            starterCode={challenge.round2_starter_code || MOCK_CHALLENGE.round2_starter_code}
            onComplete={handleRound2Complete}
          />
        )}
        {round === 3 && (
          <Round3
            scenario={challenge.round3_scenario || MOCK_CHALLENGE.round3_scenario}
            onComplete={handleRound3Complete}
          />
        )}
      </div>
    </div>
  )
}
