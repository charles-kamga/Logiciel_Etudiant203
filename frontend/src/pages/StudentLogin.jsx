import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import logoUY1 from '../assets/logo_uy1.png'; // Assure-toi que le chemin est correct

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: email.toLowerCase().trim(),
        password: password
      });

      if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        localStorage.setItem('userRole', 'STUDENT');
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- NAVBAR OFFICIELLE --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logoUY1} alt="Logo UY1" className="h-10 w-auto object-contain" />
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-xl font-black text-[#1E293B]">EDT Universitaire</span>
          </div>
        </Link>
        <Link to="/login" className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm transition-all">
          <ArrowLeft size={18} className="mr-2" /> Retour
        </Link>
      </nav>

      {/* --- FORMULAIRE --- */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 border border-gray-100 p-10 text-left">
          
          <div className="flex flex-col items-start mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl text-white mb-6 shadow-lg shadow-blue-200">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-black text-[#1E293B] italic">Portail Étudiant</h1>
            <p className="text-gray-400 text-sm mt-2 font-medium">Connectez-vous pour accéder à votre emploi du temps.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-bounce">
              <AlertCircle size={18} className="mr-2" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Institutionnel</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="email" required placeholder="nom.prenom@univ-y1.cm"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#1d76f2] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[3px] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Accéder à mon espace"}
            </button>
          </form>

          <p className="text-center mt-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Pas encore de compte ? <Link to="/register-student" className="text-blue-600 hover:underline">S'inscrire</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentLogin;