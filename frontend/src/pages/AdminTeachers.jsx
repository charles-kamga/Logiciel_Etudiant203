import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getTeachers, createTeacher, deleteTeacher, updateTeacher } from '../services/api'; 
import { 
  UserSquare2, Plus, Search, Trash2, Edit3, X, 
  ClipboardList, Bookmark, BookOpen, Lock, AlertCircle
} from 'lucide-react';

const AdminTeachers = () => {
  // --- ÉTATS ---
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // État pour la création
  const [newTeacher, setNewTeacher] = useState({ 
    nom: '', 
    email: '', 
    departement: 'Informatique', 
    specialite: '',
    ueCode: '', 
    password: '' 
  });

  // État pour la modification
  const [editData, setEditData] = useState({
    nom: '',
    email: '',
    departement: '',
    specialite: '',
    ueCode: '',
    password: '' 
  });

  // --- CHARGEMENT ---
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getTeachers();
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des enseignants");
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await createTeacher(newTeacher);
      setShowAddModal(false); 
      setNewTeacher({ 
        nom: '', email: '', departement: 'Informatique', 
        specialite: '', ueCode: '', password: '' 
      });
      fetchTeachers();
    } catch (error) {
      setErrorMessage("Erreur lors de la création. Vérifiez si l'email n'est pas déjà utilisé.");
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setEditData({
      nom: teacher.nom,
      email: teacher.email,
      departement: teacher.departement,
      specialite: teacher.specialite || '',
      ueCode: teacher.ue && teacher.ue.length > 0 ? teacher.ue[0].code : '',
      password: '' 
    });
    setShowEditModal(true);
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      await updateTeacher(selectedTeacher.id, editData);
      setShowEditModal(false);
      fetchTeachers();
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour des informations.");
    }
  };

  const confirmDelete = async () => {
    try {
      if (selectedTeacher) {
        await deleteTeacher(selectedTeacher.id);
        setShowDeleteModal(false);
        setSelectedTeacher(null);
        fetchTeachers();
      }
    } catch (error) {
      // Capturer l'erreur de contrainte si elle survient
      const msg = error.response?.data?.error || "Erreur lors de la suppression. L'enseignant est peut-être lié à des cours actifs.";
      setErrorMessage(msg);
      setShowDeleteModal(false);
    }
  };

  // --- FILTRAGE ET GROUPEMENT ---
  const filteredTeachers = teachers.filter(t => 
    t.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.departement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTeachers = filteredTeachers.reduce((acc, curr) => {
    const dept = curr.departement || "Non Classé";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(curr);
    return acc;
  }, {});

  const totalTeachers = teachers.length;
  const countVoeux = teachers.filter(t => t.desid && t.desid.length > 0).length;
  const pourcentageVoeux = totalTeachers > 0 ? Math.round((countVoeux / totalTeachers) * 100) : 0;

  return (
    <AdminLayout>
      {/* --- ALERTES D'ERREUR --- */}
      {errorMessage && (
        <div className="fixed top-24 right-10 z-[1000] bg-white border-l-4 border-red-500 shadow-2xl p-4 rounded-r-xl flex items-center space-x-4 animate-in slide-in-from-right duration-300">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <p className="text-xs font-black uppercase text-red-500 tracking-widest">Erreur Système</p>
            <p className="text-sm text-slate-600 font-medium">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-slate-300 hover:text-slate-500 transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* --- EN-TÊTE --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] italic uppercase tracking-widest leading-tight">Gestion des Enseignants</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">UY1 - ICT</span>
            <span className="text-slate-300">•</span>
            <p className="text-slate-400 text-sm font-medium italic">Administration du corps professoral par département</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1d76f2] hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Ajouter un enseignant
        </button>
      </div>

      {/* --- CARTES STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center space-x-6 transition-transform hover:scale-[1.01]">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black shadow-inner">
            <UserSquare2 size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-1 leading-none text-left">Total Professeurs</p>
            <p className="text-4xl font-black text-slate-800 tracking-tighter text-left">{totalTeachers}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center space-x-6 transition-transform hover:scale-[1.01]">
          <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center font-black shadow-inner">
            <ClipboardList size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-1 leading-none text-left">Vœux Reçus</p>
            <p className="text-4xl font-black text-cyan-500 tracking-tighter text-left">{pourcentageVoeux}%</p>
          </div>
        </div>
      </div>

      {/* --- BARRE DE RECHERCHE --- */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 mb-8 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou département..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl outline-none font-medium text-slate-600 focus:bg-slate-50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLEAU --- */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
            <tr>
              <th className="px-8 py-5">Identité Enseignant</th>
              <th className="px-8 py-5">Département d'attache</th>
              <th className="px-8 py-5">Domaine de Spécialité</th>
              <th className="px-8 py-5 text-center">Cours (Codes UE)</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="py-20 text-center animate-pulse font-black text-slate-300 italic uppercase tracking-[4px]">Synchronisation avec la base...</td></tr>
            ) : Object.keys(groupedTeachers).length === 0 ? (
              <tr><td colSpan="5" className="py-20 text-center text-slate-300 italic font-medium uppercase tracking-widest">Aucun enseignant trouvé</td></tr>
            ) : (
              Object.keys(groupedTeachers).sort().map(dept => (
                <React.Fragment key={dept}>
                   <tr className="bg-slate-50/80 border-y border-slate-100">
                    <td colSpan="5" className="px-8 py-3 text-blue-600 font-black text-[11px] uppercase tracking-[3px]">
                        <Bookmark size={14} className="inline mr-2" /> Département : {dept}
                    </td>
                  </tr>
                  {groupedTeachers[dept].map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6 text-left">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 border-2 border-white shadow-sm transition-transform group-hover:scale-105 uppercase">
                            {t.nom.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#1E293B] uppercase">{t.nom}</p>
                            <p className="text-xs text-slate-400 italic font-medium tracking-tight">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-tighter text-left">{t.departement}</td>
                      <td className="px-8 py-6 text-left">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-blue-100">
                          {t.specialite || 'Généraliste'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-wrap justify-center gap-1 max-w-[150px] mx-auto">
                          {t.ue && t.ue.length > 0 ? (
                            t.ue.map(u => (
                              <span key={u.id} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black border border-green-200 uppercase shadow-sm">
                                {u.code}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-200 text-[10px] italic">Non assigné</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleEditClick(t)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-sm"><Edit3 size={18} /></button>
                          <button onClick={() => { setSelectedTeacher(t); setShowDeleteModal(true); }} className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODALE AJOUT --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative border border-white/20 my-8">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-black text-slate-800 mb-8 italic uppercase tracking-widest text-center">Nouvel Enseignant</h2>
            
            <form onSubmit={handleAddTeacher} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom & Prénom</label>
                   <input type="text" required placeholder="Nom complet" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={newTeacher.nom} onChange={(e) => setNewTeacher({...newTeacher, nom: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contact Email</label>
                   <input type="email" required placeholder="Email (@uy1.cm)" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={newTeacher.email} onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Département</label>
                   <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer" onChange={(e) => setNewTeacher({...newTeacher, departement: e.target.value})} value={newTeacher.departement}>
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Biologie">Biologie</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Spécialité</label>
                   <input type="text" placeholder="ex: Réseaux & Télécoms" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none" value={newTeacher.specialite} onChange={(e) => setNewTeacher({...newTeacher, specialite: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[3px] ml-2 italic">Mot de passe initial (Session)</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input type="password" required placeholder="Définir un mot de passe sécurisé" className="w-full pl-14 pr-6 py-4 bg-slate-900 text-white rounded-2xl font-black outline-none placeholder:text-slate-500" value={newTeacher.password} onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-[3px] ml-2 italic">Attribution UE (Code)</label>
                <div className="relative">
                  <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-200" size={20} />
                  <input type="text" placeholder="ex: ICT203" className="w-full pl-14 pr-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl font-black text-blue-600 outline-none placeholder:text-blue-200 uppercase" value={newTeacher.ueCode} onChange={(e) => setNewTeacher({...newTeacher, ueCode: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-[#1d76f2] text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">Créer le Profil & Accès</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE MODIFICATION --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative border-2 border-blue-50 my-8 text-left">
            <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-black text-[#1E293B] mb-8 italic uppercase tracking-widest text-center">Mise à jour Enseignant</h2>
            
            <form onSubmit={handleUpdateTeacher} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Nom</label>
                  <input type="text" value={editData.nom} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700" onChange={(e) => setEditData({...editData, nom: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Email</label>
                  <input type="email" value={editData.email} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700" onChange={(e) => setEditData({...editData, email: e.target.value})} />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Département</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer" value={editData.departement} onChange={(e) => setEditData({...editData, departement: e.target.value})}>
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Biologie">Biologie</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Spécialité</label>
                  <input type="text" value={editData.specialite} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700" onChange={(e) => setEditData({...editData, specialite: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-800 uppercase ml-2 tracking-[3px] italic">Nouveau Mot de passe (Laisser vide si inchangé)</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input type="password" placeholder="Réinitialiser le mot de passe" className="w-full pl-14 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800" value={editData.password} onChange={(e) => setEditData({...editData, password: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase ml-2 tracking-[3px] italic">Assignation Unité d'Enseignement</label>
                <div className="relative">
                  <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                  <input type="text" value={editData.ueCode} className="w-full pl-14 pr-6 py-4 bg-blue-50/50 border border-blue-200 rounded-2xl font-black text-blue-600 uppercase" onChange={(e) => setEditData({...editData, ueCode: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase tracking-[4px]">Sauvegarder les modifications</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE SUPPRESSION --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[999] p-6 text-center animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] p-12 shadow-2xl border border-white/20">
            <Trash2 size={48} className="mx-auto text-red-500 mb-6 drop-shadow-lg" />
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-widest">Retrait Définitif</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium italic leading-relaxed px-4">Souhaitez-vous vraiment retirer <span className="text-red-500 font-bold">{selectedTeacher?.nom}</span> du corps enseignant ? Cette action est irréversible.</p>
            <div className="flex space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500 transition-all hover:bg-slate-200">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all hover:bg-red-600 active:scale-95">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeachers;