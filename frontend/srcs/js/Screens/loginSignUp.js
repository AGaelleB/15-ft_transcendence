// frontend/srcs/js/Screens/loginSignUp.js

import { myAlert } from '../Modals/alertModal.js';
import { applyLanguage, loadLanguages, updatePlaceholders } from '../Modals/switchLanguages.js';

export async function initializeLogin() {
	const userData = localStorage.getItem('user');
	console.log("userData in initializeLogin:", userData);

	const storedLang = localStorage.getItem('preferredLanguage') || 'en';
	try {
		const translations = await loadLanguages(storedLang);
		updatePlaceholders(translations);
	}
	catch (error) {
		console.error("Error initializing app:", error);
	}

	const loginForm = document.querySelector("form.login");
	const signupForm = document.querySelector("form.signup");
	const loginBtn = document.querySelector("label.login");
	const signupBtn = document.querySelector("label.signup");
	const signupLink = document.getElementById("signup-link");

	signupLink.addEventListener("click", (event) => {
		event.preventDefault();
		signupBtn.click();
	});

	signupBtn.onclick = () => {
		loginForm.style.marginLeft = "-50%";
	};

	loginBtn.onclick = () => {
		loginForm.style.marginLeft = "0%";
	};

	function switchFormBasedOnHash() {
		const hash = window.location.hash;
		if (hash === "#signup")
			signupBtn.click();
		else
			loginBtn.click();
	}

	switchFormBasedOnHash();
	window.addEventListener('hashchange', (event) => {
		event.preventDefault();
		switchFormBasedOnHash();
	});

	loginForm.addEventListener("submit", handleLogin);
	signupForm.addEventListener("submit", handleSignup);

	const togglePasswordIcons = document.querySelectorAll(".toggle-password-icon");

	togglePasswordIcons.forEach(icon => {
		icon.addEventListener("click", () => {
			const passwordInput = icon.closest(".password-field").querySelector("input[type='password'], input[type='text']");

			if (passwordInput) {
				const isPasswordVisible = passwordInput.type === "text";
				passwordInput.type = isPasswordVisible ? "password" : "text";

				icon.classList.toggle("bi-eye");
				icon.classList.toggle("bi-eye-slash");
			}
			else
				console.error("Password input not found for icon:", icon);
		});
	});
}

export async function open2FAModal(username, email) {
	let translations = {};
	try {
		const { loadLanguages } = await import('../Modals/switchLanguages.js');
		const storedLang = localStorage.getItem('preferredLanguage') || 'en';
		translations = await loadLanguages(storedLang);
	}
	catch (error) {
		console.warn("Error loading translations:", error);
	}

	const modal = document.getElementById("twoFAModal");
	modal.classList.remove("hidden");

	const close2FAButton = modal.querySelector(".close-button-2fa");
	close2FAButton.addEventListener("click", close2FAModal);

	const descriptionElement = modal.querySelector(".two-fa-description");
	if (descriptionElement) {
		const emailMasked = maskEmail(email);
		descriptionElement.textContent = `${translations.emailText2fa || "Enter the code sent to"} ${emailMasked}`;
	}

	const inputs = Array.from(modal.querySelectorAll(".two-fa-input"));
	const confirmButton = modal.querySelector(".two-fa-button");
	const resendButton = modal.querySelector(".two-fa-resend");

	inputs.forEach((input, index) => {
		input.addEventListener("input", (event) => {
			if (event.target.value.length === 1 && index < inputs.length - 1)
				inputs[index + 1].focus();
		});

		input.addEventListener("keydown", (event) => {
			if (event.key === "Backspace" && !event.target.value && index > 0)
				inputs[index - 1].focus();
		});
	});

	inputs[0].addEventListener("paste", (event) => {
		event.preventDefault();
		const pasteData = event.clipboardData.getData("text");
		if (/^\d{6}$/.test(pasteData)) {
			pasteData.split("").forEach((char, i) => {
				if (inputs[i]) inputs[i].value = char;
			});
			inputs[5].focus();
		}
		else
			console.warn("Invalid OTP format pasted.");
	});

	confirmButton.addEventListener("click", () => handle2FAConfirm(username));

	modal.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			confirmButton.click();
		}
	});

	resendButton.addEventListener("click", handleResendOTP);
}

export function close2FAModal() {
	const modal = document.getElementById("twoFAModal");
	modal.classList.add("hidden");
}

async function handleResendOTP() {
	try {
		const response = await fetch("http://127.0.0.1:8001/verify-otp/", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ action: "resend" }),
		});

		const data = await response.json();

		if (response.ok) {
			console.log("OTP resent successfully:", data);
			await myAlert("2faResend");
		}
		else
			await myAlert("defaultError");
	}
	catch (error) {
		console.error("Error resending OTP:", error);
		await myAlert("defaultError");
	}
}

async function handle2FAConfirm(username) {
	const inputs = Array.from(document.querySelectorAll(".two-fa-input"));
	const otp = inputs.map(input => input.value).join("");

	if (otp.length !== 6) {
		await myAlert("2faAlert", { message: "Please enter a valid 6-digit code." });
		return;
	}

	try {
		const response = await fetch("http://127.0.0.1:8001/verify-otp/", {
			method: "POST",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({ otp, action: "verify" }),
		});

		const data = await response.json();

		if (response.ok) {
			console.log("2FA verification successful:", data);
			close2FAModal();

			const userDetails = await fetchUserDetails(username);
			if (userDetails) {
				const storedLang = userDetails.language || localStorage.getItem('preferredLanguage') || 'en'; // Par défaut à 'en'

				localStorage.setItem('user', JSON.stringify({
					id: userDetails.id,
					username: userDetails.username,
					email: userDetails.email,
					is_2fa: userDetails.is_2fa,
					language: storedLang,
			}));

				await applyLanguage(storedLang);
			}

			window.history.pushState({}, "", "/home");
			handleLocation();
		}
		else
			await myAlert("2faAlert", { message: data.status || "Invalid OTP. Please try again." });
	}
	catch (error) {
		console.error("Error verifying OTP:", error);
		await myAlert("defaultError");
	}
}

function maskEmail(email) {
	const [localPart, domain] = email.split("@");
	const maskedLocalPart = localPart[0] + "*".repeat(localPart.length - 1);
	return `${maskedLocalPart}@${domain}`;
}

async function handleLogin(event, loginData = null) {
	event?.preventDefault();

	const username = loginData?.username || document.getElementById("login-username").value;
	const password = loginData?.password || document.getElementById("login-password-input").value;

	if (!username || !password) {
		console.error("Login error: Missing username or password.");
		await myAlert("fillFields");
		return;
	}

	try {
		const response = await fetch('http://127.0.0.1:8001/login/', {
			method: 'POST',
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		const data = await response.json();

		console.log("response.status:", response.status);

		if (response.status === 202 && data.status === "go to 'verify-otp/' for complete connection") {
			console.log("2FA required:", data);
			localStorage.setItem("pendingUserEmail", data.email);
			open2FAModal(username, data.email);
		}
		else if (response.status === 202 && data.status === "login succes") {
			console.log("Login successful:", data);

			const userDetails = await fetchUserDetails(username);

			if (userDetails) {
				const storedLang = userDetails.language || localStorage.getItem('preferredLanguage') || 'en';

				localStorage.setItem('user', JSON.stringify({
					id: userDetails.id,
					username: userDetails.username,
					email: userDetails.email,
					is_2fa: userDetails.is_2fa,
					language: storedLang,
			}));

				await applyLanguage(storedLang);
			}

			window.history.pushState({}, "", "/home");
			handleLocation();
		}
		else {
            console.error("Login failed with details:", data);

			if (data.status === "Wrong password")
				await myAlert("invalidPassword");
			else if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors[0].includes("Unknown user"))
				await myAlert("invalidNameTournament");
			else
				await myAlert("loginFailed", data);
		}
	}
	catch (error) {
		console.error("Error during login:", error);
		await myAlert("defaultError");
	}
}

async function handleSignup(event) {
	event.preventDefault();

	const username = document.getElementById("signup-username").value;
	const email = document.getElementById("signup-email").value;
	const password = document.getElementById("signup-password").value;
	const confirmPassword = document.getElementById("signup-confirm-password").value;

	if (password !== confirmPassword) {
		console.error("Signup error: Passwords do not match.");
		await myAlert("passwordsNotMatch");
		return;
	}

	const userData = {
		"username": username,
		"email": email,
		"is_2fa": false,
		"password": password,
	};

	try {
		const response = await fetch('http://127.0.0.1:8001/users/', {
			method: 'POST',
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(userData)
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Signup failed with details:", errorData);

			Object.entries(errorData).forEach(([field, error]) => {
				console.error(`Field '${field}' error: ${error}`);
			});

			await myAlert("signupFailed", errorData);
			return;
		}

		const userResponse = await response.json();
		console.log("Signup response:", userResponse);

		await handleLogin(null, { username, password });

		localStorage.setItem('user', JSON.stringify({
			id: userResponse.id,
			username: userResponse.username,
			email: userResponse.email,
			is_2fa: userResponse.is_2fa,
		}));
	}
	catch (error) {
		console.error("Error during signup:", error);
	}
}

async function fetchUserDetails(username) {
	try {
		const response = await fetch(`http://127.0.0.1:8001/users/${username}/`, {
			method: 'GET',
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});

		if (response.ok) {
			const userData = await response.json();
			return userData;
		}
		else {
			console.warn("Failed to fetch user data");
			return null;
		}
	}
	catch (error) {
		console.warn("Error fetching user data:", error);
		return null;
	}
}

document.querySelector("form.login").addEventListener("submit", handleLogin);