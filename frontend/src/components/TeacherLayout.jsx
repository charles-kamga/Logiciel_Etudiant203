import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, ClipboardList, Users, FolderOpen, 
  Search, Bell, Settings, LogOut 
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png'; // Ton blason UY1

const TeacherLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- ÉTAT DYNAMIQUE POUR L'UTILISATEUR ---
  const [user, setUser] = useState({
    nom: "Enseignant",
    specialite: "Enseignant-Chercheur"
  });

  useEffect(() => {
    // 1. On tente de récupérer l'objet utilisateur complet
    const storedUser = localStorage.getItem('currentUser');
    // 2. Ou on récupère juste le nom si c'est ce qui est stocké
    const storedName = localStorage.getItem('teacherName');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (storedName) {
      setUser(prev => ({ ...prev, nom: storedName }));
    }
  }, []);

  const handleLogout = () => {
    // Nettoyage complet de la session
    localStorage.removeItem('userRole');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('teacherId');
    // Redirection vers la page d'accueil ou login
    navigate('/');
  };

  const menuItems = [
    { name: 'Mon Planning', path: '/teacher/dashboard', icon: Calendar },
    { name: 'Vœux', path: '/teacher/voeux', icon: ClipboardList },
    { name: 'Classes', path: '/teacher/classes', icon: Users },
    { name: 'Ressources', path: '/teacher/ressources', icon: FolderOpen },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* --- SIDEBAR SOMBRE --- */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col shadow-2xl z-20">
        {/* Branding UniPortal / UY1 */}
        <div className="p-6 flex items-center space-x-3 mb-6">
          <img src={logoUY1} alt="Logo UY1" className="h-10 w-auto bg-white/90 p-1 rounded" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-sm font-black italic tracking-tight">Portail Enseignant</span>
          </div>
        </div>

        {/* Menu de Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profil de l'enseignant DYNAMIQUE en bas */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 transition-all hover:bg-slate-800">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-slate-100 flex-shrink-0">
               {/* Avatar dynamique basé sur le nom */}
               <img 
                src={`https://ui-avatars.com/api/?name=${user.nom.replace(' ', '+')}&background=random&color=fff&bold=true`} 
                alt="Avatar Enseignant" 
               />
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-xs font-black truncate uppercase text-white">
                {user.nom}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter truncate font-bold">
                {user.specialite || "Enseignant-Chercheur"}
              </p>
            </div>
            <button 
                onClick={handleLogout} 
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                title="Déconnexion"
            >
                <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec Barre de recherche */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Espace <span className="mx-2 text-slate-300">/</span> <span className="text-blue-600">Tableau de bord</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un cours ou une classe..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="relative p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors">
                <Settings size={18} />
            </div>
          </div>
        </header>

        {/* Zone de défilement du contenu */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* Footer Administratif */}
        <footer className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
            <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <p>Session active : {user.nom}</p>
                </div>
                <p className="hidden md:block">Année Académique : 2025/2026</p>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span>Système Connecté</span>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default TeacherLayout;