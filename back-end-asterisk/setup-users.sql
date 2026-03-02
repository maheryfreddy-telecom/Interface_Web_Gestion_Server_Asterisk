-- Script SQL pour créer la table users et un utilisateur admin par défaut

-- Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ajouter un utilisateur admin par défaut
-- Mot de passe: admin123 (hashé avec bcrypt)
-- Pour créer ce hash : node -e "console.log(require('bcrypt').hashSync('admin123', 10))"
INSERT IGNORE INTO users (username, email, password, role) 
VALUES ('admin', 'admin@asterisk.local', '$2b$10$YourHashHere', 'admin');

-- Note: Vous devrez remplacer '$2b$10$YourHashHere' par un vrai hash bcrypt
-- Ou créer l'utilisateur via l'endpoint POST /auth/register
