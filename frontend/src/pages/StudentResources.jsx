import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { FileText, Download, Search, BookOpen, User, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    if (user.id) fetchResources(); 
  }, [user.id]);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${user.id}/resources`);
      setResources(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des ressources");
      setLoading(false);
    }
  };

  /**
   * RECHERCHE DYNAMIQUE ACTIVÉE
   * Filtre par : Nom du fichier, Code UE, ou Nom de l'enseignant
   */
  const filteredResources = resources.filter(r => 
    r.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.ue?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.teacher?.nom && r.teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /**
   * REGROUPEMENT PAR ENSEIGNANT
   */
  const groupedResources = filteredResources.reduce((acc, resource) => {
    const teacherName = resource.teacher?.nom || "Enseignant UY1";
    if (!acc[teacherName]) {
      acc[teacherName] = [];
    }
    acc[teacherName].push(resource);
    return acc;
  }, {});

  /**
   * MÉTHODE DE TÉLÉCHARGEMENT "ANTI-BLOCK" (BLOB STRATEGY)
   * Cette méthode télécharge le fichier en arrière-plan et le propose ensuite au navigateur.
   * C'est la solution ultime contre l'erreur #blocked.
   */
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`;
      
      // On récupère le fichier comme un objet binaire (Blob)
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Fichier introuvable sur le serveur");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Création du lien de téléchargement local
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'support_de_cours');
      
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
      alert("Erreur : Le fichier est bloqué ou introuvable sur le serveur.");
    }
  };

  return (
    <StudentLayout>
      {/* HEADER : STYLE ÉPURÉ */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
            Supports de cours
          </h1>
          <p className="text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[4px]">
            Espace documentaire pédagogique • UY1 ICT
          </p>
        </div>

        {/* RECHERCHE ACTIVE */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Rechercher (UE, Prof, Titre)..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-slate-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.keys(groupedResources).length > 0 ? (
            Object.entries(groupedResources).map(([teacherName, docs]) => (
              <div key={teacherName} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
                
                {/* EN-TÊTE DE SECTION ENSEIGNANT */}
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                      <User size={22} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-black text-slate-800 italic uppercase leading-none">
                        {teacherName}
                      </h2>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-[3px] mt-2">
                         {docs.length} ressource{docs.length > 1 ? 's' : ''} disponible{docs.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-200" size={24} />
                </div>

                {/* GRILLE DE TUILES (REDUITE) */}
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {docs.map((res) => (
                    <div 
                      key={res.id} 
                      className="group bg-slate-50/50 p-4 rounded-[24px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Icône de la tuile */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                          <FileText size={20} />
                        </div>
                        <span className="text-[7px] font-black px-2 py-1 bg-white text-slate-400 border border-slate-100 rounded-lg uppercase tracking-widest">
                          {res.type || 'PDF'}
                        </span>
                      </div>

                      {/* Contenu textuel réduit */}
                      <div className="flex-1 text-left">
                        <p className="text-blue-600 font-black text-[8px] uppercase tracking-wider mb-1 truncate">
                          {res.ue?.code || "UE"}
                        </p>
                        <h3 className="text-[11px] font-black text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 h-8">
                          {res.nom}
                        </h3>
                        
                        <div className="flex items-center justify-between text-slate-300 text-[7px] font-bold uppercase tracking-wider border-t border-slate-100 pt-3 mb-4">
                           <div className="flex items-center gap-1"><Clock size={10}/> {new Date(res.date).toLocaleDateString()}</div>
                           <div className="font-black text-slate-400">{res.taille || "N/A"}</div>
                        </div>
                      </div>

                      {/* Bouton Télécharger (compact) */}
                      <button 
                        onClick={() => handleDownload(res.url, res.nom)}
                        className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-black text-[8px] uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md active:scale-90"
                      >
                        <Download size={12} /> Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* ÉTAT VIDE */
            <div className="py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center border-dashed border-2">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black italic uppercase tracking-[5px] text-[10px]">Aucune ressource trouvée</p>
              <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2">Vérifiez vos critères de recherche</p>
            </div>
          )}
        </div>
      )}

      <footer className="mt-20 pt-8 border-t border-slate-100 text-[8px] text-slate-200 font-black uppercase tracking-[5px] text-center">
        UY1 ICT • SYSTÈME DE GESTION 2025/2026
      </footer>
    </StudentLayout>
  );
};

export default StudentResources;