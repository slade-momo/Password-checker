// Liste des mots de passe les plus communs
const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'monkey', 'letmein', 
    'dragon', 'baseball', 'iloveyou', 'trustno1', 'sunshine', 'master', 'hello', 
    'admin', 'welcome', 'shadow', 'football', 'princess', 'michael', 'nicole', 
    'jessica', 'charlie', 'access', 'buster', 'pepper', 'qwertyuiop', 'azerty',
    '000000', '111111', '123123', '1234567', 'password1', 'p@ssword', 'admin123',
    'root', 'toor', 'qwerty123', '1q2w3e4r', 'zaq12wsx', '123qwe', 'qwe123'
];

// Fonction pour vérifier si le mot de passe contient des séquences répétées
function hasRepetitions(password) {
    // Vérifie les répétitions de caractères (aaa, 111, etc.)
    if (/(.)\1{2,}/.test(password)) return true;
    
    // Vérifie les motifs répétés (abcabc)
    for (let i = 0; i < password.length - 3; i++) {
        const pattern = password.substr(i, 3);
        if (password.indexOf(pattern, i + 3) !== -1) return true;
    }
    
    return false;
}

// Fonction pour vérifier les séquences communes
function hasCommonSequences(password) {
    const commonSequences = [
        '123', '234', '345', '456', '567', '678', '789', '890',
        'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
        'qwert', 'azerty', 'zxcvbn', 'asdf', 'qwer', 'wert', 'erty',
        'rtyu', 'tyui', 'yuio', 'uiop'
    ];
    
    const lowerPass = password.toLowerCase();
    return commonSequences.some(seq => lowerPass.includes(seq));
}

// Fonction pour vérifier si le mot de passe est trop commun
function isCommonPassword(password) {
    const lowerPass = password.toLowerCase();
    return commonPasswords.includes(lowerPass) || hasCommonSequences(password);
}

// Fonction principale d'analyse
function analyzePassword(password) {
    const analysis = {
        length: false,
        uppercase: false,
        lowercase: false,
        digits: false,
        special: false,
        noRepetition: false,
        notCommon: false,
        score: 0
    };
    
    if (password.length === 0) return analysis;
    
    // Vérification de la longueur
    analysis.length = password.length >= 8;
    
    // Vérification des majuscules
    analysis.uppercase = /[A-Z]/.test(password);
    
    // Vérification des minuscules
    analysis.lowercase = /[a-z]/.test(password);
    
    // Vérification des chiffres
    analysis.digits = /[0-9]/.test(password);
    
    // Vérification des caractères spéciaux
    analysis.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
    
    // Vérification des répétitions
    analysis.noRepetition = !hasRepetitions(password) && !/(.)\1/.test(password);
    
    // Vérification des mots communs
    analysis.notCommon = !isCommonPassword(password);
    
    // Calcul du score (0-8 points, pondération spéciale)
    let score = 0;
    if (analysis.length) score += 2;  // La longueur est plus importante
    if (analysis.uppercase) score += 1;
    if (analysis.lowercase) score += 1;
    if (analysis.digits) score += 1;
    if (analysis.special) score += 1;
    if (analysis.noRepetition) score += 1;
    if (analysis.notCommon) score += 1;
    
    analysis.score = score;
    
    return analysis;
}

// Fonction pour déterminer la force globale
function getStrengthLevel(score) {
    if (score === 0) return { text: "", level: 0, color: "#e0e0e0", message: "Entrez un mot de passe pour commencer l'analyse." };
    if (score <= 2) return { text: "Très Faible", level: 0, color: "#dc3545", message: "❌ Mot de passe très dangereux ! Se cracke en quelques secondes." };
    if (score <= 3) return { text: "Faible", level: 1, color: "#ffc107", message: "⚠️ Mot de passe faible. Attaques par dictionnaire très efficaces." };
    if (score <= 5) return { text: "Moyen", level: 2, color: "#17a2b8", message: "👍 Mot de passe acceptable, mais peut être amélioré." };
    if (score <= 6) return { text: "Fort", level: 3, color: "#28a745", message: "✅ Bon mot de passe ! Résiste à la plupart des attaques." };
    return { text: "Très Fort", level: 4, color: "#00c851", message: "🏆 Excellent ! Mot de passe robuste hautement sécurisé." };
}

// Fonction pour obtenir des recommandations spécifiques
function getRecommendations(analysis) {
    const recommendations = [];
    
    if (!analysis.length) recommendations.push("• 📏 Utilisez au moins 8 caractères (idéalement 12+)");
    if (!analysis.uppercase) recommendations.push("• 🔠 Ajoutez des majuscules (A-Z)");
    if (!analysis.lowercase) recommendations.push("• 🔡 Ajoutez des minuscules (a-z)");
    if (!analysis.digits) recommendations.push("• 🔢 Ajoutez des chiffres (0-9)");
    if (!analysis.special) recommendations.push("• ✨ Ajoutez des caractères spéciaux (!@#$%^&*)");
    if (!analysis.noRepetition) recommendations.push("• 🚫 Évitez les répétitions de caractères (aaa, 111, abcabc)");
    if (!analysis.notCommon) recommendations.push("• 🛡️ Évitez les mots de passe courants ou séquences prédictibles");
    
    if (recommendations.length === 0) {
        return "🎉 Parfait ! Votre mot de passe respecte tous les critères de sécurité.";
    }
    
    return recommendations.join('\n');
}

// Fonction pour calculer le temps de craquage estimé
function estimateCrackTime(analysis) {
    const score = analysis.score;
    if (score <= 2) return "Instantané à quelques secondes";
    if (score <= 3) return "Quelques minutes à quelques heures";
    if (score <= 4) return "Quelques jours à quelques semaines";
    if (score <= 5) return "Quelques mois à quelques années";
    if (score <= 6) return "Plusieurs années à quelques décennies";
    return "Des centaines d'années ou plus";
}

// Mise à jour de l'interface utilisateur
function updateUI(password) {
    const analysis = analyzePassword(password);
    const strengthInfo = getStrengthLevel(analysis.score);
    
    // Mise à jour de la barre de force
    const fillBar = document.getElementById('strengthFill');
    if (analysis.score === 0) {
        fillBar.style.width = '0%';
    } else {
        fillBar.style.width = `${(analysis.score / 7) * 100}%`;
    }
    fillBar.style.backgroundColor = strengthInfo.color;
    
    // Mise à jour du texte de force
    const strengthText = document.getElementById('strengthText');
    strengthText.textContent = strengthInfo.text;
    strengthText.style.color = strengthInfo.color;
    
    // Mise à jour des critères
    const criteriaMap = {
        length: 'length',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        digits: 'digits',
        special: 'special',
        repetition: 'noRepetition',
        common: 'notCommon'
    };
    
    for (const [elementId, criterion] of Object.entries(criteriaMap)) {
        const element = document.getElementById(elementId);
        const isValid = analysis[criterion];
        
        if (isValid) {
            element.classList.add('valid');
            element.classList.remove('invalid');
            element.querySelector('.criterion-icon').textContent = '✅';
        } else if (password.length > 0) {
            element.classList.add('invalid');
            element.classList.remove('valid');
            element.querySelector('.criterion-icon').textContent = '❌';
        } else {
            element.classList.remove('valid', 'invalid');
            element.querySelector('.criterion-icon').textContent = '❌';
        }
    }
    
    // Mise à jour des recommandations
    const feedbackText = document.getElementById('feedbackText');
    if (password.length === 0) {
        feedbackText.innerHTML = "🔐 Entrez un mot de passe pour analyser sa force et obtenir des recommandations personnalisées.";
    } else {
        const recommendations = getRecommendations(analysis);
        const crackTime = estimateCrackTime(analysis);
        feedbackText.innerHTML = `<strong>${strengthInfo.message}</strong><br><br>
                                  <strong>⏱️ Temps de craquage estimé :</strong> ${crackTime}<br><br>
                                  <strong>📋 Recommandations :</strong><br>${recommendations.replace(/\n/g, '<br>')}`;
    }
}

// Fonction pour basculer l'affichage du mot de passe
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
        toggleIcon.style.opacity = '0.7';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
        toggleIcon.style.opacity = '1';
    }
}

// Ajouter un indicateur de force de mot de passe avec animation
function addStrengthAnimation(level) {
    const strengthFill = document.getElementById('strengthFill');
    strengthFill.style.animation = 'none';
    strengthFill.offsetHeight; // Force reflow
    strengthFill.style.animation = 'fadeIn 0.3s ease';
}

// Écouteur d'événements avec debounce pour meilleures performances
let debounceTimer;
document.getElementById('password').addEventListener('input', function(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        updateUI(e.target.value);
    }, 100);
});

// Analyse initiale avec un mot de passe vide
updateUI('');

// Empêcher la soumission du formulaire si jamais il y avait un formulaire
document.querySelector('input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});