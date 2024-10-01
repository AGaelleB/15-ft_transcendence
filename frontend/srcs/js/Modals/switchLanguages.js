// frontend/srcs/js/Modals/switchLanguages.js

export async function loadLanguages(lang) {
    try {
        const response = await fetch(`./languages/${lang}.json`);
        const languages = await response.json();
        applyLanguages(languages);
    }
    catch (error) {
        console.error(`Error loading language ${lang}:`, error);
    }
}
 
function applyLanguages(languages) {
    // Parcourt tous les éléments ayant l'attribut data-lang-key
    document.querySelectorAll("[data-lang-key]").forEach(element => {
      const key = element.getAttribute("data-lang-key");
      element.textContent = languages[key] || key;
    });
}

