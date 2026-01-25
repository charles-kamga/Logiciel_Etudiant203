import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { 
  LayoutDashboard, DoorOpen, Users, UserSquare2, 
  Gavel, ClipboardList, Search, Bell, Settings, LogOut 
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialise le hook de navigation

  // --- FONCTION DE DÉCONNEXION ---
  const handleLogout = () => {
    // 1. Supprimer les données de session
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdminAuthenticated');
    
    // 2. Rediriger vers la page d'accueil ou de login
    navigate('/'); 
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Salles', path: '/admin/salles', icon: DoorOpen },
    { name: 'Classes', path: '/admin/classes', icon: Users },
    { name: 'Enseignants', path: '/admin/enseignants', icon: UserSquare2 },
    { name: 'Arbitrage', path: '/admin/arbitrage', icon: Gavel },
    { name: 'Vœux', path: '/admin/voeux', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col">
        {/* ... (Reste du code du haut de la sidebar) ... */}
        <div className="p-6 flex items-center space-x-3">
          <img src={logoUY1} alt="Logo" className="h-10 w-auto bg-white p-1 rounded" />
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">UY1 - ICT</p>
            <p className="text-sm font-black italic">Console Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* --- SECTION PROFIL AVEC LOGOUT --- */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Admin Principal</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Super Admin</p>
            </div>
            
            {/* BOUTON MODIFIÉ ICI */}
            <button 
              onClick={handleLogout} // Appelle la fonction de déconnexion
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
              title="Se déconnecter"
            >
              <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- RESTE DU CONTENU --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ... (Reste de ton AdminLayout) ... */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
  
  {/* --- FENÊTRE DE CONFIRMATION PERSONNALISÉE --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Icône d'alerte */}
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>

            {/* Texte de confirmation */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-slate-800 mb-2">Confirmer la suppression ?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Êtes-vous sûr de vouloir supprimer la salle <span className="font-bold text-slate-800">"{deleteModal.nom}"</span> ? 
                Cette action est irréversible.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null, nom: '' })}
                className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
              >
                Supprimer
              </button>
            </div>

            {/* Bouton de fermeture rapide */}
            <button 
              onClick={() => setDeleteModal({ show: false, id: null, nom: '' })}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
};

export default AdminLayout;