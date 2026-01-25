import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ClipboardList, Check, X, Search, Filter, Clock, User, BookOpen } from 'lucide-react';

const AdminVoeux = () => {
  // Données de test (à connecter au Backend plus tard)
  const [voeux, setVoeux] = useState([
    { id: 1, prof: 'Dr. Tanon', ue: 'ICT203', jour: 'Lundi', slot: '08:00 - 10:00', statut: 'En attente' },
    { id: 2, prof: 'Mme Eboa', ue: 'MAT101', jour: 'Mercredi', slot: '10:00 - 12:00', statut: 'Validé' },
    { id: 3, prof: 'Dr. Tanon', ue: 'ICT205', jour: 'Mardi', slot: '13:00 - 15:00', statut: 'Rejeté' },
  ]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Désidératas Enseignants</h1>
          <p className="text-slate-400 text-sm">Consultez et arbitrez les préférences horaires des enseignants</p>
        </div>
        <div className="flex space-x-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center space-x-2 shadow-sm">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600">12 nouveaux vœux</span>
          </div>
        </div>
      </div>

      {/* --- STATS RAPIDES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Requêtes</p>
          <p className="text-3xl font-black text-slate-800">{voeux.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm border-l-4 border-l-green-500">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Validés</p>
          <p className="text-3xl font-black text-green-600">1</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm border-l-4 border-l-orange-500">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">En attente</p>
          <p className="text-3xl font-black text-orange-600">1</p>
        </div>
      </div>

      {/* --- RECHERCHE ET FILTRES --- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un enseignant ou une UE..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
                <Filter size={16} />
                <span>Filtrer par Statut</span>
            </button>
        </div>
      </div>

      {/* --- LISTE DES VŒUX --- */}
      <div className="space-y-4">
        {voeux.map((v) => (
          <div key={v.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  v.statut === 'Validé' ? 'bg-green-50 text-green-600' : 
                  v.statut === 'Rejeté' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{v.prof}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <BookOpen size={14} className="mr-1" /> {v.ue}
                    </span>
                    <span className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Clock size={14} className="mr-1" /> {v.jour}, {v.slot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                  v.statut === 'Validé' ? 'bg-green-100 text-green-700' : 
                  v.statut === 'Rejeté' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {v.statut}
                </span>

                <div className="flex items-center space-x-2">
                  <button className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Valider">
                    <Check size={20} />
                  </button>
                  <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Rejeter">
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminVoeux;