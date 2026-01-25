import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  User, 
  ChevronRight, 
  ArrowRight, 
  Bell,
  AlertCircle 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    
    // --- RÉCUPÉRATION SÉCURISÉE DES DONNÉES DE SESSION ---
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = localStorage.getItem('userRole');

    const teacherId = currentUser.id;
    const teacherName = currentUser.nom || "Enseignant";
    const teacherSpecialite = currentUser.specialite || "Enseignant-Chercheur";

    // Initialisation de l'état avec des structures par défaut pour éviter les erreurs .map()
    const [dashboardData, setDashboardData] = useState({
        nextSession: null,
        weeklyStats: [
            { name: 'Lun', heures: 0 },
            { name: 'Mar', heures: 0 },
            { name: 'Mer', heures: 0 },
            { name: 'Jeu', heures: 0 },
            { name: 'Ven', heures: 0 },
            { name: 'Sam', heures: 0 },
        ],
        upcomingSessions: [],
        classes: [],
        desidProgress: 0,
        totalHours: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirection si l'utilisateur n'est pas autorisé
        if (!teacherId || role !== 'TEACHER') {
            navigate('/login');
            return;
        }

        const fetchTeacherData = async () => {
            try {
                // APPEL API RÉEL VERS VOTRE BACKEND NODE.JS
                const response = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/dashboard`);
                
                // Mise à jour de l'état avec les données provenant de Prisma
                setDashboardData({
                    nextSession: response.data.nextSession || null,
                    weeklyStats: response.data.weeklyStats || [],
                    upcomingSessions: response.data.upcomingSessions || [],
                    classes: response.data.classes || [], // Liste des classes distinctes
                    desidProgress: response.data.desidProgress || 0,
                    totalHours: response.data.totalHours || 0
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données dynamiques du dashboard", error);
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, [role, navigate, teacherId]);

    // Écran de chargement stylisé UniPortal
    if (loading) {
        return (
            <TeacherLayout>
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute top-0 w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-teal-100"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-800 font-black uppercase italic tracking-[6px] animate-pulse">Synchronisation</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 italic tracking-widest">
                            Chargement du profil de {teacherName}
                        </p>
                    </div>
                </div>
            </TeacherLayout>
        );
    }

  return (
    <TeacherLayout>
      {/* --- HEADER DYNAMIQUE --- */}
      <div className="mb-10 flex justify-between items-center animate-in fade-in slide-in-from-top duration-700">
        <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter italic uppercase">
                Bonjour, {teacherName}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
                <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm shadow-blue-200">UY1 - ICT</span>
                <span className="text-slate-300 font-bold">•</span>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] italic">
                    Spécialité : {teacherSpecialite}
                </p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative p-3 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group">
                <Bell size={22} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
                {dashboardData.upcomingSessions?.length > 0 && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE (Contenu Principal) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARD PROCHAINE SÉANCE (L'élément le plus important du dashboard) */}
          <div className="bg-gradient-to-br from-[#2DD4BF] to-[#0D9488] rounded-[40px] p-10 text-white shadow-2xl shadow-teal-200/50 relative overflow-hidden group border-b-[10px] border-teal-800/20 transition-transform hover:scale-[1.01] duration-500">
            {dashboardData.nextSession ? (
                <div className="relative z-10 text-left">
                    <div className="flex items-center space-x-3 mb-8">
                        <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[3px] italic border border-white/20">Prochaine Séance</span>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                    
                    <h2 className="text-5xl font-black mb-12 leading-none uppercase italic tracking-tighter drop-shadow-lg break-words">
                        {dashboardData.nextSession?.ue?.nom} <br/>
                        <span className="text-teal-50 text-xl not-italic tracking-normal opacity-70 font-bold">
                            Code UE : {dashboardData.nextSession?.ue?.code}
                        </span>
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/20 pt-10">
                        <div className="text-left">
                            <p className="text-[9px] uppercase font-black opacity-60 mb-3 tracking-[2px]">Horaire</p>
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-white/10 rounded-lg"><Clock size={16} /></div>
                                <span className="font-black text-lg italic tracking-tight">{dashboardData.nextSession?.plageHoraire}</span>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] uppercase font-black opacity-60 mb-3 tracking-[2px]">Jour</p>
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-white/10 rounded-lg"><CalendarIcon size={16} /></div>
                                <span className="font-black text-lg italic tracking-tight uppercase">{dashboardData.nextSession?.jour}</span>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] uppercase font-black opacity-60 mb-3 tracking-[2px]">Salle</p>
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-white/10 rounded-lg"><MapPin size={16} /></div>
                                <span className="font-black text-lg italic tracking-tight uppercase">{dashboardData.nextSession?.salle?.nom}</span>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] uppercase font-black opacity-60 mb-3 tracking-[2px]">Classe</p>
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-white/10 rounded-lg"><User size={16} /></div>
                                <span className="font-black text-lg italic tracking-tight uppercase">{dashboardData.nextSession?.classe?.nom}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative z-10 py-16 text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <AlertCircle size={40} className="text-white opacity-40" />
                    </div>
                    <p className="text-2xl font-black italic uppercase tracking-widest">Aucun cours imminent</p>
                    <p className="text-sm opacity-60 mt-2 font-medium">L'emploi du temps n'affiche aucune séance pour les prochaines 24h.</p>
                </div>
            )}
            {/* Décorations visuelles en arrière-plan */}
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-teal-300/20 rounded-full blur-[80px] pointer-events-none"></div>
          </div>

          {/* GRAPHIQUE CHARGE DE TRAVAIL (Volume horaire) */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-12 text-left">
                <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-[2px]">Charge de Travail Hebdomadaire</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">
                        Volume Horaire Total estimé : <span className="text-teal-600 font-black italic">{dashboardData.totalHours} Heures</span>
                    </p>
                </div>
                <div className="bg-slate-900 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase text-white border-b-4 border-slate-700 tracking-widest shadow-lg shadow-slate-200">
                    S1 2025/2026
                </div>
            </div>
            
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.weeklyStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748B', fontSize: 11, fontWeight: 900}} 
                            dy={15}
                        />
                        <Tooltip 
                            cursor={{fill: '#F8FAFC', radius: 12}} 
                            contentStyle={{
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', 
                                fontSize: '11px', 
                                fontWeight: '900', 
                                textTransform: 'uppercase'
                            }} 
                        />
                        <Bar 
                            dataKey="heures" 
                            fill="#F1F5F9" 
                            radius={[12, 12, 12, 12]} 
                            activeBar={{ fill: '#0D9488', stroke: '#2DD4BF', strokeWidth: 4 }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (Widgets & Listes) --- */}
        <div className="space-y-8">
            
            {/* SECTION VŒUX (Barre de progression vers la fin de saisie) */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-fit transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-10 text-left">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-widest">Vœux & Désidératas</h3>
                    <div className="flex items-center space-x-1.5 bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter border border-orange-100">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                        <span>Session active</span>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-8 rounded-[35px] mb-8 border border-slate-100 shadow-inner">
                    <div className="flex justify-between text-[11px] font-black mb-5 uppercase tracking-[2px]">
                        <span className="text-slate-400 italic text-left tracking-widest">Progression de saisie</span>
                        <span className="text-blue-600 font-black">{dashboardData.desidProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 shadow-sm">
                        <div 
                            className="bg-gradient-to-r from-teal-400 to-blue-500 h-full rounded-full transition-all duration-1000 shadow-lg shadow-teal-500/30" 
                            style={{width: `${dashboardData.desidProgress}%`}}
                        ></div>
                    </div>
                </div>
                
                <button 
                    onClick={() => navigate('/teacher/voeux')}
                    className="w-full bg-slate-900 text-white py-5 rounded-[22px] font-black text-[11px] uppercase tracking-[4px] shadow-2xl shadow-slate-300 hover:bg-teal-600 hover:shadow-teal-100 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    <span>Modifier mes vœux</span>
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* SECTION CLASSES ASSIGNÉES (Liste simplifiée) */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-fit transition-all hover:shadow-md text-left">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-widest underline decoration-teal-500 decoration-4 underline-offset-8">
                        Mes Classes
                    </h3>
                    <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-black text-[10px] border border-teal-100">
                        {dashboardData.classes?.length || 0}
                    </div>
                </div>
                
                <div className="space-y-6">
                    {dashboardData.classes?.length > 0 ? (
                        dashboardData.classes.map((cls, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer p-1 transition-all">
                                <div className="flex items-center space-x-5">
                                    <div className="w-12 h-12 rounded-[18px] bg-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 flex items-center justify-center font-black text-xs border border-slate-200 group-hover:border-teal-100 uppercase italic transition-all">
                                        {cls.nom ? cls.nom.substring(0, 3) : "CLS"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800 uppercase group-hover:text-teal-600 transition-colors tracking-tight">
                                            {cls.nom}
                                        </p>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5 italic">
                                            {cls.effectif} Étudiants inscrits
                                        </p>
                                    </div>
                                </div>
                                <div className="p-2 bg-transparent group-hover:bg-teal-50 rounded-lg transition-all">
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-[30px] bg-slate-50/30">
                            <p className="text-[10px] text-slate-300 italic text-center uppercase font-black tracking-widest">
                                Aucune classe assignée
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* --- AGENDA DÉTAILLÉ (Le planning en liste) --- */}
      <div className="mt-12 bg-white rounded-[45px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl mb-12 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-slate-50/20 gap-6 text-left">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-sm shadow-blue-300"></div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Agenda des séances</h3>
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest ml-6">
                    Planification des 5 prochaines interventions • UY1 ICT
                </p>
              </div>
              <button 
                onClick={() => navigate('/teacher/classes')}
                className="group text-teal-600 font-black text-[10px] uppercase tracking-[3px] flex items-center bg-teal-50 px-8 py-4 rounded-[22px] hover:bg-teal-600 hover:text-white transition-all duration-300 border border-teal-100 shadow-sm"
              >
                  Gestion des séances <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[5px] border-b border-slate-100">
                    <tr>
                        <th className="px-12 py-6">Unité d'enseignement</th>
                        <th className="px-12 py-6">Classe</th>
                        <th className="px-12 py-6">Planification</th>
                        <th className="px-12 py-6">Espace / Salle</th>
                        <th className="px-12 py-6 text-right">État</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {dashboardData.upcomingSessions?.length > 0 ? (
                        dashboardData.upcomingSessions.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/70 transition-colors group">
                                <td className="px-12 py-10 text-left">
                                    <p className="text-base font-black text-slate-800 group-hover:text-teal-600 transition-colors uppercase italic tracking-tighter">
                                        {row.ue?.nom}
                                    </p>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[2px] mt-1 block">
                                        ID UE : {row.ue?.code}
                                    </span>
                                </td>
                                <td className="px-12 py-10">
                                    <span className="bg-teal-50/50 text-teal-600 text-[10px] font-black px-4 py-2 rounded-xl border border-teal-100/50 uppercase tracking-widest">
                                        {row.classe?.nom}
                                    </span>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="flex flex-col text-left">
                                        <div className="flex items-center text-sm font-black text-slate-700 italic tracking-tight uppercase">
                                            <CalendarIcon size={14} className="mr-2 text-teal-500" /> 
                                            {row.jour}
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-6">
                                            {row.plageHoraire}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="inline-flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl shadow-lg shadow-slate-200">
                                        <MapPin size={12} className="text-teal-400" />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                            {row.salle?.nom}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-12 py-10 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <span className="text-teal-600 text-[9px] font-black uppercase tracking-[3px] italic">Confirmée</span>
                                        <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse"></div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-12 py-32 text-center">
                                <p className="text-slate-200 text-sm italic uppercase font-black tracking-[8px] opacity-50">
                                    Agenda vide pour ce semestre
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
          <div className="bg-slate-900 py-6 px-12 text-center">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[5px]">
                  EDT Universitaire • Console de Gestion Enseignant • Université de Yaoundé I
              </p>
          </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;