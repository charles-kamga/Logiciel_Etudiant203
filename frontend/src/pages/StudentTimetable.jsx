import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// Ajout de "Dimanche" à la liste des jours
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00"];

const StudentTimetable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        // On récupère l'emploi du temps de la classe de l'étudiant
        const res = await axios.get(`http://localhost:5000/api/classes/${user.classeId}/sessions`);
        setSessions(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement de l'emploi du temps", err);
        setLoading(false);
      }
    };
    if (user.classeId) fetchTimetable();
  }, [user.classeId]);

  return (
    <StudentLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
            Mon Emploi du Temps
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Planning complet pour la classe : <span className="text-blue-600 font-black uppercase">{user.classe?.nom || 'N/A'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><ChevronLeft size={20}/></button>
          <span className="px-4 text-xs font-black uppercase tracking-widest text-slate-600">Semaine Actuelle</span>
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><ChevronRight size={20}/></button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 border-r border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left w-40">Horaires</th>
                  {DAYS.map(day => (
                    <th key={day} className="p-6 border-b border-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-[3px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map(slot => (
                  <tr key={slot} className="group">
                    <td className="p-6 border-r border-b border-slate-50 bg-slate-50/20">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[10px] font-black italic">{slot}</span>
                      </div>
                    </td>
                    {DAYS.map(day => {
                      const session = sessions.find(s => s.jour === day && s.plageHoraire === slot);
                      return (
                        <td key={day} className="p-3 border-b border-slate-50 min-w-[200px] h-40 align-top">
                          {session ? (
                            <div className="h-full bg-blue-50/50 border border-blue-100 p-4 rounded-3xl text-left flex flex-col justify-between hover:bg-blue-600 hover:border-blue-600 group/card transition-all duration-300">
                              <div>
                                <p className="text-[9px] font-black text-blue-600 group-hover/card:text-blue-100 uppercase tracking-widest mb-1">{session.ue.code}</p>
                                <h4 className="text-sm font-black text-slate-800 group-hover/card:text-white leading-tight uppercase italic">{session.ue.nom}</h4>
                              </div>
                              
                              <div className="space-y-2 mt-4">
                                <div className="flex items-center space-x-2 text-slate-500 group-hover/card:text-blue-100">
                                  <MapPin size={12} />
                                  <span className="text-[10px] font-bold uppercase">{session.salle.nom}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-slate-400 group-hover/card:text-blue-200">
                                  <div className="w-5 h-5 bg-white group-hover/card:bg-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 group-hover/card:text-white">
                                    {session.ue.enseignant.nom.charAt(0)}
                                  </div>
                                  <span className="text-[10px] font-medium truncate">{session.ue.enseignant.nom}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-black text-slate-200 uppercase tracking-[5px] italic">Libre</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex items-center justify-center space-x-6 text-[10px] font-black text-slate-300 uppercase tracking-[4px]">
        <span>UY1 - ICT 203</span>
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
        <span>Année Académique 2025/2026</span>
      </div>
    </StudentLayout>
  );
};

export default StudentTimetable;