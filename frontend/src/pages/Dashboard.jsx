import React from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import Timetable from '../components/Timetable';
import { Calendar, Users, Home, LogOut, Bell, ClipboardList, UserSquare2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'STUDENT';

  const logout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Dynamique */}
      <div className="w-64 bg-blue-900 text-white p-6 flex flex-col">
        {/* Sidebar Branding */}
        <div className="flex items-center space-x-3 mb-10 px-2">
          {/* Logo Image UY1 */}
          <img 
            src={logoUY1} 
            alt="Logo UY1" 
            className="h-9 w-auto object-contain bg-white p-0.5 rounded-md" 
          />
          
          {/* Séparateur vertical adapté au fond sombre */}
          <div className="h-7 w-[1.5px] bg-blue-700"></div>

          {/* Texte du Logo en blanc/bleu clair */}
          <div className="flex flex-col justify-center">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] leading-none mb-1">
              UY1 - ICT
            </span>
            <span className="text-lg font-black text-white tracking-tight leading-none">
              EDT Universitaire
            </span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center space-x-3 p-3 bg-blue-800 rounded-lg">
            <Calendar size={20} /> <span>Emploi du temps</span>
          </button>

          {/* Menu spécifique ADMIN */}
          {role === 'ADMIN' && (
            <>
              <button onClick={() => navigate('/admin/enseignants')} className="w-full flex items-center space-x-3 p-3 hover:bg-blue-800 rounded-lg transition-colors text-blue-200 hover:text-white">
                <Users size={20} /> <span>Enseignants</span>
              </button>
              <button onClick={() => navigate('/admin/salles')} className="w-full flex items-center space-x-3 p-3 hover:bg-blue-800 rounded-lg transition-colors text-blue-200 hover:text-white">
                <Home size={20} /> <span>Salles & Classes</span>
              </button>
            </>
          )}

          {/* Menu spécifique TEACHER */}
          {role === 'TEACHER' && (
            <>
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-blue-800 rounded-lg transition-colors text-blue-200 hover:text-white">
                <ClipboardList size={20} /> <span>Mes Désidératas</span>
              </button>
              
              {/* BOUTON D'ACCÈS AU PORTAIL ENSEIGNANT (Nouveauté demandée) */}
              <button 
                onClick={() => navigate('/teacher/dashboard')} 
                className="w-full flex items-center space-x-3 p-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-all mt-6 font-bold shadow-lg shadow-teal-900/20 text-white"
              >
                <UserSquare2 size={20} /> <span>Mon Portail Privé</span>
              </button>
            </>
          )}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center space-x-3 p-3 hover:bg-red-600 rounded-lg transition-colors text-red-200 hover:text-white">
          <LogOut size={20} /> <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4 flex justify-between items-center px-8">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Rôle :</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
              role === 'TEACHER' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {role}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-400 cursor-pointer" size={20} />
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {/* Alerte pour l'ADMIN (Contrainte du PDF) */}
          {role === 'ADMIN' && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-center justify-between">
              <p className="text-yellow-700">
                <strong>Notification:</strong> L'emploi du temps de ICT-L2 est complet pour le Semestre 1.
              </p>
              <button className="text-sm font-bold text-yellow-800 hover:underline">Vérifier</button>
            </div>
          )}

          <Timetable />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;