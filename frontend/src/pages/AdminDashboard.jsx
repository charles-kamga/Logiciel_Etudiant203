import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getStats, getClasses, getTeachers, getStudents } from '../services/api'; 
import { 
  Users, DoorOpen, ClipboardCheck, AlertTriangle, 
  Search, Layers, Home, UserSquare2, GraduationCap, 
  MoreHorizontal, Filter 
} from 'lucide-react';

const AdminDashboard = () => {
  // --- 1. ÉTAT DES DONNÉES ---
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    countTeachers: 0,
    countSalles: 0,
    countVoeux: 0,
    capaciteTotale: 0
  });

  const [classesList, setClassesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation entre les listes : 'CLASSES', 'TEACHERS', 'STUDENTS'
  const [activeTab, setActiveTab] = useState('CLASSES');

  // --- 2. ÉTAT DES FILTRES ---
  const [filters, setFilters] = useState({
    recherche: '',
    departement: 'Tous',
    statut: 'Tous'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Statistiques
        const resStats = await getStats();
        if (resStats.data) setStats(resStats.data);

        // 2. Classes
        const resClasses = await getClasses();
        if (resClasses.data) {
          setClassesList(resClasses.data.map(c => ({
            ...c,
            dept: c.departement || c.filiere || 'Informatique',
            prog: 45,
            statut: 'En cours'
          })));
        }

        // 3. Enseignants
        const resTeachers = await getTeachers();
        if (resTeachers.data) {
          setTeachersList(resTeachers.data.map(t => ({
            ...t,
            dept: t.departement || 'Informatique',
            charge: 60, // Simulation charge horaire
            statut: 'Actif'
          })));
        }

        // 4. Étudiants
        const resStudents = await getStudents();
        if (resStudents.data) {
          setStudentsList(resStudents.data.map(s => ({
            ...s,
            dept: s.filiere || 'Informatique',
            niveau: s.classe?.nom || 'N/A',
            prog: 85, // Simulation progression
            statut: 'Inscrit'
          })));
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement des données:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 3. LOGIQUE DE FILTRAGE UNIFIÉE ---
  const getFilteredData = () => {
    let list = [];
    if (activeTab === 'CLASSES') list = classesList;
    else if (activeTab === 'TEACHERS') list = teachersList;
    else if (activeTab === 'STUDENTS') list = studentsList;

    return list.filter(item => {
      const name = item.nom || item.name || '';
      const matchSearch = name.toLowerCase().includes(filters.recherche.toLowerCase());
      const matchDept = filters.departement === 'Tous' || item.dept === filters.departement;
      const matchStatut = filters.statut === 'Tous' || item.statut === filters.statut;
      return matchSearch && matchDept && matchStatut;
    });
  };

  const currentData = getFilteredData();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">Console Centrale</h1>
          <p className="text-slate-400 text-sm font-medium">Vue globale et paramétrage des emplois du temps</p>
        </div>
      </div>

      {/* --- SECTION 1 : CHIFFRES CLÉS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Étudiants', val: stats.totalEtudiants, icon: Users, color: 'blue', sub: 'Effectif total' },
          { label: 'Salles', val: stats.countSalles, icon: Home, color: 'orange', sub: 'Espaces en DB' },
          { label: 'Capacité', val: stats.capaciteTotale, icon: DoorOpen, color: 'emerald', sub: 'Places assises' },
          { label: 'Enseignants', val: stats.countTeachers, icon: ClipboardCheck, color: 'purple', sub: 'Enregistrés' },
          { label: 'Conflits', val: stats.countVoeux, icon: AlertTriangle, color: 'red', sub: 'À arbitrer' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-3`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-black text-slate-800 tracking-tighter">{s.val}</p>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{s.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION 2 : CONTENEUR PRINCIPAL DES LISTES --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* HEADER & TABS */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col space-y-6">
            
            {/* NAVIGATION PAR ONGLETS */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button 
                onClick={() => {setActiveTab('CLASSES'); setFilters({...filters, recherche: ''})}}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'CLASSES' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center"><Layers size={14} className="mr-2"/> Classes</div>
              </button>
              <button 
                onClick={() => {setActiveTab('TEACHERS'); setFilters({...filters, recherche: ''})}}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'TEACHERS' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center"><UserSquare2 size={14} className="mr-2"/> Enseignants</div>
              </button>
              <button 
                onClick={() => {setActiveTab('STUDENTS'); setFilters({...filters, recherche: ''})}}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STUDENTS' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center"><GraduationCap size={14} className="mr-2"/> Étudiants</div>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
               <h3 className="text-lg font-bold text-slate-800 italic">
                {activeTab === 'CLASSES' && "Gestion des Promotions"}
                {activeTab === 'TEACHERS' && "Corps Enseignant"}
                {activeTab === 'STUDENTS' && "Registre des Étudiants"}
                <span className="ml-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">({currentData.length} entrées)</span>
              </h3>

              {/* BARRE DE FILTRES DYNAMIQUE */}
              <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" placeholder={`Rechercher ${activeTab === 'CLASSES' ? 'une classe' : 'un nom'}...`}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={filters.recherche}
                    onChange={(e) => setFilters({...filters, recherche: e.target.value})}
                  />
                </div>

                <select 
                  className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none hover:border-blue-300 transition-colors"
                  value={filters.departement}
                  onChange={(e) => setFilters({...filters, departement: e.target.value})}
                >
                  <option value="Tous">Tous Départements</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Biologie">Biologie</option>
                </select>

                <select 
                  className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none hover:border-blue-300 transition-colors"
                  value={filters.statut}
                  onChange={(e) => setFilters({...filters, statut: e.target.value})}
                >
                  <option value="Tous">Tous Statuts</option>
                  <option value="Actif">Actif / Complet</option>
                  <option value="En cours">En cours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABLEAU DYNAMIQUE --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-[2px] border-b border-slate-50">
              <tr>
                {activeTab === 'CLASSES' && (
                  <>
                    <th className="px-8 py-5">Classe</th>
                    <th className="px-8 py-5">Département</th>
                    <th className="px-8 py-5 text-center">Effectif</th>
                    <th className="px-8 py-5">Progression EDT</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                  </>
                )}
                {activeTab === 'TEACHERS' && (
                  <>
                    <th className="px-8 py-5">Enseignant</th>
                    <th className="px-8 py-5">Spécialité / Dept</th>
                    <th className="px-8 py-5 text-center">Charge Horaire</th>
                    <th className="px-8 py-5">Disponibilité</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                  </>
                )}
                {activeTab === 'STUDENTS' && (
                  <>
                    <th className="px-8 py-5">Étudiant</th>
                    <th className="px-8 py-5">Matricule / Filière</th>
                    <th className="px-8 py-5 text-center">Classe Actuelle</th>
                    <th className="px-8 py-5">Présence / Suivi</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                  </>
                )}
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center text-slate-400 animate-pulse font-bold italic tracking-widest uppercase">Synchronisation...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-300 italic font-medium uppercase tracking-widest">Aucune donnée trouvée</td></tr>
              ) : (
                currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Colonne 1 : Identité */}
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3 text-left">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] border ${
                          activeTab === 'CLASSES' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          activeTab === 'TEACHERS' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {(item.nom || item.name || 'X').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800 text-sm tracking-tight">{item.nom || item.name}</span>
                      </div>
                    </td>

                    {/* Colonne 2 : Détails techniques */}
                    <td className="px-8 py-6">
                      <div className="text-left">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-tighter">{item.dept || item.specialite}</p>
                        {activeTab === 'STUDENTS' && <p className="text-[9px] text-slate-400 font-medium italic mt-0.5">{item.matricule || 'Sans matricule'}</p>}
                      </div>
                    </td>

                    {/* Colonne 3 : Quantitatif */}
                    <td className="px-8 py-6 text-center font-black text-[#1d76f2] italic text-sm">
                      {activeTab === 'CLASSES' ? item.effectif : 
                       activeTab === 'TEACHERS' ? '12h / sem' : 
                       item.niveau}
                    </td>

                    {/* Colonne 4 : Visuel Progression */}
                    <td className="px-8 py-6 w-56">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              activeTab === 'TEACHERS' ? 'bg-purple-500' : 
                              activeTab === 'STUDENTS' ? 'bg-emerald-500' : 'bg-[#1d76f2]'
                            }`} 
                            style={{width: `${item.prog || item.charge || 45}%`}}
                          ></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 italic">{item.prog || item.charge || 45}%</span>
                      </div>
                    </td>

                    {/* Colonne 5 : Statut Badge */}
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase border tracking-widest ${
                        item.statut === 'Actif' || item.statut === 'Complet' || item.statut === 'Inscrit'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {item.statut}
                      </span>
                    </td>

                    {/* Colonne 6 : Action */}
                    <td className="px-8 py-6 text-right">
                      <button className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border border-transparent shadow-sm uppercase tracking-widest ${
                        activeTab === 'CLASSES' ? 'text-[#1d76f2] hover:bg-blue-50 hover:border-blue-100' :
                        activeTab === 'TEACHERS' ? 'text-purple-600 hover:bg-purple-50 hover:border-purple-100' :
                        'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100'
                      }`}>
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER DE TABLEAU */}
        <div className="p-4 bg-white border-t border-slate-50 text-center">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[4px]">
             Système de Gestion Centralisé • UY1 ICT 2025/2026
           </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;