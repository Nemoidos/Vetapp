// Function to toggle dropdown menus
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

const drugs = [
    {
        id: 'Epinefrine',  // Changed from 'adrenaline'
        concentration: 1,  // 1 mg/mL
        dogDoseMin: 0.01,
        dogDoseMax: 0.1,
        catDoseMin: 0.01,
        catDoseMax: 0.1,
        route: 'IV, IC, IT',
        mg: 'epinefrine-mg',  // Updated ID
        ml: 'epinefrine-ml'   // Updated ID
    },
    {
        id: 'Atropine',
        concentration: 1,  // 1 mg/mL
        dogDoseMin: 0.04,
        dogDoseMax: 0.04,
        catDoseMin: 0.04,
        catDoseMax: 0.04,
        route: 'IV',
        mg: 'atropine-mg',
        ml: 'atropine-ml'
    },
    {
        id: 'CalciumGluconate',  // Changed from 'calcium'
        concentration: 100,  // 100 mg/mL
        dogDoseMin: 50,  // mg/kg
        dogDoseMax: 100, // mg/kg
        catDoseMin: 50,  // mg/kg
        catDoseMax: 50,  // mg/kg
        route: 'IV',
        mg: 'calciumGluconate-mg',  // Updated ID
        ml: 'calciumGluconate-ml'   // Updated ID
    },
    {
        id: 'Diazepam',
        concentration: 5,  // 5 mg/mL
        dogDoseMin: 0.2,
        dogDoseMax: 0.5,
        catDoseMin: 0.5,
        catDoseMax: 1,
        route: 'IV, PR',
        mg: 'diazepam-mg',
        ml: 'diazepam-ml'
    },
    {
        id: 'Furosemide',
        concentration: 10,  // 10 mg/mL
        dogDoseMin: 1,
        dogDoseMax: 5,
        catDoseMin: 2,
        catDoseMax: 2,
        route: 'IV, IM, SC, PO',
        mg: 'furosemide-mg',
        ml: 'furosemide-ml'
    },
    {
        id: 'NaCl 5,85%',  
        concentration: null,  // No mg/mL concentration
        dogDoseMin: 0.5,  // in ml/kg
        dogDoseMax: 5,    // in ml/kg
        catDoseMin: 0.5,  // in ml/kg
        catDoseMax: 3,    // in ml/kg
        route: 'IV',
        mg: 'NaCl 5,85%-mg',  // Updated ID
        ml: 'NaCl 5,85%-ml'   // Updated ID
    },
    {
        id: 'Midazolam',
        concentration: 5,  // 5 mg/mL
        dogDoseMin: 0.2,
        dogDoseMax: 0.3,
        catDoseMin: 0.2,
        catDoseMax: 0.3,
        route: 'IV, Intranasal',
        mg: 'midazolam-mg',
        ml: 'midazolam-ml'
    },
    {
        id: 'Naloxone',
        concentration: 0.4,  // 0.4 mg/mL
        dogDoseMin: 0.01,
        dogDoseMax: 0.04,
        catDoseMin: 0.01,
        catDoseMax: 0.04,
        route: 'IV, IM, SC',
        mg: 'naloxone-mg',
        ml: 'naloxone-ml'
    },
    {
        id: 'Phenobarbital',
        concentration: 200,  // 200 mg/mL
        dogDoseMin: 2,   // mg/kg for bolus
        dogDoseMax: 5,   // mg/kg for bolus
        catDoseMin: 2,   // mg/kg for PO
        catDoseMax: 20,  // mg/kg for IV slowly over 15 minutes
        route: 'IV, PO',
        mg: 'phenobarbital-mg',
        ml: 'phenobarbital-ml'
    }
];

// Function to initialize the drug table with placeholders
function initializeDrugTable() {
    const tableBody = document.getElementById('drug-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    drugs.forEach(drug => {
        // Use placeholders for all initial rows
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${drug.id.replace(/([A-Z])/g, ' $1').trim().replace(/NaCl585/, 'NaCl 5.85%')}</td>
            <td>${drug.dogDoseMin} - ${drug.dogDoseMax} ${drug.concentration !== null ? 'mg/kg' : 'ml/kg'} <br> (${drug.route})</td>
            <td>${drug.concentration !== null ? `<input type="number" id="${drug.id}-concentration" value="${drug.concentration}" onchange="updateDose('${drug.id}', ${drug.dogDoseMin}, ${drug.dogDoseMax}, 0)"> mg/mL` : 'N/A'}</td>
            <td id="${drug.mg}">--- - --- mg</td>
            <td id="${drug.ml}">--- - --- mL</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to calculate doses or display placeholders
function calculateDoses(animalType) {
    const weightInput = document.getElementById('animal-weight');
    let weight = parseFloat(weightInput.value);

    const tableBody = document.getElementById('drug-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    drugs.forEach(drug => {
        let doseMin = animalType === 'dog' ? drug.dogDoseMin : drug.catDoseMin;
        let doseMax = animalType === 'dog' ? drug.dogDoseMax : drug.catDoseMax;
        let totalDoseMin, totalDoseMax, volumeToDrawMin, volumeToDrawMax;

        if (isNaN(weight) || weight <= 0) {
            // Use placeholders if no valid input
            totalDoseMin = totalDoseMax = volumeToDrawMin = volumeToDrawMax = "---";
        } else {
            totalDoseMin = (doseMin * weight).toFixed(2);
            totalDoseMax = (doseMax * weight).toFixed(2);

            if (drug.concentration !== null) {
                volumeToDrawMin = (totalDoseMin / drug.concentration).toFixed(2);
                volumeToDrawMax = (totalDoseMax / drug.concentration).toFixed(2);
            } else {
                volumeToDrawMin = totalDoseMin;
                volumeToDrawMax = totalDoseMax;
            }
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${drug.id.replace(/([A-Z])/g, ' $1').trim().replace(/NaCl585/, 'NaCl 5.85%')}</td>
            <td>${doseMin} - ${doseMax} ${drug.concentration !== null ? 'mg/kg' : 'ml/kg'} <br> (${drug.route})</td>
            <td>${drug.concentration !== null ? `<input type="number" id="${drug.id}-concentration" value="${drug.concentration}" onchange="updateDose('${drug.id}', ${doseMin}, ${doseMax}, ${weight})"> mg/mL` : 'N/A'}</td>
            <td id="${drug.mg}">${totalDoseMin} - ${totalDoseMax} ${drug.concentration !== null ? 'mg' : 'ml'}</td>
            <td id="${drug.ml}">${volumeToDrawMin} - ${volumeToDrawMax} mL</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize the drug table with placeholders on page load
document.addEventListener('DOMContentLoaded', initializeDrugTable);


function updateDose(drugId, doseMin, doseMax, weight) {
    const drug = drugs.find(d => d.id === drugId);
    const concentration = drug.concentration !== null ? parseFloat(drug.concentration) : null;

    if (concentration === null || isNaN(concentration) || concentration <= 0) {
        alert('Please enter a valid concentration.');
        return;
    }

    const totalDoseMin = (doseMin * weight).toFixed(2);
    const totalDoseMax = (doseMax * weight).toFixed(2);
    const volumeToDrawMin = (totalDoseMin / concentration).toFixed(2);
    const volumeToDrawMax = (totalDoseMax / concentration).toFixed(2);

    document.getElementById(drug.mg).textContent = `${totalDoseMin} - ${totalDoseMax} mg`;
    document.getElementById(drug.ml).textContent = `${volumeToDrawMin} - ${volumeToDrawMax} mL`;
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


// Optional: Language Switch Function (same as before)
function switchToEnglish() {
    alert("Switching to English will be implemented later.");
}

// Close any open dropdowns if clicked outside (same as before)
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
};

