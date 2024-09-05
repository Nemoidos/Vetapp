function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        // Toggle dropdown visibility
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    }
}




function poisonCalculator() {
    alert("Poison Calculator feature will be implemented later.");
}

function bloodworkAnalysis() {
    alert("Bloodwork Analysis feature will be implemented later.");
}

function switchToEnglish() {
    alert("Switching to English will be implemented later.");
}

function emergencyDrugCalculator() {
    // Redirect to the new emergency calculator page
    window.location.href = 'emergency_calculator.html';
}

// Function to toggle dark mode and save the state in local storage
function toggleDarkMode() {
    document.documentElement.classList.toggle("dark-mode");
    document.body.classList.toggle("dark-mode");

    // Check the current state of dark mode
    const isDarkMode = document.documentElement.classList.contains("dark-mode");

    // Save the current state in local storage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

    // Toggle dark mode for all relevant elements
    document.querySelectorAll(".navbar, .navbar-button, .dropbtn, section, div").forEach((element) => {
        element.classList.toggle("dark-mode");
    });
}

// Function to apply dark mode based on saved state in local storage
function applyDarkMode() {
    const darkModeState = localStorage.getItem('darkMode');

    if (darkModeState === 'enabled') {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");

        // Ensure all relevant elements are toggled for dark mode
        document.querySelectorAll(".navbar, .navbar-button, .dropbtn, section, div").forEach((element) => {
            element.classList.add("dark-mode");
        });
    }
}

// Call applyDarkMode when the page loads
document.addEventListener('DOMContentLoaded', applyDarkMode);

// Close any open dropdowns if clicked outside
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
};
