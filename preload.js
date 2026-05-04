

const { contextBridge } = require('electron');
const fs   = require('fs');
const path = require('path');

// Chemin absolu vers le fichier JSON (dans le même dossier que l'app)
const PASSWORDS_FILE = path.join(__dirname, 'common-passwords.json');

// contextBridge.exposeInMainWorld(nom, objet)
// → crée window.monAPI dans la page web
// → la page ne peut appeler QUE les fonctions listées ici
contextBridge.exposeInMainWorld('monAPI', {

  /**
   * Vérifie si un mot de passe est dans la liste locale.
   * @param {string} password - le mot de passe à tester
   * @returns {boolean} true si le mot de passe est compromis
   */
  estCompromis: (password) => {
    try {
      // Lecture du fichier JSON depuis le disque local
      const contenu = fs.readFileSync(PASSWORDS_FILE, 'utf-8');
      const liste   = JSON.parse(contenu);

      // Comparaison insensible à la casse
      return liste.includes(password.toLowerCase());
    } catch (err) {
      // Si le fichier est introuvable, on ne bloque pas l'app
      console.error('[preload] Impossible de lire common-passwords.json :', err.message);
      return false;
    }
  },

  /**
   * Retourne le nombre de mots de passe dans la liste locale.
   * Utile pour l'affichage dans l'interface.
   * @returns {number}
   */
  nombreMotsDePasse: () => {
    try {
      const contenu = fs.readFileSync(PASSWORDS_FILE, 'utf-8');
      const liste   = JSON.parse(contenu);
      return liste.length;
    } catch {
      return 0;
    }
  }

});
