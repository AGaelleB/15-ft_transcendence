document.addEventListener("DOMContentLoaded", function() {
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
  
    window.addEventListener('hashchange', switchFormBasedOnHash);
  
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight')
            signupBtn.click();
        else if (event.key === 'ArrowLeft')
            loginBtn.click();
    });
  });
  