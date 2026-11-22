import * as SQLite from 'expo-sqlite';

// Une seule connexion réutilisée par toute l'application
let dbPromise = null;

export const getDBConnection = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('students_database.db');
  }
  return dbPromise;
};

export const createTable = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      filiere TEXT NOT NULL,
      niveau TEXT NOT NULL
    );
  `;
  await db.execAsync(query);
};
