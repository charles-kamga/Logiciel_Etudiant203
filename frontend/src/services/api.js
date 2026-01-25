import axios from 'axios';
export const deleteSalle = (id) => axios.delete(`${API_URL}/salles/${id}`);
export const updateSalle = (id, data) => axios.put(`${API_URL}/salles/${id}`, data);

const API_URL = 'http://localhost:5000/api';

export const getSalles = () => axios.get(`${API_URL}/salles`);
export const createSalle = (data) => axios.post(`${API_URL}/salles`, data);

export const getClasses = () => axios.get(`${API_URL}/classes`);
export const createClasse = (data) => axios.post(`${API_URL}/classes`, data);
export const deleteClasse = (id) => axios.delete(`${API_URL}/classes/${id}`);
export const updateClasse = (id, data) => axios.put(`${API_URL}/classes/${id}`, data);

export const getTeachers = () => axios.get(`${API_URL}/teachers`);
export const createTeacher = (data) => axios.post(`${API_URL}/teachers`, data);
export const deleteTeacher = (id) => axios.delete(`${API_URL}/teachers/${id}`);
export const updateTeacher = (id, data) => axios.put(`${API_URL}/teachers/${id}`, data);

export const getStats = () => axios.get(`${API_URL}/stats`);
export const getStudents = () => axios.get(`${API_URL}/students`);