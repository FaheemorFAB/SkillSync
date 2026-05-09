import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Maximize, AlertTriangle, Send } from 'lucide-react';

export default function ExamEnvironment() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [code, setCode] = useState('// Write your solution here...');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && isFullscreen) {
        setWarnings(w => w + 1);
        alert("Warning: You exited fullscreen. This is recorded by the Anti-Cheat system.");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(w => w + 1);
        alert("Integrity Violation: Tab switching detected.");
      }
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy/Paste is disabled in the proctored environment.");
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [isFullscreen]);

  const requestFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  const submitTest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Test submitted successfully. Our AI is evaluating your code.");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      navigate('/leaderboard');
    }, 2000);
  };

  if (!isFullscreen && warnings === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
        <ShieldAlert size={64} className="text-accent mb-6" />
        <h2 className="text-3xl font-bold mb-4">Proctored Environment</h2>
        <p className="text-gray-600 mb-8">
          This challenge requires fullscreen mode. Navigating away, switching tabs, or copying/pasting will be recorded and may result in an automatic failure.
        </p>
        <button 
          onClick={requestFullscreen}
          className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Maximize /> Enter Fullscreen to Start
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white min-h-screen flex flex-col fixed inset-0 z-[100]">
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">SkillSync Challenge #{challengeId}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Recording Active
          </div>
          {warnings > 0 && (
            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full text-sm font-semibold">
              <AlertTriangle size={16} /> {warnings} Warnings
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex">
        <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Implement a Custom GSAP Hook</h2>
          <div className="prose prose-sm">
            <p>Create a custom React hook `useGsapAnimation` that takes a ref and an animation configuration object, and plays the animation on mount.</p>
            <h3 className="font-bold mt-4 mb-2">Requirements:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Must clean up animation on unmount.</li>
              <li>Should use `gsap.context()` for React 18 strict mode safety.</li>
              <li>Handle window resize events if configured.</li>
            </ul>
          </div>
        </div>
        <div className="w-2/3 flex flex-col bg-gray-50 p-6">
          <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden flex flex-col">
            <div className="bg-gray-800 px-4 py-2 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent text-green-400 font-mono p-4 resize-none focus:outline-none"
              spellCheck="false"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={submitTest}
              disabled={isSubmitting}
              className="bg-accent text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Evaluating...' : <><Send size={18} /> Submit Solution</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
