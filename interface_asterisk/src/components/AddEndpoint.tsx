import { useState } from 'react';
import axios from 'axios';

export default function AddEndpoint() {
  // Variables d'état (State) pour stocker les données du formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Variables pour gérer les messages de succès ou d'erreur
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fonction appelée quand on clique sur le bouton "Créer"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche la page de se recharger
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // Appel vers ton Backend NestJS (port 3000)
      const response = await axios.post('http://localhost:3000/new-endpoint', {
        username: username,
        password: password,
        context: 'from-internal' // Valeur par défaut
      });

      // Si tout se passe bien
      setMessage(response.data.message);
      setUsername(''); // On vide le champ
      setPassword(''); // On vide le champ
    } catch (error: any) {
      // Si une erreur survient (ex: serveur éteint, ou utilisateur existe déjà)
      setIsError(true);
      const errorMsg = error.response?.data?.message || 'Erreur de connexion au serveur';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Le rendu visuel (HTML/JSX)
  return (
    <div style={styles.card}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Nouveau Compte SIP</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Extension (ex: 101)</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Numéro de poste"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mot de passe</label>
          <input 
            type="text" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Secret123"
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Création en cours...' : 'Créer le compte'}
        </button>

      </form>

      {/* Zone de message (Succès ou Erreur) */}
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: isError ? '#ffebee' : '#e8f5e9',
          color: isError ? '#c62828' : '#2e7d32',
          border: isError ? '1px solid #ffcdd2' : '1px solid #c8e6c9'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

// Styles CSS simples (in-line) pour ne pas se compliquer la vie avec des fichiers CSS externes
const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    textAlign: 'left' as const,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#555',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  message: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '5px',
    textAlign: 'center' as const,
    fontWeight: 'bold',
  }
};