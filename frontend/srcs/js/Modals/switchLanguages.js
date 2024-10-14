// frontend/srcs/js/Modals/switchLanguages.js

export async function loadLanguages(lang) {
  try {
      const response = await fetch(`/frontend/srcs/languages/${lang}.json`);
      if (!response.ok) {
          throw new Error(`Language file ${lang} not found (HTTP ${response.status})`);
      }
      const languages = await response.json();
      applyLanguages(languages);
  }
  catch (error) {
      console.error(`Error loading language file ${lang}:`, error);
  }
}

 
function applyLanguages(languages) {
    document.querySelectorAll("[data-lang-key]").forEach(element => {
      const key = element.getAttribute("data-lang-key");
      element.textContent = languages[key] || key;
    });
}

const translations = {
  en: {
    userPlaceholder: "Username",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm password"
  },
  fr: {
    userPlaceholder: "Nom d'utilisateur",
    emailPlaceholder: "Adresse e-mail",
    passwordPlaceholder: "Mot de passe",
    confirmPasswordPlaceholder: "Confirmez le mot de passe"
  },
  es: {
    userPlaceholder: "Nombre de usuario",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    confirmPasswordPlaceholder: "Confirmar contraseña"
  }
};

export function updatePlaceholders(selectedLang) {
  // Mettre à jour le placeholder pour le champ Username
  document.querySelectorAll('.username-input').forEach(input => {
    input.placeholder = translations[selectedLang].userPlaceholder;
  });

  // Mettre à jour le placeholder pour le champ Email
  document.querySelectorAll('.email-input').forEach(input => {
    input.placeholder = translations[selectedLang].emailPlaceholder;
  });

  // Mettre à jour les placeholders pour les champs Password et Confirm Password
  document.querySelectorAll('input[type="password"]').forEach((input, index) => {
    if (index === 0) {
      input.placeholder = translations[selectedLang].passwordPlaceholder;
    } else if (index === 1) {
      input.placeholder = translations[selectedLang].passwordPlaceholder;
    } else if (index === 2) {
      input.placeholder = translations[selectedLang].confirmPasswordPlaceholder;
    }
  });
}

