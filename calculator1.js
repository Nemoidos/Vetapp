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

// Function to open a modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Function to close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to calculate potassium correction
function calculatePotassiumCorrection() {
    // Get input values from the HTML input fields
    const weightInput = document.getElementById("animal-weight").value;
    const potassiumLevelInput = document.getElementById("potassium-level").value;

    // Convert input values to float and handle invalid input
    const weight = parseFloat(weightInput.replace(',', '.'));
    const potassiumLevel = parseFloat(potassiumLevelInput.replace(',', '.'));

    // Validate weight input
    if (weight > 110) {
        document.getElementById("animal-weight").value = ""; // Clear the input
        openModal('dog-modal');
        return;
    }

    if (weight < 0) {
        showAlert("Weight cannot be a negative number!");
        document.getElementById("animal-weight").value = ""; // Clear the input
        return;
    }

    // Validate potassium level input
    if (potassiumLevel < 0) {
        showAlert("Potassium level cannot be a negative number!");
        document.getElementById("potassium-level").value = ""; // Clear the input
        return;
    }

    if (potassiumLevel >= 5) {
        showAlert("Patient doesn't need rapid potassium correction. STOP, think twice or you will KILL something!");
        return;
    }

    // Check if the input values are valid numbers
    if (isNaN(weight) || isNaN(potassiumLevel)) {
        showAlert("Please enter valid numbers for weight and potassium level.");
        return;
    }

    // Perform calculations for potassium correction
    const kclNeeded = (5 - potassiumLevel) * weight * 0.6;
    const maxMlPerHour = 0.5 * weight;

    // Display the results in the results div
    const resultText = `7.5% KCl Needed: ${kclNeeded.toFixed(2)} ml <br>Maximum speed = ${maxMlPerHour.toFixed(2)} ml/h:`;
    document.getElementById("potassium-results").innerHTML = resultText;
}

function showAlert(message) {
    const alertBox = document.createElement("div");
    alertBox.classList.add("serious-alert");  // Apply the serious alert class
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    alertBox.style.position = "fixed";
    alertBox.style.top = "50%";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translate(-50%, -50%)";
    alertBox.style.backgroundColor = "#ff4d4d"; // Red background color for warning
    alertBox.style.color = "white";
    alertBox.style.padding = "20px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    alertBox.style.zIndex = "1000";
    alertBox.style.fontWeight = "bold";
    alertBox.style.textAlign = "center";

    setTimeout(() => {
        alertBox.remove();
    }, 5000);  // Slightly longer duration for the warning to be noticed
}


document.addEventListener('DOMContentLoaded', function() {
    let hematocritReference;
    let selectedSpecies = null; // No species selected by default

    function selectSpecies(species) {
        const dogToggle = document.getElementById("dog-toggle");
        const catToggle = document.getElementById("cat-toggle");

        if (!dogToggle || !catToggle) {
            console.error("Toggle buttons not found.");
            return;
        }

        dogToggle.classList.remove("selected");
        catToggle.classList.remove("selected");

        if (species === 'dog') {
            hematocritReference = 46;
            selectedSpecies = 'dog';
            dogToggle.classList.add("selected");
        } else if (species === 'cat') {
            hematocritReference = 39;
            selectedSpecies = 'cat';
            catToggle.classList.add("selected");
        }
    }

    function calculateReticulocyteIndex() {
        if (!selectedSpecies) {
            showAlert("Please select a species (dog or cat) before calculating.");
            return;
        }

        const hematocritPatientInput = document.getElementById("hematocrit-patient").value;
        const reticulocytePercentInput = document.getElementById("reticulocyte-percent").value;

        const hematocritPatient = parseFloat(hematocritPatientInput.replace(',', '.'));
        const reticulocytePercent = parseFloat(reticulocytePercentInput.replace(',', '.'));

        if (isNaN(hematocritPatient) || isNaN(reticulocytePercent)) {
            showAlert("Please enter valid numbers for hematocrit and reticulocyte count.");
            return;
        }

        const correctedPercent = reticulocytePercent * (hematocritPatient / hematocritReference);
        const reticulocyteIndexValue = correctedPercent / 2.5;

        let anemiaType = correctedPercent > 1 
            ? "<span class='regenerative'>Regenerativne Anemia</span>" 
            : "<span class='non-regenerative'>NON-Regenerative Anemia</span>";
        let regenerationStatus = reticulocyteIndexValue > 1 
            ? "<span class='sufficient-regeneration'>Sufficient Regeneration</span>" 
            : "<span class='insufficient-regeneration'>Insufficient Regeneration</span>";

        const resultText = `<span class='result-value'>Corrected Reticulocyte %: ${correctedPercent.toFixed(2)}</span><br>
                            <span class='result-value'>Reticulocyte Index: ${reticulocyteIndexValue.toFixed(2)}</span><br>
                            ${anemiaType}<br>
                            ${regenerationStatus}`;
        document.getElementById("reticulocyte-results").innerHTML = resultText;
    }

    function showAlert(message) {
        const alertBox = document.createElement("div");
        alertBox.classList.add("alert-box");
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        alertBox.style.position = "fixed";
        alertBox.style.top = "50%";
        alertBox.style.left = "50%";
        alertBox.style.transform = "translate(-50%, -50%)";
        alertBox.style.backgroundColor = "#f44336";
        alertBox.style.color = "white";
        alertBox.style.padding = "20px";
        alertBox.style.borderRadius = "8px";
        alertBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        alertBox.style.zIndex = "1000";

        setTimeout(() => {
            alertBox.remove();
        }, 2000);
    }

    window.selectSpecies = selectSpecies;
    window.calculateReticulocyteIndex = calculateReticulocyteIndex;
});


document.addEventListener('DOMContentLoaded', function() {
    // Function to calculate RER and display results
    function calculateRER(percentage) {
        const weightInput = document.getElementById('animal-weight').value;

        // Validate the weight input
        const weight = parseFloat(weightInput.replace(',', '.'));
        if (isNaN(weight) || weight <= 0) {
            showAlert("Please enter a valid weight.");
            return;
        }

        // Calculate 100% RER
        const rer100 = Math.pow(weight, 0.75) * 70;
        let rer;
        
        if (percentage === '100') {
            rer = rer100;
        } else if (percentage === '33') {
            rer = rer100 * (1/3);
        } else if (percentage === '20') {
            rer = rer100 * (1/5);
        }

        // Display RER results
        displayRERResults(rer, percentage);
    }

function displayRERResults(rer, percentage) {
    const nutritionResults = document.getElementById('nutrition-results');
    
    // Update the RER result text with a span using the class
    let resultText = `<p><span class="rer-result">${percentage}% RER: ${rer.toFixed(2)} Kcal/day</span></p>`;

    // Define food types and their kcal/g
    const foodTypes = {
        'Royal canine a/d': 1.115,
        'Royal canine i/d': 1.08,
        'Convalescence Support': 4.43,
        'Recovery liquid': 1
    };

    // Create a table for food conversions
    resultText += `<h3>Food Conversions:</h3>`;
    resultText += `<table>`;
    for (const [food, kcalPerG] of Object.entries(foodTypes)) {
        const grams = rer / kcalPerG;
        resultText += `<tr><th>${food}</th><td>${grams.toFixed(2)}g</td></tr>`;
    }
    resultText += `</table>`;

    nutritionResults.innerHTML = resultText;
}

    // Attach the functions to window for global access
    window.calculateRER = calculateRER;
});


// Variables to store concentration and other input values
let norepinephrineConcentration = 1; // Default concentration in mg/ml

// Function to change the concentration
function changeConcentration() {
    const newConcentration = parseFloat(prompt("Enter new concentration in mg/ml:"));
    if (!isNaN(newConcentration) && newConcentration > 0) {
        norepinephrineConcentration = newConcentration;
        document.getElementById('concentration-label').innerText = `Concentration (mg/ml): ${norepinephrineConcentration}`;
    } else {
        alert("Please enter a valid concentration.");
    }
}

// Function to calculate the dosage
function calculateNorepinephrineCRI() {
    const dose = parseFloat(document.getElementById('dose').value);
    const weight = parseFloat(document.getElementById('animal-weight').value);

    if (isNaN(dose) || isNaN(weight) || dose < 0.1 || dose > 2 || weight <= 0) {
        alert("Please enter valid values for dose (0.1 - 2 μg/kg/min) and weight (>0 kg).");
        return;
    }

    const doseInMgPerMinute = (dose * weight) / 1000;
    const doseInMgPerHour = doseInMgPerMinute * 60;
    const doseInMlPerHour = doseInMgPerHour / norepinephrineConcentration;

    let resultHTML = `
        <p><strong>Dosage in mg/hr:</strong> ${doseInMgPerHour.toFixed(4)} mg/hr</p>
        <p><strong>Dosage in ml/hr:</strong> ${doseInMlPerHour.toFixed(4)} ml/hr</p>
    `;

    if (doseInMlPerHour <= 1) {
        const volumeFor10mlSyringe = (10 * doseInMgPerHour) / norepinephrineConcentration;
        const volumeFor20mlSyringe = (20 * doseInMgPerHour) / norepinephrineConcentration;

        resultHTML += `
            <p><strong>Syringe Preparation (for CRI at 1 ml/hr):</strong></p>
            <p>Volume to draw for 10 ml syringe: ${volumeFor10mlSyringe.toFixed(2)} ml</p>
            <p>Volume to draw for 20 ml syringe: ${volumeFor20mlSyringe.toFixed(2)} ml</p>
        `;
    } else {
        resultHTML += `
            <p><strong>Syringe calculation is irrelevant for doses above 1 ml/hr.</strong></p>
        `;
    }

    document.getElementById('result-norepinephrine').innerHTML = resultHTML;
}

// Ensure this runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const changeConcentrationButton = document.getElementById('change-concentration-btn');
    const calculateButton = document.getElementById('calculate-btn');

    if (changeConcentrationButton && calculateButton) {
        changeConcentrationButton.addEventListener('click', changeConcentration);
        calculateButton.addEventListener('click', calculateNorepinephrineCRI);
    }
});
// Function to calculate General CRI
function calculateGeneralCRI() {
    // Get the selected syringe size
    const syringeSize = document.querySelector('input[name="syringe-size-genCRI"]:checked').value;

    // Get input values for dose, concentration, and animal weight
    const dose = parseFloat(document.getElementById('dose-mg-kg-hour-genCRI').value.replace(',', '.'));
    const concentration = parseFloat(document.getElementById('concentration-mg-ml-genCRI').value.replace(',', '.'));
    const weight = parseFloat(document.getElementById('animal-weight-genCRI').value.replace(',', '.'));  

    // Validate inputs
    if (isNaN(dose) || isNaN(concentration) || isNaN(weight) || weight <= 0) {
        alert('Please enter valid numbers for weight, dose, and concentration.');
        return;
    }

    // Calculate dose in ml/hour
    const doseMlHour = (weight * dose) / concentration;

    let resultText = '';

    if (doseMlHour >= 1) {
        resultText = `Flow rate: ${doseMlHour.toFixed(2)} ml/hour<br>`;
        resultText += `Fill ${syringeSize}ml syringe with ${syringeSize} ml of pure drug without saline<br>`;
    } else {
        const drugVolume = Math.min(doseMlHour * syringeSize, syringeSize);
        const salineVolume = syringeSize - drugVolume;
        resultText = `Dose in ml/hour: ${doseMlHour.toFixed(2)} ml/hour<br>`;
        resultText += `For ${syringeSize}ml syringe: ${drugVolume.toFixed(2)} ml of drug, ${salineVolume.toFixed(2)} ml of (F1/1)<br>`;
        resultText += `CRI flow rate: 1 ml/hour`;
    }

    // Display results
    document.getElementById('general-cri-results-genCRI').innerHTML = resultText;
}

// Event listener for the calculate button
document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-general-cri-btn-genCRI');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateGeneralCRI);
    }
});


// Function to calculate Hypernatremia Correction
function calculateHypernatremia() {
    // Get input values
    const weight = parseFloat(document.getElementById('weight-hyper').value.replace(',', '.'));
    const naConcentration = parseFloat(document.getElementById('na-concentration-hyper').value.replace(',', '.'));
    const speed = parseFloat(document.getElementById('speed-hyper').value.replace(',', '.'));
    const fluidNa = parseFloat(document.querySelector('input[name="fluid-selection-hyper"]:checked').value);

    // Validate inputs
    if (isNaN(weight) || isNaN(naConcentration) || isNaN(speed) || isNaN(fluidNa)) {
        alert('Please enter valid numbers.');
        return;
    }

    // Perform calculations
    const excessNa = naConcentration - 155;
    const effectPerLiter = (fluidNa - naConcentration) / ((weight * 0.6) + 1);
    const volumeOfFluid = excessNa / effectPerLiter;
    const hoursNeeded = excessNa / speed;
    const hourlyRate = (volumeOfFluid / hoursNeeded) * 1000; // Convert from L/h to ml/h

    // Display results
    let resultText = `Excess Sodium: ${Math.abs(excessNa).toFixed(2)} mmol<br>`;
    resultText += `Effect per Liter: ${Math.abs(effectPerLiter).toFixed(2)} mmol<br>`;
    resultText += `Volume of Fluid Needed: ${Math.abs(volumeOfFluid).toFixed(2)} litere<br>`;
    resultText += `Correction Time: ${Math.abs(hoursNeeded).toFixed(2)} hours<br>`;
    resultText += `Volume per Hour: ${Math.abs(hourlyRate).toFixed(2)} ml/h`;

    document.getElementById('hypernatremia-results').innerHTML = resultText;
}

// Event listener for the calculate button
document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-hyper-btn');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateHypernatremia);
    }
});

function transfusionCalculation() {
    alert("Transfusion Calculation feature will be implemented later.");
}

function infusionTherapy() {
    alert("Infusion Therapy feature will be implemented later.");
}

function poisonCalculator() {
    alert("Poison Calculator feature will be implemented later.");
}

function pillsCalculator() {
    alert("Pills Calculator feature will be implemented later.");
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
