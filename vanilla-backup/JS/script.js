// Navbar Toggle
document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.querySelector(".downArrow");
    const menuItems = document.querySelector(".nav-elements");
    const arrowIcon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", function() {
        menuItems.classList.toggle("active");
        arrowIcon.classList.toggle("fa-chevron-up");
        arrowIcon.classList.toggle("fa-chevron-down");
    });

    // Typing Animation
    const text = "Code Beyond Your Limits";
    const target = document.querySelector(".typing-text");
    let i = 0;
    
    const typing = () => {
        if (i < text.length) {
            target.textContent += text.charAt(i);
            i++;
            setTimeout(typing, 80);
        }
    };
    typing();

    // Preloader
    window.addEventListener("load", function() {
        setTimeout(() => {
            document.getElementById("preloader").style.display = "none";
        }, 1000);
    });

    // Highlight current page's button
    const currentPage = window.location.pathname.split('/').pop();
    if(currentPage === 'login.html') {
        document.querySelector('.login-btn').classList.add('active');
    } else if(currentPage === 'signup.html') {
        document.querySelector('.signup-btn').classList.add('active');
    }
});