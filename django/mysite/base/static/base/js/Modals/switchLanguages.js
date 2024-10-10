// frontend/srcs/js/Modals/switchLanguages.js

export async function loadLanguages(lang) {
    let response;

    try {
        response = await fetch(`./languages/${lang}.json`);
        if (!response.ok) 
            throw new Error(`404 Not Found at ./languages/${lang}.json`);
    }
    catch (error) {
        console.warn(`First path failed: ./languages/${lang}.json. Trying alternative path...`);
        try {
            response = await fetch(`../languages/${lang}.json`);
            if (!response.ok) 
                throw new Error(`404 Not Found at ../languages/${lang}.json`);
        }
        catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            return;
        }
    }

    try {
        // const response = await fetch(`../languages/${lang}.json`);

        const languages = await response.json();
        applyLanguages(languages);
    }
    catch (error) {
        console.error(`Error parsing language file ${lang}:`, error);
    }
}
 
function applyLanguages(languages) {
    // Parcourt tous les éléments ayant l'attribut data-lang-key
    document.querySelectorAll("[data-lang-key]").forEach(element => {
      const key = element.getAttribute("data-lang-key");
      element.textContent = languages[key] || key;
    });
}

// Objet de traduction pour les placeholders
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

// placeholders en fonction de la langue
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

