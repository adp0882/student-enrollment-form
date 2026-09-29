const form = document.getElementById("enrollmentForm");
const course = document.getElementById("course");
const majorField = document.getElementById("majorField");
const successMessage = document.getElementById("successMessage");

const fieldIds = [
  "studentId", "prefix", "firstName", "middleName",
  "lastName", "suffix", "email", "course", "major", "yearLevel"
];

function value(id) {
  return document.getElementById(id).value.trim();
}

function showError(id, message) {
  document.getElementById(`${id}Error`).textContent = message;
}

fieldIds.forEach((id) => {
  const field = document.getElementById(id);
  const eventName = field.tagName === "SELECT" ? "change" : "input";

  field.addEventListener(eventName, () => {
    showError(id, "");
    successMessage.textContent = "";
  });
});

course.addEventListener("change", () => {
  majorField.hidden = course.value !== "BSIT";
  document.getElementById("major").value = "";
  showError("major", "");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  fieldIds.forEach((id) => showError(id, ""));
  successMessage.textContent = "";

  let valid = true;

  function requireLength(id, label, minimum) {
    if (value(id).length < minimum) {
      showError(id, `${label} must have at least ${minimum} characters.`);
      valid = false;
    }
  }

  function optionalLength(id, label, minimum) {
    if (value(id) && value(id).length < minimum) {
      showError(id, `${label} must have at least ${minimum} characters if entered.`);
      valid = false;
    }
  }

  requireLength("studentId", "Student ID", 5);
  requireLength("firstName", "First name", 3);
  requireLength("lastName", "Last name", 2);

  optionalLength("prefix", "Prefix", 2);
  optionalLength("middleName", "Middle name", 2);
  optionalLength("suffix", "Suffix", 2);

  const email = value("email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Enter a valid email address.");
    valid = false;
  }

  if (!value("course")) {
    showError("course", "Select a course.");
    valid = false;
  }

  if (value("course") === "BSIT" && !value("major")) {
    showError("major", "Select a BSIT major.");
    valid = false;
  }

  if (!value("yearLevel")) {
    showError("yearLevel", "Select a year level.");
    valid = false;
  }

  if (!valid) return;

  const fullName = [
    value("prefix"),
    value("firstName"),
    value("middleName"),
    value("lastName"),
    value("suffix")
  ].filter(Boolean).join(" ");

  const row = document.createElement("tr");
  const data = [
    value("studentId"),
    fullName,
    email,
    value("course"),
    value("course") === "BSIT" ? value("major") : "—",
    value("yearLevel")
  ];

  data.forEach((item) => {
    const cell = document.createElement("td");
    cell.textContent = item;
    row.appendChild(cell);
  });

  document.getElementById("studentTableBody").appendChild(row);
  form.reset();
  majorField.hidden = true;
  successMessage.textContent = "Student enrollment submitted successfully!";
});