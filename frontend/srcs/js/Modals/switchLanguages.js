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
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm password"
  },
  fr: {
    emailPlaceholder: "Adresse e-mail",
    passwordPlaceholder: "Mot de passe",
    confirmPasswordPlaceholder: "Confirmez le mot de passe"
  },
  es: {
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    confirmPasswordPlaceholder: "Confirmar contraseña"
  }
};

export function updatePlaceholders(selectedLang) {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.placeholder = translations[selectedLang].emailPlaceholder;
  });

  document.querySelectorAll('input[type="password"]').forEach((input, index) => {
    if (index === 0)
      input.placeholder = translations[selectedLang].passwordPlaceholder;
    if (index === 1)
        input.placeholder = translations[selectedLang].passwordPlaceholder;
    if (index === 2)
      input.placeholder = translations[selectedLang].confirmPasswordPlaceholder;
  });
}

