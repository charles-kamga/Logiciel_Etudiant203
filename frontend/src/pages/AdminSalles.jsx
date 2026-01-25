import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getSalles, createSalle, deleteSalle, updateSalle } from '../services/api'; 
import { 
  DoorOpen, Plus, Search, Trash2, Edit3, 
  Filter, X, CheckCircle2, AlertTriangle, ChevronDown 
} from 'lucide-react';

const AdminSalles = () => {
  const [salles, setSalles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // États pour les Modals
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nom: '' });
  
  // ÉTAT POUR LA MODIFICATION
  const [editModal, setEditModal] = useState({ 
    show: false, 
    salle: { id: '', nom: '', capacite: '', departement: '', batiment: '' } 
  });

  // ÉTAT POUR LA CRÉATION
  const [newSalle, setNewSalle] = useState({ 
    nom: '', 
    capacite: '', 
    departement: 'Informatique', // Valeur par défaut
    batiment: 'N/A' 
  });

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      const response = await getSalles();
      setSalles(response.data);
    } catch (error) { 
      console.error("Erreur chargement des salles:", error); 
    }
  };

  // --- LOGIQUE SUPPRESSION ---
  const openDeleteModal = (salle) => {
    setDeleteModal({ show: true, id: salle.id, nom: salle.nom });
  };

  const confirmDelete = async () => {
    try {
      await deleteSalle(deleteModal.id);
      fetchSalles();
      setDeleteModal({ show: false, id: null, nom: '' });
    } catch (error) { 
      alert("Erreur lors de la suppression"); 
    }
  };

  // --- LOGIQUE CRÉATION ---
  const handleAddSalle = async (e) => {
    e.preventDefault();
    try {
      // On envoie l'objet newSalle qui contient maintenant le département
      await createSalle(newSalle);
      fetchSalles();
      setShowModal(false);
      setNewSalle({ nom: '', capacite: '', departement: 'Informatique', batiment: 'N/A' });
    } catch (error) { 
      alert("Erreur lors de l'ajout"); 
    }
  };

  // --- LOGIQUE MODIFICATION (UPDATE) ---
  const openEditModal = (salle) => {
    // On s'assure que toutes les propriétés sont copiées, y compris le département
    setEditModal({ show: true, salle: { ...salle } });
  };

  const handleUpdateSalle = async (e) => {
    e.preventDefault();
    try {
      await updateSalle(editModal.salle.id, editModal.salle);
      fetchSalles();
      setEditModal({ show: false, salle: null });
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  // --- RECHERCHE ET FILTRAGE ---
  const filteredSalles = salles.filter(s => 
    s.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.departement && s.departement.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.batiment && s.batiment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Groupement par département pour l'affichage
  const sallesParDept = filteredSalles.reduce((acc, salle) => {
    const dept = salle.departement || "Non classé";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(salle);
    return acc;
  }, {});

  return (
    <AdminLayout>
      {/* HEADER & BOUTON AJOUT */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Gestion des Salles</h1>
          <p className="text-slate-400 text-sm font-medium">UY1 - ICT • Administration des infrastructures </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#1d76f2] hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Ajouter une salle
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 text-left">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Salles</p>
          <p className="text-4xl font-black text-slate-800">{filteredSalles.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 text-left">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Capacité Totale</p>
          <p className="text-4xl font-black text-[#1d76f2]">
            {filteredSalles.reduce((acc, s) => acc + s.capacite, 0)} <span className="text-sm font-bold text-slate-300 tracking-normal text-right">places</span>
          </p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between">
           <div className="text-left">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">État Système</p>
            <p className="text-2xl font-black text-emerald-500 italic">Optimisé</p>
           </div>
           <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
           </div>
        </div>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 mb-8 flex items-center space-x-4 text-left">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, département ou bâtiment..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
          <Filter size={20} />
        </button>
      </div>

      {/* AFFICHAGE DES SALLES PAR DÉPARTEMENT */}
      <div className="space-y-12">
        {Object.keys(sallesParDept).length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-400">
            <DoorOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">Aucune salle ne correspond à votre recherche</p>
          </div>
        ) : (
          Object.entries(sallesParDept).map(([dept, list]) => (
            <div key={dept} className="space-y-5">
              <div className="flex items-center space-x-4 ml-2">
                <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest text-left">
                  Département : <span className="text-blue-600 italic">{dept}</span>
                </h2>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                    {list.length} Salles
                </span>
              </div>
              
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <tr>
                      <th className="px-8 py-5">Nom de la Salle</th>
                      <th className="px-8 py-5">Bâtiment</th>
                      <th className="px-8 py-5 text-center">Capacité</th>
                      <th className="px-8 py-5 text-center">Statut</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {list.map((salle) => (
                      <tr key={salle.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <DoorOpen size={20} />
                            </div>
                            <span className="font-bold text-slate-700">{salle.nom}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-slate-400 font-medium">{salle.batiment}</td>
                        <td className="px-8 py-6 text-center">
                          <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-xs font-black italic">
                            {salle.capacite}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg uppercase border border-emerald-100 italic">
                            Disponible
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right text-left">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => openEditModal(salle)}
                              className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => openDeleteModal(salle)}
                              className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL CRÉATION */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 text-left">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-12 shadow-2xl relative border border-white/20">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight italic uppercase underline decoration-blue-500 decoration-4 underline-offset-8">Nouvelle Salle</h2>
            <p className="text-slate-400 mb-8 text-sm font-medium mt-4">Enregistrez un nouvel espace d'enseignement</p>

            <form onSubmit={handleAddSalle} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Nom / Code</label>
                  <input 
                    type="text" required placeholder="ex: Salle 105" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    onChange={(e) => setNewSalle({...newSalle, nom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Capacité (Places)</label>
                  <input 
                    type="number" required placeholder="ex: 60" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    onChange={(e) => setNewSalle({...newSalle, capacite: e.target.value})}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Département d'affectation</label>
                <div className="relative">
                    <select 
                    className="w-full px-6 py-4 bg-white border border-blue-400 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer font-bold text-slate-700 appearance-none shadow-sm"
                    onChange={(e) => setNewSalle({...newSalle, departement: e.target.value})}
                    value={newSalle.departement}
                    >
                        <option value="Informatique">Informatique</option>
                        <option value="Mathématiques">Mathématiques</option>
                        <option value="Physique">Physique</option>
                        <option value="Chimie">Chimie</option>
                        <option value="Biologie">Biologie</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Localisation (Bâtiment)</label>
                <input 
                  type="text" placeholder="ex: Bloc P (Amphi 100)" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  onChange={(e) => setNewSalle({...newSalle, batiment: e.target.value})}
                />
              </div>
              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">Annuler</button>
                <button type="submit" className="flex-1 py-5 bg-[#1d76f2] text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFICATION (EDIT) */}
      {editModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-6 text-left">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-12 shadow-2xl relative border border-white/20 border-blue-100">
            <button 
                onClick={() => setEditModal({ show: false, salle: null })} 
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-800 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight italic uppercase underline decoration-blue-500 decoration-4 underline-offset-8">Modifier la Salle</h2>
            <p className="text-slate-400 mb-8 text-sm font-medium mt-4">Mise à jour des informations de l'espace</p>

            <form onSubmit={handleUpdateSalle} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Nom / Code</label>
                  <input 
                    type="text" required 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={editModal.salle.nom}
                    onChange={(e) => setEditModal({
                      ...editModal, 
                      salle: { ...editModal.salle, nom: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Capacité (Places)</label>
                  <input 
                    type="number" required 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={editModal.salle.capacite}
                    onChange={(e) => setEditModal({
                      ...editModal, 
                      salle: { ...editModal.salle, capacite: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Département</label>
                <div className="relative">
                    <select 
                    className="w-full px-6 py-4 bg-white border border-blue-400 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer font-bold text-slate-700 appearance-none shadow-sm"
                    value={editModal.salle.departement}
                    onChange={(e) => setEditModal({
                        ...editModal, 
                        salle: { ...editModal.salle, departement: e.target.value }
                    })}
                    >
                        <option value="Informatique">Informatique</option>
                        <option value="Mathématiques">Mathématiques</option>
                        <option value="Physique">Physique</option>
                        <option value="Chimie">Chimie</option>
                        <option value="Biologie">Biologie</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Localisation (Bâtiment)</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  value={editModal.salle.batiment}
                  onChange={(e) => setEditModal({
                    ...editModal, 
                    salle: { ...editModal.salle, batiment: e.target.value }
                  })}
                />
              </div>
              <div className="flex space-x-4 pt-6">
                <button 
                    type="button" 
                    onClick={() => setEditModal({ show: false, salle: null })} 
                    className="flex-1 py-5 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase tracking-widest"
                >
                    Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUPPRESSION */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-inner">
              <AlertTriangle size={40} />
            </div>
            <div className="mb-10">
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight italic uppercase underline decoration-red-500 decoration-4 underline-offset-8">Supprimer ?</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4 mt-6">
                Voulez-vous vraiment supprimer <span className="font-bold text-slate-800">"{deleteModal.nom}"</span> ? 
                Cette action affectera les cours déjà programmés.
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null, nom: '' })}
                className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSalles;