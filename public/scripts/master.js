let activePatients = 0;
let totalPrescriptions = 0;

// Arrays to store prescriptions and patients
const prescriptions = [];
const patients = [];



// function savePrescription() {
//   const patientID = document.getElementById('patient-id').value;
//   const patientName = document.getElementById('patient-name').value;
//   const age = document.getElementById('age').value;
//   const weight = document.getElementById('weight').value;
//   const gender = document.getElementById('gender').value;
//   const diseaseCode = document.getElementById('disease-code').value;
//   const diagnosis = document.getElementById('diagnosis').value;

//   // Ensure required fields are filled
//   if (!patientID || !patientName || !age || !gender || !diagnosis) {
//     alert("Please fill in all required fields.");
//     return;
//   }

//   // Store the new prescription data
//   const prescriptionData = {
//     patientID,
//     patientName,
//     age,
//     weight,
//     gender,
//     diseaseCode,
//     diagnosis,
//   };

//   prescriptions.push(prescriptionData);
//   totalPrescriptions++;

//   // Update counts and chart
//   document.getElementById('total-prescriptions').querySelector('span').innerText = totalPrescriptions;
//   updateChart();

//   // Check if patient already exists, if not, add to patient list
//   if (!patients.some(patient => patient.patientID === patientID)) {
//     patients.push({ patientID, patientName, age, gender });
//     activePatients++;
//     document.getElementById('active-patients').querySelector('span').innerText = activePatients;
//   }

//   // Clear form fields but retain the medication template
//   const formFields = document.querySelectorAll('#prescription-form input, #prescription-form textarea');
//   formFields.forEach(field => field.value = '');

//   // Display success alert
//   alert("Prescription saved successfully!");

//   // Refresh patient and prescription displays
//   displayPatients();
//   displayPrescriptions();
// }

function savePrescription() {
    const patientID = document.getElementById('patient-id').value;
    const patientName = document.getElementById('patient-name').value;
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    const diseaseCode = document.getElementById('disease-code').value;
    const diagnosis = document.getElementById('diagnosis').value;
  
    // Ensure required fields are filled
    if (!patientID || !patientName || !age || !gender || !diagnosis) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Gather medication details
    const medications = [];
    document.querySelectorAll('#medications-list .medication').forEach(med => {
      const medication = {
        name: med.querySelector('input[placeholder="Medication Name"]').value,
        brand: med.querySelector('input[placeholder="Brand Name"]').value,
        generic: med.querySelector('input[placeholder="Generic Name"]').value,
        dosage: med.querySelector('input[placeholder="Dosage"]').value,
        route: med.querySelector('input[placeholder="Route of Administration"]').value,
        days: med.querySelector('input[placeholder="Days"]').value,
        frequency: med.querySelector('input[placeholder="Frequency"]').value,
        remarks: med.querySelector('textarea[placeholder="Additional Remarks"]').value,
      };
      medications.push(medication);
    });
  
    // Store the new prescription data including medications
    const prescriptionData = {
      patientID,
      patientName,
      age,
      weight,
      gender,
      diseaseCode,
      diagnosis,
      medications, // Include medications in the prescription data
    };
  
    prescriptions.push(prescriptionData);
    totalPrescriptions++;
  
    // Update counts
    document.getElementById('total-prescriptions').querySelector('span').innerText = totalPrescriptions;
    // updateChart();
  
    // Check if patient already exists, if not, add to patient list
    if (!patients.some(patient => patient.patientID === patientID)) {
      patients.push({ patientID, patientName, age, gender });
      activePatients++;
      document.getElementById('active-patients').querySelector('span').innerText = activePatients;
    }
  
    // Clear form fields but retain the medication template
    const formFields = document.querySelectorAll('#prescription-form input, #prescription-form textarea');
    formFields.forEach(field => field.value = '');
  
    // Display success alert
    alert("Prescription saved successfully!");
  
    // Refresh patient and prescription displays
    displayPatients();
    displayPrescriptions();
  }
  


function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
  document.getElementById('default-view').style.display = sectionId === 'main-view' ? 'block' : 'none';

  if (sectionId === 'view-prescriptions') {
    displayPrescriptions();
  } else if (sectionId === 'patient-list') {
    displayPatients();
  }

  if (sectionId !== 'main-view') {
    document.getElementById(sectionId).classList.remove('hidden');
  }
}

// function addMedication() {
//   const medicationTemplate = document.querySelector('.medication').cloneNode(true);
//   document.getElementById('medications-list').appendChild(medicationTemplate);
// }

function addMedication() {
  // Clone medication template and clear its input fields
  const medicationTemplate = document.querySelector('.medication').cloneNode(true);

  // Clear the cloned template fields
  medicationTemplate.querySelectorAll('input, textarea').forEach(field => field.value = '');

  // Append the cleared medication template to the medications list
  document.getElementById('medications-list').appendChild(medicationTemplate);
}

function discardLastMedication() {
  const medicationList = document.getElementById('medications-list');
  if (medicationList.childElementCount > 1) {
    medicationList.removeChild(medicationList.lastElementChild);
  }
}

function discardPrescription() {
  document.getElementById('prescription-form').reset();
  alert("Prescription discarded.");
}












function displayPrescriptions() {
  const prescriptionList = document.getElementById('prescription-list');
  prescriptionList.innerHTML = '';

  prescriptions.forEach((prescription, index) => {
    const newPrescription = document.createElement('div');
    newPrescription.className = 'prescription';
    newPrescription.innerHTML = `
      <div class="prescription-summary">
        Patient: ${prescription.patientName} | Disease code: ${prescription.diseaseCode}
      </div>
      <div class="prescription-details hidden" id="details-${index}">
        <p><strong>Patient ID:</strong> ${prescription.patientID}</p>
        <p><strong>Age:</strong> ${prescription.age}</p>
        <p><strong>Weight:</strong> ${prescription.weight}</p>
        <p><strong>Gender:</strong> ${prescription.gender}</p>
        <p><strong>Disease Code:</strong> ${prescription.diseaseCode}</p>
        <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
      </div>
    `;
    newPrescription.onclick = () => toggleDetails(index);
    prescriptionList.appendChild(newPrescription);
  });
}

function displayPatients() {
  const patientListContainer = document.getElementById('patient-list-container');
  patientListContainer.innerHTML = '';

  patients.forEach(patient => {
    const patientEntry = document.createElement('li');
    patientEntry.className = 'patient-entry';
    patientEntry.innerHTML = `
      <strong>Name:</strong> ${patient.patientName} |
      <strong>Gender:</strong> ${patient.gender} |
      <strong>Age:</strong> ${patient.age}
    `;
    patientListContainer.appendChild(patientEntry);
  });
}

function toggleDetails(index) {
  const details = document.getElementById(`details-${index}`);
  details.classList.toggle('hidden');
}

function filterPrescriptions() {
  const searchQuery = document.getElementById('search-bar').value.toLowerCase();
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery) ||
    prescription.diagnosis.toLowerCase().includes(searchQuery)
  );

  const prescriptionList = document.getElementById('prescription-list');
  prescriptionList.innerHTML = '';

  filteredPrescriptions.forEach((prescription, index) => {
    const newPrescription = document.createElement('div');
    newPrescription.className = 'prescription';
    newPrescription.innerHTML = `
      <div class="prescription-summary">
        Patient: ${prescription.patientName} | Diagnosis: ${prescription.diagnosis}
      </div>
      <div class="prescription-details hidden" id="details-${index}">
        <p><strong>Patient ID:</strong> ${prescription.patientID}</p>
        <p><strong>Age:</strong> ${prescription.age}</p>
        <p><strong>Weight:</strong> ${prescription.weight}</p>
        <p><strong>Gender:</strong> ${prescription.gender}</p>
        <p><strong>Disease Code:</strong> ${prescription.diseaseCode}</p>
        <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
      </div>
    `;
    newPrescription.onclick = () => toggleDetails(index);
    prescriptionList.appendChild(newPrescription);
  });
}

function updateChart() {
  const chart = Chart.getChart("activityChart");
  chart.data.datasets[0].data.push(totalPrescriptions);
  chart.update();
}

// Initialize the chart
// const ctx = document.getElementById('activityChart').getContext('2d');
// new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: Array.from({ length: 10 }, (_, i) => i + 1),
//     datasets: [{
//       label: 'Total Prescriptions',
//       data: Array(10).fill(0),
//       borderColor: 'rgb(75, 192, 192)',
//       fill: false,
//       tension: 0.1,
//     }],
//   },
// });

const ctx = document.getElementById('activityChart').getContext('2d');
// new Chart(ctx, {
//   type: 'bar', // Change from 'line' to 'bar'
//   data: {
//     labels: Array.from({ length: 10 }, (_, i) => `Prescription ${i + 1}`),
//     datasets: [{
//       label: 'Total Prescriptions',
//       data: Array(10).fill(0),
//       backgroundColor: 'rgba(75, 192, 192, 0.5)', // Bar color
//       borderColor: 'rgb(75, 192, 192)',
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Count of Prescriptions'
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Prescription Entries'
//         }
//       }
//     }
//   }
// });


function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
  document.getElementById('default-view').style.display = sectionId === 'main-view' ? 'block' : 'none';

  if (sectionId === 'view-prescriptions') {
    displayPrescriptions();
  } else if (sectionId === 'patient-list') {
    displayPatients();
  }

  if (sectionId !== 'main-view') {
    document.getElementById(sectionId).classList.remove('hidden');
  }
}

// function addMedication() {
//   const medicationTemplate = document.querySelector('.medication').cloneNode(true);
//   document.getElementById('medications-list').appendChild(medicationTemplate);
// }

function addMedication() {
  // Clone medication template and clear its input fields
  const medicationTemplate = document.querySelector('.medication').cloneNode(true);

  // Clear the cloned template fields
  medicationTemplate.querySelectorAll('input, textarea').forEach(field => field.value = '');

  // Append the cleared medication template to the medications list
  document.getElementById('medications-list').appendChild(medicationTemplate);
}

function discardLastMedication() {
  const medicationList = document.getElementById('medications-list');
  if (medicationList.childElementCount > 1) {
    medicationList.removeChild(medicationList.lastElementChild);
  }
}

function discardPrescription() {
  document.getElementById('prescription-form').reset();
  alert("Prescription discarded.");
}












// function displayPrescriptions() {
//   const prescriptionList = document.getElementById('prescription-list');
//   prescriptionList.innerHTML = '';

//   prescriptions.forEach((prescription, index) => {
//     const newPrescription = document.createElement('div');
//     newPrescription.className = 'prescription';
//     newPrescription.innerHTML = `
//       <div class="prescription-summary">
//         Patient: ${prescription.patientName} | Disease code: ${prescription.diseaseCode}
//       </div>
//       <div class="prescription-details hidden" id="details-${index}">
//         <p><strong>Patient ID:</strong> ${prescription.patientID}</p>
//         <p><strong>Age:</strong> ${prescription.age}</p>
//         <p><strong>Weight:</strong> ${prescription.weight}</p>
//         <p><strong>Gender:</strong> ${prescription.gender}</p>
//         <p><strong>Disease Code:</strong> ${prescription.diseaseCode}</p>
//         <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
//       </div>
//     `;
//     newPrescription.onclick = () => toggleDetails(index);
//     prescriptionList.appendChild(newPrescription);
//   });
// }

function displayPrescriptions() {
    const prescriptionList = document.getElementById('prescription-list');
    prescriptionList.innerHTML = '';
  
    prescriptions.forEach((prescription, index) => {
      const newPrescription = document.createElement('div');
      newPrescription.className = 'prescription';
      newPrescription.innerHTML = `
        <div class="prescription-summary">
          Patient: ${prescription.patientName} | Disease code: ${prescription.diseaseCode}
        </div>
        <div class="prescription-details hidden" id="details-${index}">
          <p><strong>Patient ID:</strong> ${prescription.patientID}</p>
          <p><strong>Age:</strong> ${prescription.age}</p>
          <p><strong>Weight:</strong> ${prescription.weight}</p>
          <p><strong>Gender:</strong> ${prescription.gender}</p>
          <p><strong>Disease Code:</strong> ${prescription.diseaseCode}</p>
          <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
          <h4>Medications:</h4>
          <ul>
            ${prescription.medications.map(med => `
              <li>
                <p><strong>Name:</strong> ${med.name}</p>
                <p><strong>Brand:</strong> ${med.brand}</p>
                <p><strong>Generic Name:</strong> ${med.generic}</p>
                <p><strong>Dosage:</strong> ${med.dosage}</p>
                <p><strong>Route:</strong> ${med.route}</p>
                <p><strong>Days:</strong> ${med.days}</p>
                <p><strong>Frequency:</strong> ${med.frequency}</p>
                <p><strong>Remarks:</strong> ${med.remarks}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
      newPrescription.onclick = () => toggleDetails(index);
      prescriptionList.appendChild(newPrescription);
    });
  }
  

function displayPatients() {
  const patientListContainer = document.getElementById('patient-list-container');
  patientListContainer.innerHTML = '';

  patients.forEach(patient => {
    const patientEntry = document.createElement('li');
    patientEntry.className = 'patient-entry';
    patientEntry.innerHTML = `
      <strong>Name:</strong> ${patient.patientName} |
      <strong>Gender:</strong> ${patient.gender} |
      <strong>Age:</strong> ${patient.age}
    `;
    patientListContainer.appendChild(patientEntry);
  });
}

function toggleDetails(index) {
  const details = document.getElementById(`details-${index}`);
  details.classList.toggle('hidden');
}

function filterPrescriptions() {
  const searchQuery = document.getElementById('search-bar').value.toLowerCase();
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery) ||
    prescription.diagnosis.toLowerCase().includes(searchQuery)
  );

  const prescriptionList = document.getElementById('prescription-list');
  prescriptionList.innerHTML = '';

  filteredPrescriptions.forEach((prescription, index) => {
    const newPrescription = document.createElement('div');
    newPrescription.className = 'prescription';
    newPrescription.innerHTML = `
      <div class="prescription-summary">
        Patient: ${prescription.patientName} | Diagnosis: ${prescription.diagnosis}
      </div>
      <div class="prescription-details hidden" id="details-${index}">
        <p><strong>Patient ID:</strong> ${prescription.patientID}</p>
        <p><strong>Age:</strong> ${prescription.age}</p>
        <p><strong>Weight:</strong> ${prescription.weight}</p>
        <p><strong>Gender:</strong> ${prescription.gender}</p>
        <p><strong>Disease Code:</strong> ${prescription.diseaseCode}</p>
        <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
      </div>
    `;
    newPrescription.onclick = () => toggleDetails(index);
    prescriptionList.appendChild(newPrescription);
  });
}

function updateChart() {
  const chart = Chart.getChart("activityChart");
  chart.data.datasets[0].data.push(totalPrescriptions);
  chart.update();
}

// Initialize the chart
// const ctx = document.getElementById('activityChart').getContext('2d');
// new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: Array.from({ length: 10 }, (_, i) => i + 1),
//     datasets: [{
//       label: 'Total Prescriptions',
//       data: Array(10).fill(0),
//       borderColor: 'rgb(75, 192, 192)',
//       fill: false,
//       tension: 0.1,
//     }],
//   },
// });
