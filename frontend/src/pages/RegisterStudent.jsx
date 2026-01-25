import React, { useState, useEffect } from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Hash, BookOpen, Lock, Layout, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';

const RegisterStudent = () => {
  const navigate = useNavigate();
  
  const [allClasses, setAllClasses] = useState([]);
  const [departments, setDepartments] = useState([]); // Contiendra la liste complète
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nom: '', email: '', matricule: '', departement: '', classeId: '', password: ''
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classes');
        const classesData = response.data;
        setAllClasses(classesData);

        // EXTRACTION AUTOMATIQUE DE TOUS LES DÉPARTEMENTS UNIQUES
        // On récupère le champ "departement" de chaque classe, on enlève les doublons et les vides
        const uniqueDepts = [...new Set(classesData.map(c => c.departement))]
                            .filter(dept => dept && dept.trim() !== "")
                            .sort(); // Tri alphabétique
        
        setDepartments(uniqueDepts);
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement classes :", error);
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register-student', {
        ...formData,
        classeId: parseInt(formData.classeId)
      });
      alert("Compte étudiant créé avec succès !");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || "Erreur d'inscription");
    }
  };

  const filteredClasses = allClasses.filter(c => c.departement === formData.departement);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3 group">
          <img src={logoUY1} alt="Logo UY1" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          <div className="h-8 w-[1.5px] bg-gray-200"></div>
          <div className="flex flex-col justify-center text-left">
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] leading-none mb-1">UY1 - ICT</span>
            <span className="text-lg font-black text-[#1E293B] tracking-tight leading-none">EDT Universitaire</span>
          </div>
        </Link>
        <Link to="/login" className="text-sm font-bold text-blue-600 hover:underline">Se connecter</Link>
      </nav>

      <main className="flex-grow flex items-center justify-center py-16 px-6">
        <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 border border-gray-50 overflow-hidden flex flex-col md:flex-row">
          
          <div className="hidden md:flex md:w-1/3 bg-blue-600 p-12 flex-col justify-between text-white text-left italic">
            <div>
              <h2 className="text-3xl font-bold mb-6 leading-tight">Rejoignez votre communauté.</h2>
              <p className="text-blue-100 text-base leading-relaxed">Inscrivez-vous pour accéder à votre emploi du temps officiel.</p>
            </div>
          </div>

          <div className="flex-1 p-8 md:p-14">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-blue-600 mb-8 font-bold text-sm">
              <ArrowLeft size={16} className="mr-2" /> Retour
            </button>

            <h1 className="text-4xl font-black text-[#1E293B] mb-10 text-left">Inscription Étudiant</h1>

            {loading ? (
              <div className="flex flex-col items-center py-20 italic">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p>Récupération des départements...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" required placeholder="Nom complet" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold" onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="email" required placeholder="Email institutionnel" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" required placeholder="N° Matricule" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold" onChange={(e) => setFormData({...formData, matricule: e.target.value})} />
                  </div>

                  {/* SÉLECTEUR DÉPARTEMENT STYLE IMAGE */}
                  <div className="relative group">
                    <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                    <select 
                      required 
                      className="w-full pl-12 pr-10 py-4 bg-white border border-blue-400 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer transition-all shadow-sm"
                      value={formData.departement}
                      onChange={(e) => setFormData({...formData, departement: e.target.value, classeId: ''})}
                    >
                      <option value="">Tous Départements</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept} className="bg-white text-slate-700">{dept}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select 
                      required 
                      disabled={!formData.departement}
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold appearance-none disabled:opacity-50"
                      value={formData.classeId}
                      onChange={(e) => setFormData({...formData, classeId: e.target.value})}
                    >
                      <option value="">{formData.departement ? "Choisir votre classe" : "Sélectionnez un département"}</option>
                      {filteredClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.nom}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="password" required placeholder="Mot de passe" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#1d76f2] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:scale-[1.01] transition-all mt-6">
                  Finaliser l'inscription
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2025/2026 UniPortal • Université de Yaoundé I</p>
      </footer>
    </div>
  );
};

export default RegisterStudent;