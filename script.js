const STORAGE_KEY = "students";
const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");

document.addEventListener("DOMContentLoaded", loadStudents);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById("studentName").value.trim(),
    id: document.getElementById("studentID").value.trim(),
    email: document.getElementById("email").value.trim(),
    contact: document.getElementById("contact").value.trim(),
  };

  if (!validate(student)) return;

  let students = getStudents();
  students.push(student);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

  form.reset();
  loadStudents();
});

function validate(student) {
  const nameRegex = /^[A-Za-z\s]+$/;
  const contactRegex = /^\d{10,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!student.name.match(nameRegex)) {
    alert("Name must contain only letters!");
    return false;
  }
  if (student.id === "" || isNaN(student.id)) {
    alert("Student ID must be a number!");
    return false;
  }
  const students = getStudents();
  const duplicate = students.find((s) => s.id === student.id);
  if (duplicate) {
    alert("This Student ID is already registered!");
    return false;
  }
  if (!student.email.match(emailRegex)) {
    alert("Enter a valid email!");
    return false;
  }
  if (!student.contact.match(contactRegex)) {
    alert("Contact number must be at least 10 digits!");
    return false;
  }
  return true;
}

function getStudents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function loadStudents() {
  const students = getStudents();
  tableBody.innerHTML = "";
  students.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Name">${student.name}</td>
      <td data-label="ID">${student.id}</td>
      <td data-label="Email"><a href="mailto:${student.email}">${student.email}</a></td>
      <td data-label="Contact">${student.contact}</td>
      <td data-label="Actions">
        <button class="edit" onclick="editStudent(${index})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete" onclick="deleteStudent(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function editStudent(index) {
  const students = getStudents();
  const student = students[index];

  document.getElementById("studentName").value = student.name;
  document.getElementById("studentID").value = student.id;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;

  students.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  loadStudents();
}

function deleteStudent(index) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  let students = getStudents();
  students.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  loadStudents();
}
