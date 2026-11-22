import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getDBConnection, createTable } from './database/database';
import {
  getStudentsFromDb,
  insertStudentIntoDb,
  deleteStudentFromDb,
  updateStudentInDb,
  getStudentStatsByFiliere,
} from './services/studentService';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import SearchBar from './components/SearchBar';
import StudentStats from './components/StudentStats';

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState('');

  // Recharge la liste et les statistiques depuis SQLite
  const loadData = async () => {
    try {
      const [storedStudents, storedStats] = await Promise.all([
        getStudentsFromDb(),
        getStudentStatsByFiliere(),
      ]);
      setStudents(storedStudents);
      setStats(storedStats);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données.');
    }
  };

  // Au démarrage : ouvrir la base, créer la table, charger les données
  useEffect(() => {
    const init = async () => {
      try {
        const db = await getDBConnection();
        await createTable(db);
        await loadData();
      } catch (error) {
        console.error('Erreur initialisation:', error);
        Alert.alert('Erreur', "Impossible d'initialiser la base de données.");
      }
    };
    init();
  }, []);

  // CREATE ou UPDATE. Retourne true si succès (le formulaire se vide alors)
  const handleAddOrUpdate = async (studentData) => {
    try {
      if (editingStudent) {
        await updateStudentInDb({ ...studentData, id: editingStudent.id });
        setEditingStudent(null);
      } else {
        await insertStudentIntoDb(studentData);
      }
      await loadData();
      return true;
    } catch (error) {
      if (String(error?.message).includes('UNIQUE')) {
        Alert.alert('Email déjà utilisé', 'Un étudiant avec cet email existe déjà.');
      } else {
        Alert.alert('Erreur', "Erreur lors de l'enregistrement en base de données.");
      }
      return false;
    }
  };

  // DELETE avec confirmation
  const handleDelete = (id) => {
    Alert.alert('Confirmation', 'Voulez-vous vraiment supprimer cet étudiant ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStudentFromDb(id);
            if (editingStudent?.id === id) setEditingStudent(null);
            await loadData();
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de supprimer cet étudiant.');
          }
        },
      },
    ]);
  };

  // Filtrage en mémoire (nom, prénom, filière)
  const q = search.trim().toLowerCase();
  const filteredStudents = q
    ? students.filter(
        (s) =>
          s.nom.toLowerCase().includes(q) ||
          s.prenom.toLowerCase().includes(q) ||
          s.filiere.toLowerCase().includes(q)
      )
    : students;

  const header = (
    <View>
      <StudentForm
        onSubmit={handleAddOrUpdate}
        editingStudent={editingStudent}
        onCancel={() => setEditingStudent(null)}
      />
      <StudentStats stats={stats} />
      <SearchBar value={search} onChangeText={setSearch} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion des Étudiants</Text>
      </View>
      <StudentList
        students={filteredStudents}
        onDelete={handleDelete}
        onEdit={setEditingStudent}
        ListHeaderComponent={header}
      />
      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { paddingTop: 50, paddingBottom: 14, backgroundColor: '#2563eb', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
