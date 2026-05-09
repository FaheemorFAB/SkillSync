import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Server, Database, Cloud, Shield } from 'lucide-react';

const categories = [
  { id: 'frontend', name: 'Web Dev: Frontend', icon: <Code2 className="text-blue-500" size={32} /> },
  { id: 'backend', name: 'Web Dev: Backend', icon: <Server className="text-green-500" size={32} /> },
  { id: 'data', name: 'Data Science & AI', icon: <Database className="text-purple-500" size={32} /> },
  { id: 'cloud', name: 'Cloud & DevOps', icon: <Cloud className="text-cyan-500" size={32} /> },
  { id: 'cyber', name: 'Cybersecurity', icon: <Shield className="text-red-500" size={32} /> },
];

export default function Dashboard() {
  const [challenges, setChallenges] = useState([]);
  const [activeCategory, setActiveCategory] = useState('frontend');

  useEffect(() => {
    // Mock fetching challenges from our FastAPI backend
    const mockChallenges = {
      frontend: [
        { id: 1, title: 'Implement a Custom GSAP Hook', difficulty: 'Medium', timeLimit: 45 },
        { id: 2, title: 'State Management Race Conditions', difficulty: 'Hard', timeLimit: 60 }
      ],
      backend: [
        { id: 3, title: 'Optimize SQL Recursive Queries', difficulty: 'Hard', timeLimit: 60 },
        { id: 4, title: 'Build a Rate Limiter Middleware', difficulty: 'Medium', timeLimit: 45 }
      ]
    };
    setChallenges(mockChallenges[activeCategory] || []);
  }, [activeCategory]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-4xl font-bold mb-8">Industry Challenges</h2>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center p-6 min-w-[160px] rounded-xl border-2 transition-all ${activeCategory === cat.id ? 'border-accent bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
          >
            {cat.icon}
            <span className="mt-3 font-semibold text-sm text-center">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.length > 0 ? challenges.map(chal => (
          <div key={chal.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{chal.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${chal.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {chal.difficulty}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Time Limit: {chal.timeLimit} mins</p>
            <Link to={`/exam/${chal.id}`} className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
              Start Challenge
            </Link>
          </div>
        )) : (
          <div className="col-span-2 text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            No challenges available for this sector right now.
          </div>
        )}
      </div>
    </div>
  );
}
