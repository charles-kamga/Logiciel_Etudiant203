import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
// Importation mise à jour avec updateClasse
import { getClasses, createClasse, deleteClasse, updateClasse } from '../services/api'; 
import { 
  Users, Plus, Layers, Search, Trash2, Edit3, X, 
  Bookmark, AlertTriangle, CheckCircle2, MoreHorizontal 
} from 'lucide-react';

const AdminClasses = () => {
  // --- ÉTATS ---
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState(null);

  const [newClasse, setNewClasse] = useState({ 
    nom: '', 
    effectif: '', 
    departement: 'Informatique', 
    filiere: '' 
  });

  // --- NOUVEL ÉTAT POUR LA MODIFICATION ---
  const [editData, setEditData] = useState({ 
    nom: '', 
    effectif: '', 
    departement: 'Informatique', 
    filiere: '' 
  });

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getClasses();
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des classes");
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  // Ouvrir la modale d'édition et pré-remplir les champs
  const handleOpenEdit = (cls) => {
    setSelectedClass(cls);
    setEditData({
      nom: cls.nom,
      effectif: cls.effectif,
      departement: cls.departement || 'Informatique',
      filiere: cls.filiere || ''
    });
    setShowEditModal(true);
  };

  const handleAddClasse = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { 
        ...newClasse, 
        effectif: parseInt(newClasse.effectif) 
      };
      await createClasse(dataToSend);
      fetchClasses();
      setShowAddModal(false);
      setNewClasse({ nom: '', effectif: '', departement: 'Informatique', filiere: '' });
    } catch (error) { 
      alert("Erreur lors de l'ajout : Vérifiez que le nom est unique."); 
    }
  };

  // NOUVELLE FONCTION : Soumettre la modification
  const handleUpdateClasse = async (e) => {
    e.preventDefault();
    try {
      await updateClasse(selectedClass.id, {
        ...editData,
        effectif: parseInt(editData.effectif)
      });
      fetchClasses();
      setShowEditModal(false);
      setSelectedClass(null);
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteClasse(selectedClass.id);
      fetchClasses();
      setShowDeleteModal(false);
      setSelectedClass(null);
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  // --- LOGIQUE DE FILTRAGE ET GROUPEMENT ---
  const filteredClasses = classes.filter(c => 
    c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.departement.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.filiere?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedClasses = filteredClasses.reduce((acc, curr) => {
    const dept = curr.departement || "Non Classé";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(curr);
    return acc;
  }, {});

  const totalEtudiants = filteredClasses.reduce((acc, curr) => acc + (curr.effectif || 0), 0);
  const totalSallesOccupees = filteredClasses.filter(c => (c.progression || 0) > 0).length;

  return (
    <AdminLayout>
      {/* --- EN-TÊTE DE LA PAGE --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Gestion des Classes</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-slate-300">•</span>
            <p className="text-slate-400 text-sm font-medium italic">Administration des effectifs par département</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1d76f2] hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Créer une classe
        </button>
      </div>

      {/* --- CARTES DE STATISTIQUES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group hover:border-blue-100 transition-colors">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-2">Effectif Global</p>
            <p className="text-4xl font-black text-slate-800 tracking-tighter">
                {totalEtudiants} <span className="text-sm font-bold text-slate-300 uppercase italic ml-2">Étudiants inscrits</span>
            </p>
          </div>
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Users size={32} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 group hover:border-emerald-100 transition-colors">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-2">Suivi des plannings</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-4xl font-black text-emerald-500">{totalSallesOccupees}</p>
            <p className="text-slate-400 font-bold text-lg italic tracking-tight uppercase">classes en cours sur {filteredClasses.length}</p>
          </div>
        </div>
      </div>

      {/* --- BARRE DE RECHERCHE --- */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 mb-8 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une classe, un département, une spécialité..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl text-slate-700 placeholder:text-slate-300 outline-none font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLEAU DES DONNÉES --- */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
            <tr>
              <th className="px-8 py-5">Identifiant Classe</th>
              <th className="px-8 py-5">Filière / Spécialité</th>
              <th className="px-8 py-5 text-center">Effectif</th>
              <th className="px-8 py-5 w-64">Progression EDT</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="py-20 text-center animate-pulse font-black text-slate-300 italic uppercase tracking-[4px]">Chargement des données...</td></tr>
            ) : Object.keys(groupedClasses).length === 0 ? (
              <tr><td colSpan="5" className="py-20 text-center text-slate-400 italic">Aucune donnée trouvée.</td></tr>
            ) : (
              Object.keys(groupedClasses).sort().map(dept => (
                <React.Fragment key={dept}>
                  <tr className="bg-slate-50/80">
                    <td colSpan="5" className="px-8 py-3">
                      <div className="flex items-center text-blue-600 font-black text-[11px] uppercase tracking-[3px]">
                        <Bookmark size={14} className="mr-2" /> Département : {dept}
                      </div>
                    </td>
                  </tr>
                  {groupedClasses[dept].map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                            <Layers size={18} />
                          </div>
                          <span className="font-black text-slate-700">{cls.nom}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-tight">{cls.filiere || 'Tronc Commun'}</td>
                      <td className="px-8 py-6 text-center font-black text-slate-800 italic">{cls.effectif}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1d76f2]" style={{width: `${cls.progression || 0}%`}}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-300">{cls.progression || 0}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleOpenEdit(cls)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Edit3 size={18} /></button>
                          <button onClick={() => { setSelectedClass(cls); setShowDeleteModal(true); }} className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
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

      {/* --- MODALE D'AJOUT --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight italic uppercase tracking-widest">Nouvelle Classe</h2>
            
            <form onSubmit={handleAddClasse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Code de la Classe (Identifiant)</label>
                  <input 
                    type="text" required placeholder="ex: ICT-L2" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={(e) => setNewClasse({...newClasse, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Effectif Total (Nombre)</label>
                  <input 
                    type="number" required placeholder="ex: 120" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={(e) => setNewClasse({...newClasse, effectif: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Département d'attache</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer"
                    onChange={(e) => setNewClasse({...newClasse, departement: e.target.value})}
                    value={newClasse.departement}
                  >
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Biologie">Biologie</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Filière / Spécialisation</label>
                  <input 
                    type="text" placeholder="ex: Génie Logiciel" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={(e) => setNewClasse({...newClasse, filiere: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-[#1d76f2] text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Créer la classe et synchroniser
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE DE MODIFICATION (MISE À JOUR) --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-12 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center space-x-4 mb-10">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Edit3 size={24}/></div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Modifier Classe</h2>
            </div>
            
            <form onSubmit={handleUpdateClasse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Intitulé de la Classe</label>
                  <input 
                    type="text" 
                    value={editData.nom} 
                    onChange={(e) => setEditData({...editData, nom: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Nouvel Effectif</label>
                  <input 
                    type="number" 
                    value={editData.effectif} 
                    onChange={(e) => setEditData({...editData, effectif: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Département d'attache</label>
                <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEditData({...editData, departement: e.target.value})}
                    value={editData.departement}
                  >
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Biologie">Biologie</option>
                  </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Filière / Spécialisation</label>
                <input 
                  type="text" 
                  value={editData.filiere} 
                  onChange={(e) => setEditData({...editData, filiere: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <button type="submit" className="w-full py-5 bg-[#1d76f2] text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all">Mettre à jour les données</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE DE SUPPRESSION --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] p-12 shadow-2xl text-center">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={48} /></div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight italic">Supprimer définitivement ?</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">
              Cette action supprimera la classe <span className="text-red-500 font-bold uppercase">{selectedClass?.nom}</span> ainsi que tous ses emplois du temps associés.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-100 hover:bg-red-600 transition-all">Confirmer la suppression</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClasses;