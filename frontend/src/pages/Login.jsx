import React from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  /**
   * Gestion des redirections vers les formulaires spécifiques.
   * On sépare les accès pour garantir que seuls les utilisateurs
   * enregistrés en BD (Admin et Enseignants) puissent accéder à leurs espaces.
   */
  const handleLogin = (role) => {
    // Stockage du rôle choisi pour la session
    localStorage.setItem('userRole', role);

    // Redirection selon le rôle choisi
    if (role === 'ADMIN') {
      // Redirige vers le formulaire sécurisé admin (admin/admin)
      navigate('/login/admin');
    } else if (role === 'TEACHER') {
      // Redirige vers le portail de connexion des enseignants
      navigate('/login/teacher'); 
    } else {
      // Pour les étudiants, accès direct au dashboard public/consultation
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3 group">
          {/* Logo Officiel UY1 */}
          <img 
            src={logoUY1} 
            alt="Logo UY1" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          
          {/* Séparateur vertical */}
          <div className="h-8 w-[1.5px] bg-gray-200"></div>

          {/* Texte Branding Officiel - EDT Universitaire */}
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] leading-none mb-1">
              UY1 - ICT
            </span>
            <span className="text-lg font-black text-[#1E293B] tracking-tight leading-none uppercase">
              EDT Universitaire
            </span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors font-bold">Accueil</Link>
          <a href="#" className="hover:text-blue-600 transition-colors font-bold">À propos</a>
          <a href="#" className="hover:text-blue-600 transition-colors font-bold">Besoin d'aide ?</a>
        </div>

        <Link 
          to="/" 
          className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} className="mr-2" /> Retour à l'accueil
        </Link>
      </nav>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] mb-4 tracking-tight">Espace de Connexion</h1>
            <p className="text-gray-500 font-medium">Sélectionnez votre profil pour accéder à vos outils de gestion.</p>
          </div>

          <div className="space-y-5">
            {/* BOUTON ÉTUDIANT */}
            <button 
              onClick={() => navigate('/login/student')}
              className="w-full group bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:border-blue-100 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <GraduationCap className="text-blue-600 group-hover:text-white" size={32} />
                </div>
                <div className="ml-6 text-left">
                  <h3 className="text-xl font-bold text-[#1E293B]">Portail Étudiant</h3>
                  <p className="text-sm text-gray-400 font-medium italic">Consulter mon emploi du temps en temps réel</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
            </button>

            {/* BOUTON ENSEIGNANT */}
            <button 
              onClick={() => handleLogin('TEACHER')}
              className="w-full group bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-cyan-100/50 hover:border-cyan-100 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
                  <Users className="text-cyan-600 group-hover:text-white" size={32} />
                </div>
                <div className="ml-6 text-left">
                  <h3 className="text-xl font-bold text-[#1E293B]">Espace Enseignant</h3>
                  <p className="text-sm text-gray-400 font-medium italic">Gérer mes cours et soumettre mes désidératas</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-cyan-600 group-hover:translate-x-2 transition-all duration-300" />
            </button>

            {/* BOUTON ADMINISTRATION */}
            <button 
                onClick={() => handleLogin('ADMIN')} 
                className="w-full group bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:border-slate-200 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                  <ShieldCheck className="text-slate-600 group-hover:text-white" size={32} />
                </div>
                <div className="ml-6 text-left">
                  <h3 className="text-xl font-bold text-[#1E293B]">Administration</h3>
                  <p className="text-sm text-gray-400 font-medium italic">Paramétrage global, arbitrage et ressources</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-slate-900 group-hover:translate-x-2 transition-all duration-300" />
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Besoin d'un accès spécifique ? <a href="#" className="text-blue-600 font-bold hover:underline">Demander de l'aide au centre informatique</a>
            </p>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
          <p>© 2025/2026 • UY1 ICT PROJECT • EDT UNIVERSITAIRE</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-bold text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Support Technique</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Mentions Légales</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;