import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  User, 
  LogOut, 
  Bell, 
  Search,
  Settings
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png'; // Vérifie le chemin de ton logo

const StudentLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupération des infos de l'étudiant connecté
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"nom": "Étudiant"}');

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Mon Emploi du Temps', path: '/student/timetable', icon: Calendar },
    { name: 'Supports de Cours', path: '/student/resources', icon: BookOpen },
    { name: 'Mon Profil', path: '/student/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* --- SIDEBAR DARK (IDENTIQUE ADMIN) --- */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col shadow-2xl">
        {/* Header Logo */}
        <div className="p-6 flex items-center space-x-3">
          <img src={logoUY1} alt="Logo" className="h-10 w-auto bg-white p-1 rounded" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">UY1 - ICT</p>
            <p className="text-sm font-black italic uppercase leading-none text-white">Portail Étudiant</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-bold' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Profil Utilisateur */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
              {currentUser.nom.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-bold text-white truncate">{currentUser.nom}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Étudiant inscrit</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 p-1 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-2">
             <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rôle :</span>
             <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Student</span>
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {currentUser.nom.charAt(0)}
                </div>
            </div>
          </div>
        </header>

        {/* Zone de contenu */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;