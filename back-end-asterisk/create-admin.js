#!/usr/bin/env node

/**
 * Script pour créer un utilisateur admin initial
 * Usage: node create-admin.js
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmin() {
  try {
    // Configuration de la base de données
    const connection = await mysql.createConnection({
      host: '192.168.88.250',
      user: 'root',
      password: 'maheryfreddy',
      database: 'asteriskdb',
    });

    console.log('📡 Connexion à la base de données...');

    // Créer la table users si elle n'existe pas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ Table users créée ou existe déjà');

    // Hasher le mot de passe
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur admin
    await connection.execute(
      'INSERT IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@asterisk.local', hashedPassword, 'admin']
    );

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('📝 Identifiants:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('⚠️  Changez ce mot de passe en production!');

    await connection.end();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createAdmin();
