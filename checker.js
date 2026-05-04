

const input        = document.getElementById('password');
const toggleBtn    = document.getElementById('toggleBtn');
const strengthBar  = document.getElementById('strengthBar');
const strengthName = document.getElementById('strengthName');
const strengthScore= document.getElementById('strengthScore');
const strengthSec  = document.getElementById('strengthSection');
const crackValue   = document.getElementById('crackValue');
const tipText      = document.getElementById('tipText');

// --- Critères DOM ---
const crits = {
  length:  document.getElementById('crit-length'),
  upper:   document.getElementById('crit-upper'),
  lower:   document.getElementById('crit-lower'),
  number:  document.getElementById('crit-number'),
  special: document.getElementById('crit-special'),
  long:    document.getElementById('crit-long'),
};

// --- Icônes ---
const ICON_EMPTY   = '○';
const ICON_CHECKED = '●';

// ====================================================
// Afficher / masquer le mot de passe
// ====================================================
toggleBtn.addEventListener('click', () => {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  toggleBtn.querySelector('svg').style.opacity = isPassword ? '0.4' : '1';
});

// ====================================================
// Analyse principale
// ====================================================
input.addEventListener('input', () => {
  const pwd = input.value;

  if (pwd.length === 0) {
    reset();
    return;
  }

  strengthSec.classList.add('visible');

  // --- Évaluation des critères ---
  const checks = {
    length:  pwd.length >= 8,
    upper:   /[A-Z]/.test(pwd),
    lower:   /[a-z]/.test(pwd),
    number:  /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
    long:    pwd.length >= 16,
  };

  // Mise à jour visuelle des critères
  for (const [key, passed] of Object.entries(checks)) {
    const el   = crits[key];
    const icon = el.querySelector('.crit-icon');
    if (passed) {
      el.classList.add('passed');
      icon.textContent = ICON_CHECKED;
    } else {
      el.classList.remove('passed');
      icon.textContent = ICON_EMPTY;
    }
  }

  // --- Score de force (0-4) ---
  const score = calcScore(pwd, checks);

  // --- Mise à jour UI ---
  applyStrength(score, pwd, checks);
});

// ====================================================
// Calcul du score (0 → 4)
// ====================================================
function calcScore(pwd, checks) {
  let score = 0;

  // Critères de base (chaque critère rempli = +1, max 4 pour les 4 premiers)
  const baseChecks = [checks.length, checks.upper, checks.lower, checks.number, checks.special];
  const baseCount  = baseChecks.filter(Boolean).length;

  if (baseCount <= 1) score = 0;
  else if (baseCount === 2) score = 1;
  else if (baseCount === 3) score = 2;
  else if (baseCount === 4) score = 3;
  else score = 3;

  // Bonus longueur
  if (checks.long && score >= 3) score = 4;
  if (pwd.length >= 20)          score = Math.min(4, score + 1);

  // Pénalité : motifs répétitifs évidents
  if (/(.)\1{3,}/.test(pwd)) score = Math.max(0, score - 1);        // ex: aaaa
  if (/^[a-z]+$/.test(pwd.toLowerCase()) && pwd.length < 12) score = Math.min(score, 1);

  return Math.min(4, Math.max(0, score));
}

// ====================================================
// Application visuelle selon score
// ====================================================
const LEVELS = [
  { name: 'TRÈS FAIBLE', color: '#ff3d5a' },
  { name: 'FAIBLE',      color: '#ff3d5a' },
  { name: 'MOYEN',       color: '#ffb800' },
  { name: 'FORT',        color: '#8bc34a' },
  { name: 'TRÈS FORT',   color: '#00ff88' },
];

function applyStrength(score, pwd, checks) {
  const level = LEVELS[score];

  // Barre
  strengthBar.className = 'strength-bar s' + score;

  // Label
  strengthName.textContent = level.name;
  strengthName.style.color = level.color;

  // Score textuel
  const passedCount = Object.values(checks).filter(Boolean).length;
  strengthScore.textContent = `${passedCount} / ${Object.keys(checks).length} critères remplis · longueur : ${pwd.length}`;

  // Temps de crack estimé
  crackValue.textContent = estimateCrackTime(pwd, checks);
  crackValue.style.color = level.color;

  // Conseil contextuel
  tipText.textContent = getTip(pwd, checks, score);
}

// ====================================================
// Estimation du temps de crack (simplifiée, pédagogique)
// ====================================================
function estimateCrackTime(pwd, checks) {
  let charset = 0;
  if (checks.lower)   charset += 26;
  if (checks.upper)   charset += 26;
  if (checks.number)  charset += 10;
  if (checks.special) charset += 32;
  if (charset === 0)  charset = 26;

  // Combinaisons possibles
  const combinations = Math.pow(charset, pwd.length);

  // Hypothèse : attaque en ligne ~1 000 essais/s, hors-ligne ~1 milliard/s
  const attemptsPerSec = 1_000_000_000; // offline (GPU)
  const seconds = combinations / attemptsPerSec;

  return formatTime(seconds);
}

function formatTime(seconds) {
  if (seconds < 1)                         return 'Instantané';
  if (seconds < 60)                        return `${Math.round(seconds)} secondes`;
  if (seconds < 3600)                      return `${Math.round(seconds/60)} minutes`;
  if (seconds < 86400)                     return `${Math.round(seconds/3600)} heures`;
  if (seconds < 86400*30)                  return `${Math.round(seconds/86400)} jours`;
  if (seconds < 86400*365)                 return `${Math.round(seconds/86400/30)} mois`;
  if (seconds < 86400*365*100)             return `${Math.round(seconds/86400/365)} ans`;
  if (seconds < 86400*365*1_000)           return `${Math.round(seconds/86400/365/100)} siècles`;
  if (seconds < 86400*365*1_000_000)       return `${Math.round(seconds/86400/365/1_000)} millénaires`;
  return 'Des milliards d\'années ∞';
}

// ====================================================
// Conseils contextuels
// ====================================================
function getTip(pwd, checks, score) {
  if (pwd.length < 8)
    return 'Votre mot de passe est trop court. Visez au moins 8 caractères.';
  if (!checks.upper && !checks.lower)
    return 'Ajoutez des lettres majuscules et minuscules pour augmenter la complexité.';
  if (!checks.number)
    return 'Insérez un ou plusieurs chiffres pour renforcer votre mot de passe.';
  if (!checks.special)
    return 'Ajoutez des caractères spéciaux ( ! @ # $ % ) pour maximiser la sécurité.';
  if (!checks.long && score >= 3)
    return 'Très bon ! Allongez à 16+ caractères pour atteindre le niveau maximal.';
  if (score === 4)
    return 'Excellent ! Ce mot de passe est très difficile à craquer. Pensez à le stocker dans un gestionnaire de mots de passe.';
  return 'Continuez à ajouter de la variété : mélangez lettres, chiffres et symboles.';
}

// ====================================================
// Réinitialisation
// ====================================================
function reset() {
  strengthSec.classList.remove('visible');
  strengthBar.className = 'strength-bar';
  strengthName.textContent = '—';
  strengthScore.textContent = '';
  crackValue.textContent = '—';
  tipText.textContent = 'Commencez à taper pour analyser votre mot de passe.';

  for (const el of Object.values(crits)) {
    el.classList.remove('passed');
    el.querySelector('.crit-icon').textContent = ICON_EMPTY;
  }
}
