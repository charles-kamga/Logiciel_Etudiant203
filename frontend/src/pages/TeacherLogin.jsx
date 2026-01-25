import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Importation nécessaire pour l'appel API
import logoUY1 from '../assets/logo_uy1.png';
import { User, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * Gestion unique de la connexion Enseignant
   * Cette fonction contacte l'API, initialise la session
   * et redirige vers le tableau de bord.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialisation de l'état d'erreur

    try {
      // Appel vers la route spécifique teacher que nous avons créée sur le backend
      const response = await axios.post('http://localhost:5000/api/login/teacher', {
        email: email.trim(),
        password: password
      });

      // Si la réponse est positive (Status 200)
      if (response.data) {
        const userData = response.data;

        // 1. Initialisation de la sécurité (Rôle)
        localStorage.setItem('userRole', 'TEACHER');

        // 2. Initialisation des données de profil pour la Sidebar
        // On s'assure que l'objet contient les clés exactes attendues
        const userSession = {
          id: userData.id,
          nom: userData.nom,
          email: userData.email,
          specialite: userData.specialite || "Enseignant-Chercheur"
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        // 3. Redirection immédiate
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      // Gestion fine des erreurs
      if (err.response) {
        // Le serveur a répondu avec une erreur (401, 404, etc.)
        setError(err.response.data.error || "Identifiants incorrects. Veuillez réessayer.");
      } else if (err.request) {
        // Le serveur ne répond pas
        setError("Le serveur ne répond pas. Vérifiez que le Backend est lancé.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- BARRE DE NAVIGATION (BRANDING OFFICIEL) --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-3 group">
            <img src={logoUY1} alt="Logo UY1" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">UY1 - ICT</span>
                <span className="text-xl font-black text-[#1E293B] tracking-tight leading-none">EDT Universitaire</span>
            </div>
        </Link>
        <Link to="/login" className="flex items-center text-gray-500 hover:text-cyan-600 font-bold text-sm transition-all">
          <ArrowLeft size={18} className="mr-2" /> Retour aux profils
        </Link>
      </nav>

      {/* --- CONTENU DU FORMULAIRE --- */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl shadow-cyan-100/50 border border-gray-50 p-10 transform transition-all">
          
          {/* En-tête du formulaire */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-cyan-500 rounded-[24px] flex items-center justify-center text-white mb-6 shadow-xl shadow-cyan-200 animate-in fade-in zoom-in duration-500">
              <User size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Enseignant</h1>
            <p className="text-gray-400 font-medium text-sm mt-2 leading-relaxed">
              Veuillez saisir vos accès pour gérer <br /> vos enseignements et vos vœux.
            </p>
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-8 flex items-start p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-left">{error}</span>
            </div>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                <User size={20} />
              </div>
              <input 
                type="email" 
                required 
                placeholder="Email institutionnel"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                required 
                placeholder="Mot de passe"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-cyan-700 shadow-xl shadow-cyan-100 hover:shadow-cyan-200 transition-all active:scale-[0.97] mt-4"
            >
              Accéder au Portail
            </button>
          </form>

          {/* Aide / Support */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center text-xs">
            <p className="text-gray-400 font-bold uppercase tracking-widest mb-2 text-center">Centre de Support ICT</p>
            <p className="text-gray-400 text-center">En cas d'oubli, contactez votre administrateur départemental.</p>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
        <p>© 2025/2026 UniPortal • Université de Yaoundé I</p>
      </footer>
    </div>
  );
};

export default TeacherLogin;