import { getDBConnection } from '../database/database';

// READ
export const getStudentsFromDb = async () => {
  try {
    const db = await getDBConnection();
    return await db.getAllAsync('SELECT * FROM students ORDER BY id DESC');
  } catch (error) {
    console.error('Erreur lors de la lecture des étudiants:', error);
    throw error;
  }
};

// CREATE
export const insertStudentIntoDb = async (student) => {
  try {
    const db = await getDBConnection();
    const query = `
      INSERT INTO students (nom, prenom, email, filiere, niveau)
      VALUES (?, ?, ?, ?, ?);
    `;
    const result = await db.runAsync(
      query,
      student.nom,
      student.prenom,
      student.email,
      student.filiere,
      student.niveau
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Erreur lors de l'insertion:", error);
    throw error;
  }
};

// UPDATE
export const updateStudentInDb = async (student) => {
  try {
    const db = await getDBConnection();
    const query = `
      UPDATE students
      SET nom = ?, prenom = ?, email = ?, filiere = ?, niveau = ?
      WHERE id = ?;
    `;
    const result = await db.runAsync(
      query,
      student.nom,
      student.prenom,
      student.email,
      student.filiere,
      student.niveau,
      student.id
    );
    return result.changes;
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
};

// DELETE
export const deleteStudentFromDb = async (id) => {
  try {
    const db = await getDBConnection();
    const result = await db.runAsync('DELETE FROM students WHERE id = ?;', id);
    return result.changes;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

// STATS (COUNT + GROUP BY)
export const getStudentStatsByFiliere = async () => {
  try {
    const db = await getDBConnection();
    const query = `
      SELECT filiere, COUNT(*) as count
      FROM students
      GROUP BY filiere
      ORDER BY count DESC;
    `;
    return await db.getAllAsync(query);
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    throw error;
  }
};
