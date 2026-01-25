import React, { useState, useEffect, useRef } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { 
  FileText, Upload, Search, Trash2, 
  Download, Plus, BookOpen, X, Info, Tag,
  AlertTriangle, CheckCircle, FileDown
} from 'lucide-react';
import axios from 'axios';

const TeacherResources = () => {
  // --- ÉTATS PRINCIPAUX ---
  const [resources, setResources] = useState([]);
  const [myUEs, setMyUEs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ÉTATS DES MODALS ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // --- ÉTATS DE SÉLECTION ---
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({ title: '', ueId: '', categorie: 'Cours' });
  
  // --- ÉTATS DE CHARGEMENT ---
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null); 

  // Récupération de l'ID enseignant
  const userString = localStorage.getItem('currentUser');
  const currentUser = userString ? JSON.parse(userString) : {};
  const teacherId = currentUser.id ? parseInt(currentUser.id) : null;

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resUEs, resFiles] = await Promise.all([
        axios.get(`http://localhost:5000/api/teachers/${teacherId}/ues`).catch(() => ({ data: [] })),
        axios.get(`http://localhost:5000/api/teachers/${teacherId}/resources`).catch(() => ({ data: [] }))
      ]);
      setMyUEs(Array.isArray(resUEs.data) ? resUEs.data : []);
      setResources(Array.isArray(resFiles.data) ? resFiles.data : []);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DE RECHERCHE ---
  const filteredResources = resources.filter(res => 
    res.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.ue?.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ACTIONS DE TÉLÉVERSEMENT ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePublish = async () => {
    if (!selectedFile || !uploadData.title || !uploadData.ueId) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('nom', uploadData.title);
    formData.append('ueId', uploadData.ueId);
    formData.append('teacherId', teacherId);
    formData.append('categorie', uploadData.categorie);

    try {
      setIsProcessing(true);
      await axios.post('http://localhost:5000/api/resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadData({ title: '', ueId: '', categorie: 'Cours' });
      fetchData();
    } catch (err) {
      alert("Erreur lors de la publication.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- ACTIONS DE SUPPRESSION ---
  const openDeleteConfirm = (resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    try {
      setIsProcessing(true);
      await axios.delete(`http://localhost:5000/api/resources/${selectedResource.id}`);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- ACTIONS DE TÉLÉCHARGEMENT ---
  const openDownloadConfirm = (resource) => {
    setSelectedResource(resource);
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    if (!selectedResource) return;
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${selectedResource.url}`;
    link.target = "_blank";
    link.download = selectedResource.nom;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadModal(false);
  };

  return (
    <TeacherLayout>
      {/* --- HEADER --- */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
            Ressources Pédagogiques
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
            Gestion des supports de cours et documents
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-[3px] shadow-xl shadow-blue-100 flex items-center transition-all active:scale-95"
        >
          <Plus size={18} className="mr-2" /> Nouveau Document
        </button>
      </div>

      {/* --- BARRE DE RECHERCHE FONCTIONNELLE --- */}
      <div className="bg-white p-4 rounded-[22px] border border-slate-100 shadow-sm mb-8 flex items-center group focus-within:border-blue-300 transition-all">
        <Search className="ml-4 text-slate-300 group-focus-within:text-blue-500" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un document par nom ou par UE..." 
          className="flex-1 px-4 py-2 bg-transparent border-none outline-none font-bold text-slate-600 placeholder:text-slate-300"
        />
        {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="mr-4 text-slate-300 hover:text-slate-500">
                <X size={18} />
            </button>
        )}
      </div>

      {/* --- TABLEAU DES DOCUMENTS --- */}
      <div className="bg-white rounded-[35px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[4px] border-b border-slate-100">
            <tr>
              <th className="px-10 py-6">Document</th>
              <th className="px-10 py-6">Catégorie</th>
              <th className="px-10 py-6">UE</th>
              <th className="px-10 py-6">Date</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center text-slate-300 font-bold italic">Chargement...</td>
              </tr>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group animate-in fade-in duration-300">
                  <td className="px-10 py-6 text-left">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{res.nom}</p>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{res.taille || 'O KB'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase italic border border-slate-200">{res.categorie}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase italic border border-blue-100">{res.ue?.code}</span>
                  </td>
                  <td className="px-10 py-6 text-slate-400 font-bold text-xs">
                    {new Date(res.date).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <button 
                      onClick={() => openDownloadConfirm(res)}
                      className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Download size={18}/>
                    </button>
                    <button 
                      onClick={() => openDeleteConfirm(res)}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-32 text-center text-slate-200 uppercase font-black tracking-[10px] italic opacity-50">
                  {searchTerm ? "Aucun résultat trouvé" : "Aucun fichier publié"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL : SUPPRESSION --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200 text-left">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">
              Confirmer la suppression ?
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Êtes-vous sûr de vouloir supprimer <span className="text-slate-800 font-bold underline">"{selectedResource?.nom}"</span> ? 
              Cette action est irréversible et le fichier sera retiré du portail étudiant.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-2xl">Annuler</button>
              <button 
                onClick={confirmDelete}
                disabled={isProcessing}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
              >
                {isProcessing ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL : TÉLÉCHARGEMENT --- */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200 text-left">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
              <FileDown size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">
              Télécharger le document
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Vous allez télécharger <span className="text-slate-800 font-bold underline">"{selectedResource?.nom}"</span>. 
              Voulez-vous ouvrir ce fichier dans un nouvel onglet ?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-2xl">Annuler</button>
              <button 
                onClick={confirmDownload}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL : PUBLICATION (Existant mis à jour) --- */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 text-left">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter underline decoration-blue-500 decoration-4 underline-offset-8">Publier un document</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Titre</label>
                <input type="text" value={uploadData.title} onChange={(e) => setUploadData({...uploadData, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Nom du document" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">UE associée</label>
                  <select value={uploadData.ueId} onChange={(e) => setUploadData({...uploadData, ueId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none">
                    <option value="">Choisir...</option>
                    {myUEs.map(ue => <option key={ue.id} value={ue.id}>{ue.code}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Type</label>
                  <select value={uploadData.categorie} onChange={(e) => setUploadData({...uploadData, categorie: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none">
                    <option value="Cours">Cours</option>
                    <option value="TD">TD</option>
                    <option value="Examen">Examen</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div onClick={() => fileInputRef.current.click()} className={`border-4 border-dashed rounded-[30px] p-10 text-center cursor-pointer transition-all ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <Upload size={32} className="mx-auto mb-4 text-blue-600" />
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{selectedFile ? selectedFile.name : "Sélectionner un fichier"}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Annuler</button>
                <button onClick={handlePublish} disabled={isProcessing} className={`flex-1 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-lg ${isProcessing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isProcessing ? 'En cours...' : 'Publier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherResources;