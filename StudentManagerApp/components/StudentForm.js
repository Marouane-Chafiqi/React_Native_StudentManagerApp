import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';

export default function StudentForm({ onSubmit, editingStudent, onCancel }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');

  const clearFields = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setFiliere('');
    setNiveau('');
  };

  // Mode édition : pré-remplir ; sinon : vider
  useEffect(() => {
    if (editingStudent) {
      setNom(editingStudent.nom);
      setPrenom(editingStudent.prenom);
      setEmail(editingStudent.email);
      setFiliere(editingStudent.filiere);
      setNiveau(editingStudent.niveau);
    } else {
      clearFields();
    }
  }, [editingStudent]);

  const handleSubmit = async () => {
    if (!nom.trim() || !prenom.trim() || !email.trim() || !filiere.trim() || !niveau.trim()) {
      Alert.alert('Champs manquants', 'Tous les champs sont obligatoires.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Email invalide', 'Veuillez saisir une adresse email valide.');
      return;
    }
    // onSubmit renvoie true si l'enregistrement a réussi
    const ok = await onSubmit({
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      filiere: filiere.trim(),
      niveau: niveau.trim(),
    });
    if (ok) {
      clearFields();
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
      <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput style={styles.input} placeholder="Filière" value={filiere} onChangeText={setFiliere} />
      <TextInput style={styles.input} placeholder="Niveau (ex: L3)" value={niveau} onChangeText={setNiveau} />
      <Button
        title={editingStudent ? 'Mettre à jour' : "Ajouter l'étudiant"}
        onPress={handleSubmit}
        color="#2563eb"
      />
      {editingStudent && (
        <View style={{ marginTop: 8 }}>
          <Button title="Annuler la modification" onPress={onCancel} color="#64748b" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});
