// frontend/srcs/js/Modals/switchLanguages.js

export async function loadLanguages(lang) {
	try {
		const response = await fetch(`./languages/${lang}.json`);
		if (!response.ok)
			throw new Error(`Language file ${lang} not found (HTTP ${response.status})`);
		const translations = await response.json();
		
		applyLanguages(translations);
		
		return translations;
	}
	catch (error) {
		console.error(`Error loading language file ${lang}:`, error);
		return {};
	}
}
  
export function updatePlaceholders(translations) {
	if (!translations) {
		console.error("Translations data missing.");
		return;
	}
  
	document.querySelectorAll('.username-input').forEach(input => {
	  input.placeholder = translations.userPlaceholder;
	});
  
	document.querySelectorAll('.email-input').forEach(input => {
	  input.placeholder = translations.emailPlaceholder;
	});
  
	document.querySelectorAll('input[type="password"]').forEach((input, index) => {
	  if (index === 0)
		input.placeholder = translations.passwordPlaceholder;
	  else if (index === 1)
		input.placeholder = translations.passwordPlaceholder;
	  else if (index === 2)
		input.placeholder = translations.confirmPasswordPlaceholder;
	});
}

function applyLanguages(languages) {
    document.querySelectorAll("[data-lang-key]").forEach(element => {
      const key = element.getAttribute("data-lang-key");
      element.textContent = languages[key] || key;
    });
}

export function updatePlaceholdersTournament(translations) {
	if (!translations) {
			console.error("Translations data missing.");
			return;
	}

	document.querySelectorAll('#playerFields input[type="text"]').forEach((input, index) => {
			input.placeholder = `${translations.playerNamePlaceholder} ${index + 1}`;
	});
}

