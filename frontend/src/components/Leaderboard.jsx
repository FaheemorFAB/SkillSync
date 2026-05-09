import React, { useEffect, useState } from 'react';
import { Trophy, Star, TrendingUp } from 'lucide-react';
// import { supabase } from '../supabaseClient'; // Mocked for MVP local dev

export default function Leaderboard() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Johnson', score: 985, sector: 'Backend', rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: 2, name: 'Sarah Chen', score: 942, sector: 'Frontend', rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 3, name: 'Mike Peters', score: 890, sector: 'Data', rank: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 4, name: 'Elena Rodriguez', score: 855, sector: 'Cyber', rank: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  ]);

  /* 
  // Real implementation for Supabase
  useEffect(() => {
    const subscription = supabase
      .channel('public:scores')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'scores' }, payload => {
          fetchLeaderboard();
      })
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);
  */

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
        
        <h2 className="flex items-center gap-3 text-3xl font-bold text-primary mb-8 relative z-10">
          <Trophy className="text-yellow-500" size={36} /> 
          Global Talent Rank
          <span className="ml-auto text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live
          </span>
        </h2>

        <div className="space-y-4 relative z-10">
          {users.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex items-center gap-4 p-4 rounded-xl border ${index === 0 ? 'border-yellow-200 bg-yellow-50/50' : 'border-gray-100 bg-gray-50/50 hover:bg-white'} transition-colors`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-700'}`}>
                #{user.rank}
              </div>
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white" />
              <div className="flex-1">
                <h4 className="font-bold text-lg">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.sector} Specialist</p>
              </div>
              <div className="text-right">
                <div className="font-black text-2xl text-primary">{user.score}</div>
                <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500"/> Score
                </div>
              </div>
              {index < 3 && (
                <button className="ml-4 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors hidden md:block">
                  Invite to Interview
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
