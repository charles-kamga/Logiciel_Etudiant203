import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { 
  Clock, MapPin, User, ArrowRight, Download, 
  BookOpen, GraduationCap, Mail, Award, Loader2, AlertCircle 
} from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
  const [data, setData] = useState({ nextSession: null, recentResources: [], classCourses: [] });
  const [loading, setLoading] = useState(true);
  
  // Récupération sécurisée de l'utilisateur
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user.id) return;
      try {
        setLoading(true);
        // Appel à l'API branchée sur la logique temporelle (Semaine Type)
        const res = await axios.get(`http://localhost:5000/api/students/${user.id}/dashboard`);
        
        // CORRECTION : Le console.log doit être ICI, à l'intérieur de la fonction où 'res' est défini
        console.log("DONNÉES REÇUES DU BACKEND :", res.data);
        
        setData(res.data);
      } catch (err) { 
        console.error("Erreur Dashboard:", err); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [user.id]);

  // État de chargement global pour un aspect "Logiciel" pro
  if (loading) {
    return (
      <StudentLayout>
        <div className="h-[80vh] flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
          <p className="font-black text-[10px] uppercase tracking-[4px] italic text-center">
            Synchronisation de votre parcours... <br/>
            <span className="opacity-50 tracking-normal normal-case font-medium">Récupération des données UY1 - ICT</span>
          </p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
        
        {/* --- COLONNE GAUCHE (2/3) --- */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* --- PROCHAINE SÉANCE (Dynamique) --- */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-left relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-blue-500/5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:bg-blue-600/10"></div>
            
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[4px] mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Prochaine Séance à venir
            </h3>
            
            {data.nextSession ? (
              <div className="space-y-8 relative z-10">
                <div className="space-y-2 text-left">
                  <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter italic leading-none">
                    {data.nextSession.ue.nom}
                  </h1>
                  <p className="text-3xl font-black text-blue-600 lowercase italic opacity-80 leading-none">
                    {data.nextSession.ue.code}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-4 bg-blue-50/50 px-6 py-4 rounded-3xl border border-blue-100 transition-colors group-hover:bg-blue-50">
                    <Clock className="text-blue-600" size={24}/>
                    <div className="text-left">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Horaire</p>
                        <p className="font-black text-slate-700 text-sm italic">{data.nextSession.jour} • {data.nextSession.plageHoraire}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-red-50/50 px-6 py-4 rounded-3xl border border-red-100 transition-colors group-hover:bg-red-50">
                    <MapPin className="text-red-500" size={24}/>
                    <div className="text-left">
                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">Localisation</p>
                        <p className="font-black text-slate-700 text-sm uppercase italic">{data.nextSession.salle.nom}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform">
                        {data.nextSession.ue.enseignant.nom.charAt(0)}
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Enseignant titulaire</p>
                        <p className="text-xl font-black text-slate-800 italic uppercase leading-none tracking-tight">{data.nextSession.ue.enseignant.nom}</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                     <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">Session Confirmée</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[30px] bg-slate-50/50">
                <AlertCircle className="text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-black text-sm uppercase tracking-[3px] italic">Aucune séance détectée</p>
                <p className="text-[9px] text-slate-300 font-bold uppercase mt-2 tracking-widest">Le planning de votre classe est peut-être vide</p>
              </div>
            )}
          </div>

          {/* --- MON PROGRAMME & ENSEIGNANTS DÉTAILLÉS --- */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-left">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest underline decoration-blue-500 decoration-4 underline-offset-8">Mon Programme & Corps Enseignant</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 italic tracking-wider leading-none">Semestre 1 • Année Académique 2025/2026</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-300">
                <GraduationCap size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 text-left">
              {data.classCourses && data.classCourses.length > 0 ? data.classCourses.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 rounded-[30px] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50/50 transition-all group relative overflow-hidden">
                  
                  <div className="absolute top-0 right-0 bg-slate-50 px-4 py-1 rounded-bl-2xl text-[9px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {item.code}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all flex-shrink-0 relative">
                        <User size={24} />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                            <Award size={12} />
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.nom}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">
                           <span className="text-blue-600 opacity-70">Dr/Pr.</span> {item.enseignant?.nom || 'Non assigné'}
                        </p>
                        <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
                        <p className="text-[10px] font-bold text-slate-400 italic flex items-center gap-1">
                           <Mail size={10} className="opacity-50" /> {item.enseignant?.email || 'contact@uy1-ict.cm'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <div className="text-right hidden xl:block mr-2">
                        <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1 tracking-tighter">Département</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase italic">Informatique</p>
                    </div>
                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group-hover:scale-105 shadow-sm active:scale-95">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
                  <p className="text-slate-300 font-black italic uppercase text-xs tracking-[4px]">Aucune UE enregistrée</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (SUPPORTS) --- */}
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[2px] underline decoration-blue-500 decoration-4 underline-offset-4 leading-none">Récemment publié</h3>
            <button className="text-[10px] font-black text-blue-600 uppercase hover:tracking-widest transition-all">Voir tout</button>
          </div>

          <div className="space-y-4">
            {data.recentResources && data.recentResources.length > 0 ? data.recentResources.map((res, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center justify-between hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/20 transition-all group cursor-pointer animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={20}/>
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-sm font-black text-slate-800 truncate group-hover:text-blue-600 transition-all tracking-tight leading-tight">{res.nom}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic tracking-tighter mt-1">{res.ue?.code || 'UE'} • SUPPORT DE COURS</p>
                  </div>
                </div>
                <div className="p-2 text-slate-300 group-hover:text-blue-600 group-hover:rotate-12 transition-all">
                  <Download size={20}/>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center bg-white rounded-[35px] border border-slate-100 border-dashed">
                <p className="text-slate-300 italic text-xs font-black uppercase tracking-widest">Documents à venir</p>
              </div>
            )}
          </div>

          {/* Widget Statut Académique */}
          <div className="bg-[#0F172A] p-10 rounded-[45px] text-left relative overflow-hidden shadow-2xl shadow-slate-300 group cursor-pointer">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full transition-all group-hover:scale-150"></div>
            <div className="relative z-10">
              <h4 className="text-white font-black italic text-3xl mb-4 leading-[0.9] tracking-tighter">
                Vérifiez vos <br/><span className="text-blue-500">résultats</span>
              </h4>
              <p className="text-slate-500 text-[10px] font-black uppercase mb-10 tracking-[3px]">Session Normale 2025</p>
              <button className="w-full py-5 bg-white text-[#0F172A] rounded-2xl font-black text-[11px] uppercase tracking-[3px] hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95">
                  Consulter mon relevé
              </button>
            </div>
          </div>
          
          <div className="px-8 pt-4">
            <p className="text-[9px] text-slate-300 font-black uppercase tracking-[3px] text-center leading-relaxed italic">
                UY1 - ICT • Système de Gestion EDT <br/> Promotion 2025/2026
            </p>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;