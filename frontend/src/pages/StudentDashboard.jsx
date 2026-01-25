import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { Clock, MapPin, User, ArrowRight, Download } from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
  const [data, setData] = useState({ nextSession: null, recentResources: [] });
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${user.id}/dashboard`);
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    if(user.id) fetchDashboard();
  }, [user.id]);

  return (
    <StudentLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- PROCHAINE SÉANCE (2/3) --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
            
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[4px] mb-6">Prochaine Séance</h3>
            
            {data.nextSession ? (
              <div className="space-y-6">
                <h1 className="text-4xl font-black text-slate-800 leading-tight">
                  {data.nextSession.ue.nom}
                  <span className="block text-blue-600 italic text-2xl">{data.nextSession.ue.code}</span>
                </h1>
                
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                    <Clock className="text-blue-500" size={20}/>
                    <span className="font-black text-slate-700 text-sm italic">{data.nextSession.jour} • {data.nextSession.plageHoraire}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                    <MapPin className="text-red-500" size={20}/>
                    <span className="font-black text-slate-700 text-sm uppercase">{data.nextSession.salle.nom}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-8">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white font-bold">
                    {data.nextSession.ue.enseignant.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Enseignant</p>
                    <p className="text-slate-800 font-bold">{data.nextSession.ue.enseignant.nom}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 font-bold italic py-10 text-center">Aucun cours programmé prochainement.</p>
            )}
          </div>
        </div>

        {/* --- SUPPORTS RÉCENTS (1/3) --- */}
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest underline decoration-blue-500 decoration-4 underline-offset-4">Récemment publié</h3>
            <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Voir tout</button>
          </div>

          <div className="space-y-4">
            {data.recentResources.length > 0 ? data.recentResources.map((res, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-all shadow-sm">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20}/>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-black text-slate-800 truncate">{res.nom}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">{res.ue.code}</p>
                  </div>
                </div>
                <a 
                  href={`http://localhost:5000/${res.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-slate-300 hover:text-blue-600 transition-all"
                >
                  <Download size={18}/>
                </a>
              </div>
            )) : <p className="text-slate-300 italic text-center py-10">Aucun document disponible.</p>}
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;