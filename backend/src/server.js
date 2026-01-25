const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// ============================================================
// --- INITIALISATION ---
// ============================================================
const app = express();
const prisma = new PrismaClient();

// Configuration des Middlewares
app.use(cors());
app.use(express.json());

// CRUCIALE pour le téléchargement : Servir les fichiers statiques
// On s'assure que le dossier 'uploads' est accessible via le web
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================================
// --- 1. AUTHENTIFICATION (VERSION ROBUSTE) ---
// ============================================================

app.post('/api/login/teacher', async (req, res) => {
    const { email, password } = req.body;
    console.log("Tentative de connexion :", { email, password });

    try {
      const teacher = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (teacher && teacher.password === password && teacher.role === 'TEACHER') {
        const { password: _, ...teacherData } = teacher;
        console.log(`✅ Connexion réussie pour : ${teacher.nom}`);
        res.json(teacherData);
      } else {
        res.status(401).json({ error: "Email ou mot de passe incorrect." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur technique lors de la connexion." });
    }
});

// ============================================================
// --- 2. GESTION DES SALLES ---
// ============================================================

app.get('/api/salles', async (req, res) => {
  try {
    const salles = await prisma.salle.findMany({ orderBy: { nom: 'asc' } });
    res.json(salles);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture salles" });
  }
});

app.post('/api/salles', async (req, res) => {
  const { nom, capacite, batiment, departement } = req.body; // Récupère le département ici
  try {
    const nouvelleSalle = await prisma.salle.create({
      data: { 
        nom, 
        capacite: parseInt(capacite), 
        batiment,
        departement 
      }
    });
    res.json(nouvelleSalle);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création." });
  }
});

app.put('/api/salles/:id', async (req, res) => {
  const { id } = req.params;
  // ON RÉCUPÈRE TOUS LES CHAMPS ICI (Vérifie que 'departement' est présent)
  const { nom, capacite, batiment, departement } = req.body;

  try {
    const updatedSalle = await prisma.salle.update({
      where: { id: parseInt(id) },
      data: {
        nom: nom,
        capacite: parseInt(capacite),
        batiment: batiment,
        departement: departement // <--- CETTE LIGNE EST CRUCIALE
      }
    });
    res.json(updatedSalle);
  } catch (error) {
    console.error("Erreur mise à jour salle:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

app.delete('/api/salles/:id', async (req, res) => {
  try {
    await prisma.salle.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Salle supprimée" });
  } catch (error) {
    res.status(400).json({ error: "Impossible de supprimer : salle liée à des cours." });
  }
});

// ============================================================
// --- 3. GESTION DES CLASSES ---
// ============================================================

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.classe.findMany({ orderBy: { nom: 'asc' } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture classes" });
  }
});

app.post('/api/classes', async (req, res) => {
  const { nom, effectif, filiere, departement } = req.body;
  try {
    const nouvelleClasse = await prisma.classe.create({
      data: { 
        nom, 
        effectif: parseInt(effectif), 
        filiere,
        departement: departement || "Informatique" 
      }
    });
    res.json(nouvelleClasse);
  } catch (error) {
    res.status(400).json({ error: "Erreur : Le code de classe doit être unique." });
  }
});

app.put('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, effectif, filiere, departement } = req.body;
  try {
    const updated = await prisma.classe.update({
      where: { id: parseInt(id) },
      data: { nom, effectif: parseInt(effectif), filiere, departement }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erreur mise à jour classe." });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    await prisma.classe.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Classe supprimée" });
  } catch (error) {
    res.status(400).json({ error: "Erreur suppression classe" });
  }
});

// ============================================================
// --- 4. GESTION DES ENSEIGNANTS ET DASHBOARD ---
// ============================================================

app.get('/api/teachers/:id/dashboard', async (req, res) => {
  const teacherId = parseInt(req.params.id);
  
  try {
    // 1. On récupère les UE du prof avec toutes les sessions rattachées
    const teacherUEs = await prisma.uE.findMany({
      where: { enseignantId: teacherId },
      include: { 
        sessions: { 
          include: { salle: true, classe: true, ue: true } 
        } 
      }
    });

    // 2. On aplatit toutes les sessions dans un seul tableau
    let allSessions = [];
    teacherUEs.forEach(ue => { 
      allSessions = [...allSessions, ...ue.sessions]; 
    });

    // EXTRACTION DES CLASSES UNIQUES ---
    const classesMap = new Map();
    allSessions.forEach(s => {
      if (s.classe && !classesMap.has(s.classe.id)) {
        classesMap.set(s.classe.id, s.classe);
      }
    });
    const uniqueClasses = Array.from(classesMap.values());
    // ---------------------------------------------------

    // 3. Calcul des statistiques hebdomadaires
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const shortDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const weeklyStats = shortDays.map((d, index) => {
      const count = allSessions.filter(s => s.jour === days[index]).length;
      return { name: d, heures: count * 2 };
    });

    // 4. Calcul de la progression des vœux
    const wishesCount = await prisma.desiderata.count({ where: { enseignantId: teacherId } });
    const desidProgress = teacherUEs.length > 0 
      ? Math.min(100, Math.round((wishesCount / (teacherUEs.length * 2)) * 100)) 
      : 0;

    // 5. Envoi de la réponse complète au Frontend
    res.json({
      nextSession: allSessions.length > 0 ? allSessions[0] : null,
      weeklyStats,
      upcomingSessions: allSessions.slice(0, 5),
      classes: uniqueClasses, 
      desidProgress,
      totalHours: weeklyStats.reduce((acc, curr) => acc + curr.heures, 0),
      wishesCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération des données du dashboard" });
  }
});

app.get('/api/teachers', async (req, res) => {
  const teachers = await prisma.user.findMany({ where: { role: 'TEACHER' } });
  res.json(teachers);
});

app.get('/api/students', async (req, res) => {
  const students = await prisma.user.findMany({ 
    where: { role: 'STUDENT' },
    include: { classe: true } 
  });
  res.json(students);
});

app.post('/api/teachers', async (req, res) => {
  const { nom, email, departement, specialite, ueCode, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        nom, email: email.toLowerCase().trim(), departement, specialite,
        password: password || "password123",
        role: 'TEACHER',
        ue: ueCode ? { create: { code: ueCode, nom: specialite || ueCode } } : undefined
      }
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "L'email ou le code UE existe déjà." });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, email, departement, specialite, password } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { 
        nom, 
        email: email.toLowerCase().trim(), 
        departement, 
        specialite,
        password: password // Optionnel
      }
    });
    res.json(updated);
  } catch (error) {
    console.error("Erreur modification prof:", error);
    res.status(400).json({ error: "Email déjà utilisé ou ID invalide." });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  const teacherId = parseInt(req.params.id);
  try {
    await prisma.$transaction(async (tx) => {
      const ues = await tx.uE.findMany({ where: { enseignantId: teacherId }, select: { id: true } });
      const ueIds = ues.map(u => u.id);
      if (ueIds.length > 0) await tx.session.deleteMany({ where: { ueId: { in: ueIds } } });
      await tx.uE.deleteMany({ where: { enseignantId: teacherId } });
      await tx.desiderata.deleteMany({ where: { enseignantId: teacherId } });
      await tx.user.delete({ where: { id: teacherId } });
    });
    res.json({ message: "Suppression réussie." });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression" });
  }
});

// ============================================================
// --- 5. PROGRAMMATION SÉANCES ---
// ============================================================

app.get('/api/teachers/:id/ues', async (req, res) => {
  try {
    const ues = await prisma.uE.findMany({ where: { enseignantId: parseInt(req.params.id) } });
    res.json(ues);
  } catch (error) { res.status(500).json({ error: "Erreur lecture UEs" }); }
});

app.post('/api/sessions', async (req, res) => {
  const { ueId, classeId, salleId, jour, plageHoraire, date } = req.body;
  try {
    const classe = await prisma.classe.findUnique({ where: { id: parseInt(classeId) } });
    const salle = await prisma.salle.findUnique({ where: { id: parseInt(salleId) } });

    if (classe.effectif > salle.capacite) {
      return res.status(400).json({ error: `Salle trop petite (${salle.capacite} pl.)` });
    }

    const collision = await prisma.session.findFirst({
      where: { salleId: parseInt(salleId), jour, plageHoraire }
    });

    if (collision) return res.status(400).json({ error: "Salle déjà occupée !" });

    const newSession = await prisma.session.create({
      data: {
        ueId: parseInt(ueId), classeId: parseInt(classeId), salleId: parseInt(salleId),
        jour, plageHoraire, date: new Date(date), anneeAcad: "2025/2026"
      }
    });
    res.json(newSession);
  } catch (error) { res.status(500).json({ error: "Erreur programmation" }); }
});

// 1. Récupérer toutes les séances programmées par un enseignant
app.get('/api/teachers/:id/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        ue: { enseignantId: parseInt(req.params.id) }
      },
      include: {
        ue: true,
        classe: true,
        salle: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement des programmations" });
  }
});

// 2. Route pour récupérer les ressources nécessaires à une nouvelle séance (UE, Salles, Classes)
app.get('/api/teachers/:id/form-data', async (req, res) => {
    try {
        const [ues, salles, classes] = await Promise.all([
            prisma.uE.findMany({ where: { enseignantId: parseInt(req.params.id) } }),
            prisma.salle.findMany(),
            prisma.classe.findMany()
        ]);
        res.json({ ues, salles, classes });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du chargement du formulaire" });
    }
});

// --- SUPPRESSION SÉANCE ---
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await prisma.session.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Séance supprimée avec succès." });
  } catch (error) {
    console.error("Erreur suppression séance:", error);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

// --- MODIFICATION SÉANCE ---
app.put('/api/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const { ueId, salleId, classeId, jour, plageHoraire, date } = req.body;
  
  try {
    // Vérifier la collision (sauf pour la séance elle-même)
    const collision = await prisma.session.findFirst({
      where: {
        salleId: parseInt(salleId),
        jour,
        plageHoraire,
        NOT: { id: parseInt(id) } // On exclut la séance actuelle de la vérification
      }
    });

    if (collision) {
      return res.status(400).json({ error: "Conflit : La salle est déjà occupée sur ce créneau." });
    }

    const updatedSession = await prisma.session.update({
      where: { id: parseInt(id) },
      data: {
        ueId: parseInt(ueId),
        classeId: parseInt(classeId),
        salleId: parseInt(salleId),
        jour,
        plageHoraire,
        date: new Date(date)
      }
    });
    res.json(updatedSession);
  } catch (error) {
    console.error("Erreur modification séance:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la séance." });
  }
});

// ============================================================
// --- 6. GESTION DES VOEUX (DESIDERATA) ---
// ============================================================

app.get('/api/teachers/:id/desiderata', async (req, res) => {
  try {
    const desiderata = await prisma.desiderata.findMany({
      where: { enseignantId: parseInt(req.params.id) },
      include: { ue: true }
    });
    res.json(desiderata);
  } catch (error) { res.status(500).json({ error: "Erreur vœux" }); }
});

app.post('/api/desiderata', async (req, res) => {
  const { jour, plageHoraire, ueId, teacherId } = req.body;
  const eId = parseInt(teacherId);
  if (isNaN(eId)) return res.status(400).json({ error: "ID Invalide" });

  try {
    const newWish = await prisma.desiderata.create({
      data: { jour, plageHoraire, enseignantId: eId, ueId: parseInt(ueId) }
    });
    res.status(201).json(newWish);
  } catch (error) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.delete('/api/desiderata/:id', async (req, res) => {
  try {
    await prisma.desiderata.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Vœu supprimé" });
  } catch (error) { res.status(500).json({ error: "Erreur suppression" }); }
});

// ============================================================
// --- 7. UPLOAD DE RESSOURCES ---
// ============================================================

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/resources/upload', upload.single('file'), async (req, res) => {
  try {
    const { nom, ueId, teacherId, categorie } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Aucun fichier" });

    const resource = await prisma.resource.create({
      data: {
        nom, categorie: categorie || "Cours",
        type: file.mimetype.split('/')[1].toUpperCase(),
        url: `uploads/${file.filename}`,
        taille: (file.size / 1024).toFixed(2) + " KB",
        teacherId: parseInt(teacherId),
        ueId: parseInt(ueId)
      }
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Erreur upload" });
  }
});

app.get('/api/teachers/:id/resources', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { teacherId: parseInt(req.params.id) },
      include: { ue: true },
      orderBy: { date: 'desc' }
    });
    res.json(resources);
  } catch (error) { res.status(500).json({ error: "Erreur lecture" }); }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await prisma.resource.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Supprimé" });
  } catch (error) { res.status(500).json({ error: "Erreur suppression" }); }
});


//============================================================
//--- 8. Etudiants ---
//============================================================

app.post('/api/register-student', async (req, res) => {
  const { nom, email, matricule, classeId, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        nom,
        email: email.toLowerCase().trim(),
        password, 
        role: 'STUDENT',
        classeId: parseInt(classeId)
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "L'email ou le matricule existe déjà." });
  }
});

app.get('/api/students/:id/dashboard', async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    // 1. Trouver l'étudiant et sa classe
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { classe: true }
    });

    if (!student || !student.classeId) return res.status(404).json({ error: "Classe non trouvée" });

    // 2. Trouver la prochaine séance pour sa classe
    const nextSession = await prisma.session.findFirst({
      where: { classeId: student.classeId },
      include: { 
        ue: { include: { enseignant: true } }, 
        salle: true 
      },
      orderBy: { date: 'asc' }
    });

    // 3. Trouver les supports de cours pour les UE de sa classe
    const recentResources = await prisma.resource.findMany({
      where: { 
        ue: { sessions: { some: { classeId: student.classeId } } } 
      },
      include: { ue: true },
      take: 5,
      orderBy: { date: 'desc' }
    });

    res.json({ nextSession, recentResources });
  } catch (error) {
    res.status(500).json({ error: "Erreur dashboard étudiant" });
  }
});

// Récupérer les séances pour une classe spécifique
app.get('/api/classes/:id/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { classeId: parseInt(req.params.id) },
      include: {
        ue: { include: { enseignant: true } },
        salle: true
      }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du planning" });
  }
});


// ============================================================
// --- 9. STATISTIQUES GLOBALES ---
// ============================================================

app.get('/api/stats', async (req, res) => {
  try {
    const [countSalles, countTeachers, countClasses, countVoeux, sumCap] = await Promise.all([
      prisma.salle.count(),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.classe.count(),
      prisma.desiderata.count(),
      prisma.salle.aggregate({ _sum: { capacite: true } })
    ]);

    res.json({ 
      countSalles, countTeachers, countClasses, countVoeux,
      capaciteTotale: sumCap._sum.capacite || 0
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur statistiques" });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`   SERVEUR EDT UNIVERSITAIRE OPÉRATIONNEL`);
  console.log(`   PORT : ${PORT}`);
  console.log(`=========================================`);
});