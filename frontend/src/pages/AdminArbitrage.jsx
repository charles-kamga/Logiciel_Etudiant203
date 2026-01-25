import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Gavel, RefreshCw, AlertTriangle, AlertCircle, 
  Trash2, Settings2, CheckCircle2 
} from 'lucide-react';

const AdminArbitrage = () => {
  // Simulation des conflits détectés par l'algorithme
  const [conflits, setConflits] = useState([
    {
      id: 1,
      type: 'Collision de Salle',
      priorite: 'HAUTE',
      details: 'Amphi 250 occupé par ICT-L2 et MAT-L1',
      temps: 'LUNDI 08:00',
      icone: AlertTriangle,
      color: 'orange'
    },
    {
      id: 2,
      type: 'Double Programmation',
      priorite: 'CRITIQUE',
      details: 'Dr. Tanon affecté à deux cours simultanés',
      temps: 'MARDI 10:00',
      icone: AlertCircle,
      color: 'red'
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRefresh = () => {
    setIsAnalyzing(true);
    // Simuler une analyse de 1.5s
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <AdminLayout>
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center">
            Module d'Arbitrage
          </h1>
          <p className="text-slate-400 text-sm">Résolution des conflits et ajustements finaux</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center space-x-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
        >
          <RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
          <span>Actualiser l'analyse</span>
        </button>
      </div>

      {/* --- BANNIÈRE D'ALERTE --- */}
      {conflits.length > 0 && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
          <div className="flex items-center space-x-3 mb-2 text-red-700 font-black">
            <AlertCircle size={20} />
            <span className="uppercase tracking-wider text-sm">Attention : {conflits.length} conflits détectés</span>
          </div>
          <p className="text-red-600/80 text-sm">
            Le planning final ne peut pas être publié tant que ces erreurs persistent.
          </p>
        </div>
      )}

      {/* --- LISTE DES CONFLITS --- */}
      <div className="space-y-4">
        {conflits.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] border border-slate-100 text-center">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Aucun conflit détecté</h3>
            <p className="text-slate-400">Le planning est prêt à être publié.</p>
          </div>
        ) : (
          conflits.map((conflit) => (
            <div 
              key={conflit.id} 
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
            >
              <div className="flex items-center space-x-6">
                {/* Icône de statut */}
                <div className={`w-14 h-14 bg-${conflit.color}-50 text-${conflit.color}-500 rounded-2xl flex items-center justify-center shadow-inner`}>
                  <conflit.icone size={28} />
                </div>

                {/* Détails du conflit */}
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-${conflit.color}-100 text-${conflit.color}-700 uppercase`}>
                      {conflit.priorite}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {conflit.temps}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800">{conflit.type}</h3>
                  <p className="text-slate-500 font-medium">{conflit.details}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
                  Arbitrer
                </button>
                <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- SECTION INFOS --- */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-100/50 p-6 rounded-[24px] border border-dashed border-slate-200">
          <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Aide à l'arbitrage</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Le bouton <strong>Arbitrer</strong> permet de déplacer un cours vers une salle libre.</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Le système privilégie les salles de capacité adaptée à l'effectif.</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminArbitrage;