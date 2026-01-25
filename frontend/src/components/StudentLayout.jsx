import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, BookOpen, User, LogOut, Bell } from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png';

const StudentLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

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
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-50">
          <img src={logoUY1} alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-sm font-black text-slate-800">Portail Étudiant</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10">
          <div className="flex flex-col text-left">
            <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[2px]">Bienvenue,</h2>
            <p className="text-slate-800 font-black text-lg">{user.nom || 'Étudiant'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2 hidden md:block">
              <p className="text-xs font-black text-slate-800 uppercase italic">{user.classe?.nom || 'N/A'}</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Inscrit en 2025/2026</p>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;