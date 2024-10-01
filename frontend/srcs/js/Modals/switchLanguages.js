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
