import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORTS DES PAGES (ORDRE ALPHABÉTIQUE / CATÉGORIE) ---
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import Dashboard from './pages/Dashboard'; 

// --- PAGES ADMINISTRATION ---
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminSalles from './pages/AdminSalles';
import AdminTeachers from './pages/AdminTeachers';
import AdminClasses from './pages/AdminClasses';
import AdminVoeux from './pages/AdminVoeux';
import AdminArbitrage from './pages/AdminArbitrage';

// --- PAGES ENSEIGNANTS ---
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClasses from './pages/TeacherClasses';
import TeacherVoeux from './pages/TeacherVoeux';
import TeacherResources from './pages/TeacherResources';

// --- PAGES ETUDIANTS ---
import StudentDashboard from './pages/StudentDashboard';
import StudentTimetable from './pages/StudentTimetable';
import StudentLogin from './pages/StudentLogin';
import StudentResources from './pages/StudentResources'; 

/**
 * Composant principal gérant le routage de l'application "EDT Universitaire"
 * Structure à plat pour éviter les conflits de redirection pendant le développement.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROUTES PUBLIQUES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* --- ROUTES ADMINISTRATION --- */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/salles" element={<AdminSalles />} />
        <Route path="/admin/enseignants" element={<AdminTeachers />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/voeux" element={<AdminVoeux />} />
        <Route path="/admin/arbitrage" element={<AdminArbitrage />} />

        {/* --- ROUTES ENSEIGNANTS --- */}
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/voeux" element={<TeacherVoeux />} />
        <Route path="/teacher/ressources" element={<TeacherResources />} />

        {/* --- ROUTES ÉTUDIANTS --- */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/timetable" element={<StudentTimetable />} /> 
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/student/resources" element={<StudentResources />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        
      </Routes>
    </Router>
  );
}

export default App;