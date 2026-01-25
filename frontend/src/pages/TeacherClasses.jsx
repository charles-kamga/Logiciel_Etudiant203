import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherLayout from '../components/TeacherLayout'; 
import { 
  Plus, Calendar, Clock, MapPin, Trash2, Edit3, 
  X, CheckCircle2, GraduationCap, AlertCircle, Bell 
} from 'lucide-react';

const TeacherClasses = () => {
  
  // --- ÉTATS POUR LES DONNÉES DE LA BD --- 
  const [sessions, setSessions] = useState([]);
  const [salles, setSalles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [myUEs, setMyUEs] = useState([]);
  
  // --- ÉTATS POUR LE FORMULAIRE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [formData, setFormData] = useState({
    ueId: '', classeId: '', salleId: '', jour: '', plageHoraire: '', date: ''
  });

  // --- ÉTATS POUR LES NOTIFICATIONS & CONFIRMATIONS ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // État pour gérer la contrainte de filtrage des salles (Capacité >= Effectif)
  const [selectedClasseEffectif, setSelectedClasseEffectif] = useState(0);

  // --- RÉCUPÉRATION SÉCURISÉE DE L'ID ---
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const teacherId = currentUser.id; 

  // --- 1. CHARGEMENT DES DONNÉES ---
  const fetchInitialData = async () => {
    if (!teacherId) {
      console.error("Erreur : Aucun ID d'enseignant trouvé dans la session !");
      return;
    }
    try {
      // Utilisation de routes qui correspondent exactement à ton server.js
      const [resSalles, resClasses, resUEs, resSessions] = await Promise.all([
        axios.get('http://localhost:5000/api/salles'),
        axios.get('http://localhost:5000/api/classes'),
        axios.get(`http://localhost:5000/api/teachers/${teacherId}/ues`),
        axios.get(`http://localhost:5000/api/teachers/${teacherId}/sessions`) // Correction de la route ici
      ]);
      
      setSalles(resSalles.data || []);
      setClasses(resClasses.data || []);
      setMyUEs(resUEs.data || []);
      setSessions(resSessions.data || []);

    } catch (err) {
      console.error("Détails de l'erreur de chargement :", err);
      // On ne déclenche l'alerte rouge que si les données critiques manquent
      triggerNotification("Erreur lors du chargement des données", "error");
    }
  };

  useEffect(() => {
    if (teacherId) {
        fetchInitialData();
    }
  }, [teacherId]);

  // --- 2. LOGIQUE DE NOTIFICATION ---
  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
  };

  // --- 3. FILTRAGE DES SALLES (CONTRAINTE CAHIER DE CHARGE) ---
  const filteredSalles = salles.filter(salle => {
    if (!formData.classeId) return true;
    return salle.capacite >= selectedClasseEffectif;
  });

  // --- 4. GESTIONNAIRES D'ÉVÉNEMENTS (CRUD) ---

  const handleClasseChange = (e) => {
    const id = e.target.value;
    const selectedCls = classes.find(c => c.id === parseInt(id));
    setFormData({ ...formData, classeId: id, salleId: '' }); 
    setSelectedClasseEffectif(selectedCls ? selectedCls.effectif : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ueId: parseInt(formData.ueId),
        classeId: parseInt(formData.classeId),
        salleId: parseInt(formData.salleId),
        jour: formData.jour,
        plageHoraire: formData.plageHoraire,
        date: formData.date
      };

      if (editMode) {
        await axios.put(`http://localhost:5000/api/sessions/${currentSessionId}`, payload);
        triggerNotification("Séance mise à jour avec succès !");
      } else {
        await axios.post('http://localhost:5000/api/sessions', payload);
        triggerNotification("Nouvelle séance enregistrée !");
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      triggerNotification(err.response?.data?.error || "Erreur d'enregistrement", "error");
    }
  };

  const openDeleteConfirm = (session) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/sessions/${sessionToDelete.id}`);
      setShowDeleteModal(false);
      triggerNotification("Séance supprimée de votre emploi du temps");
      fetchInitialData();
    } catch (err) {
      triggerNotification("Erreur lors de la suppression", "error");
    }
  };

  const openEdit = (session) => {
    const selectedCls = classes.find(c => c.id === session.classeId);
    setSelectedClasseEffectif(selectedCls ? selectedCls.effectif : 0);
    setEditMode(true);
    setCurrentSessionId(session.id);
    setFormData({
      ueId: session.ueId.toString(),
      classeId: session.classeId.toString(),
      salleId: session.salleId.toString(),
      jour: session.jour,
      plageHoraire: session.plageHoraire,
      date: session.date.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ ueId: '', classeId: '', salleId: '', jour: '', plageHoraire: '', date: '' });
    setSelectedClasseEffectif(0);
    setEditMode(false);
    setCurrentSessionId(null);
  };

  return (
    <TeacherLayout>
      {/* --- TOAST NOTIFICATION --- */}
      {notification.show && (
        <div className={`fixed top-10 right-10 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold text-sm uppercase tracking-wider">{notification.message}</p>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-10">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">PROGRAMMATIONS</h1>
          <p className="text-slate-400 font-medium italic text-left">Gérez vos séances d'enseignement en respectant les capacités de salles.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-8 py-4 rounded-[20px] font-bold shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Nouvelle séance
        </button>
      </div>

      {/* --- TABLEAU --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Unité d'Enseignement / Cours</th>
              <th className="px-8 py-5">Classe & Effectif</th>
              <th className="px-8 py-5">Lieu / Salle</th>
              <th className="px-8 py-5">Date & Créneau</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-24 text-center text-slate-300">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="italic font-medium uppercase tracking-widest text-xs">Aucune programmation trouvée</p>
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 text-left">
                    <p className="font-bold text-slate-700 uppercase italic tracking-tighter">({s.ue?.code}) : {s.ue?.nom}</p>
                    <div className="flex items-center gap-1 mt-1 text-left">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">Session Validée</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs italic"><GraduationCap size={16} /> {s.classe?.nom}</div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter text-left">Effectif : {s.classe?.effectif} élèves</p>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black text-white flex items-center w-fit gap-2 uppercase tracking-wider">
                      <MapPin size={12} className="text-blue-400" /> {s.salle?.nom}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex items-center gap-2 font-black text-slate-700 text-sm italic tracking-tight"><Calendar size={14} className="text-blue-600" /> {s.jour} • {new Date(s.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-extrabold uppercase tracking-widest text-left"><Clock size={12} /> {s.plageHoraire}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(s)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"><Edit3 size={18}/></button>
                      <button onClick={() => openDeleteConfirm(s)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL SUPPRESSION --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm text-center">
          <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={40} /></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 italic">Supprimer la séance ?</h2>
            <p className="text-slate-400 text-sm font-medium mb-8 italic">Cette action est irréversible. La plage horaire sera libérée.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-all">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-red-600 transition-all active:scale-95">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL FORMULAIRE --- */} 
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="text-left">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">{editMode ? 'MODIFIER LA SÉANCE' : 'NOUVELLE PROGRAMMATION'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic text-left">Vérification de la capacité et disponibilité des salles</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full shadow-sm transition-all text-right"><X size={24} className="text-slate-400" /></button>
            </div>
            <div className="p-10 space-y-8 text-left">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 italic text-left">Sélection de l'UE</label>
                  <select required value={formData.ueId} onChange={e => setFormData({...formData, ueId: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all uppercase text-sm">
                    <option value="">Choisir un cours...</option>
                    {myUEs.map(ue => <option key={ue.id} value={ue.id}>{ue.code} - {ue.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 italic text-left">Classe de destination</label>
                  <select required value={formData.classeId} onChange={handleClasseChange} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all uppercase text-sm">
                    <option value="">Choisir la classe...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.effectif} élèves)</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 italic text-left">Salle (Filtrage capacité)</label>
                  <select required disabled={!formData.classeId} value={formData.salleId} onChange={e => setFormData({...formData, salleId: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all uppercase text-sm">
                    <option value="">{formData.classeId ? 'Sélectionner un lieu...' : 'Défisissez la classe d\'abord'}</option>
                    {filteredSalles.map(s => <option key={s.id} value={s.id}>{s.nom} (Capacité: {s.capacite})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 italic text-left">Jour de la semaine</label>
                  <select required value={formData.jour} onChange={e => setFormData({...formData, jour: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all uppercase text-sm">
                    <option value="">Choisir un jour...</option>
                    {['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'].map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 italic text-left">Date effective</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 italic text-left">Plage Horaire</label>
                  <select required value={formData.plageHoraire} onChange={e => setFormData({...formData, plageHoraire: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all uppercase text-sm">
                    <option value="">Choisir l'heure...</option>
                    <option>08:00 - 10:00</option><option>10:00 - 12:00</option><option>13:00 - 15:00</option><option>15:00 - 17:00</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 rounded-[24px] transition-all">Abandonner</button>
                 <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                  {editMode ? 'Sauvegarder les modifications' : 'Enregistrer la séance'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherClasses;