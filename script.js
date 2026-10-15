
const body = document.body;
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const globalSearch = document.getElementById("globalSearch");
const toast = document.getElementById("toast");

let toastTimer;

// Display a small notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Set today's date
const dateElement = document.getElementById("currentDate");

dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric"
}).format(new Date());

// Mobile sidebar
menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

// Close the mobile sidebar when a link is selected
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Update active navigation and page heading
function updateNavigation() {
  const hash = window.location.hash || "#dashboard";
  let activeLink = null;

  document.querySelectorAll(".nav-link").forEach(link => {
    const isActive = link.getAttribute("href") === hash;
    link.classList.toggle("active", isActive);

    if (isActive) activeLink = link;
  });

  const pageTitle = document.getElementById("pageTitle");
  const title = activeLink
    ? activeLink.querySelector("span").textContent
    : "Dashboard";

  pageTitle.textContent = title;
}

window.addEventListener("hashchange", updateNavigation);
updateNavigation();

// Light and dark themes
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark");

  themeToggle.innerHTML = isDark
    ? '<i class="fa-regular fa-sun"></i>'
    : '<i class="fa-regular fa-moon"></i>';

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );

  showToast(isDark ? "Dark mode enabled" : "Light mode enabled");
});

// Search all dashboard sections
globalSearch.addEventListener("input", () => {
  const query = globalSearch.value.trim().toLowerCase();
  const sections = document.querySelectorAll(".searchable");
  let matches = 0;

  sections.forEach(section => {
    const found = !query || section.textContent.toLowerCase().includes(query);

    section.classList.toggle("search-hidden", !found);

    if (found) matches++;
  });

  if (query && matches === 0) {
    showToast("No matching content found");
  }
});

// Keyboard shortcut: / focuses search
document.addEventListener("keydown", event => {
  const target = event.target;
  const typing = target.matches("input, textarea, select");

  if (event.key === "/" && !typing) {
    event.preventDefault();
    globalSearch.focus();
  }

  if (event.key === "Escape") {
    globalSearch.value = "";
    globalSearch.dispatchEvent(new Event("input"));
    globalSearch.blur();
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Assignment counter
const taskList = document.querySelector(".assignment-list");
const pendingCount = document.getElementById("pendingCount");
const taskCount = document.getElementById("taskCount");

function updateTaskCount() {
  const tasks = [...document.querySelectorAll(".task-check")];
  const pending = tasks.filter(task => !task.checked).length;

  pendingCount.innerHTML = `${String(pending).padStart(2, "0")} <small>Tasks</small>`;
  taskCount.textContent = `${pending} pending`;
}

taskList.addEventListener("change", event => {
  if (event.target.classList.contains("task-check")) {
    updateTaskCount();

    showToast(
      event.target.checked
        ? "Great job! Task completed 🎉"
        : "Task marked as pending"
    );
  }
});

// Add an assignment
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const taskName = prompt("Enter your assignment name:");

  if (!taskName || !taskName.trim()) return;

  const label = document.createElement("label");
  label.className = "assignment-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";

  const customCheck = document.createElement("span");
  customCheck.className = "custom-check";

  const details = document.createElement("span");
  details.className = "assignment-details";

  const title = document.createElement("strong");
  title.textContent = taskName.trim();

  const description = document.createElement("small");
  description.textContent = "Personal assignment";

  const dueDate = document.createElement("span");
  dueDate.className = "due-date";
  dueDate.textContent = " Added just now";

  details.append(title, description, dueDate);

  const priority = document.createElement("span");
  priority.className = "priority low";
  priority.textContent = "New";

  label.append(checkbox, customCheck, details, priority);
  taskList.appendChild(label);

  updateTaskCount();
  showToast("Assignment added successfully!");
});

// Notifications demo
document.getElementById("notificationToggle").addEventListener("click", () => {
  showToast("You're all caught up! 🎉");
});

// Demo community action
document.getElementById("communityBtn").addEventListener("click", event => {
  event.preventDefault();
  showToast("Student community module coming soon!");
});

// Initial counter update
updateTaskCount();

/* ==========================================
   CAMPUSCONNECT PHASE 2 + PHASE 3
   Frontend demonstration only
========================================== */

(() => {
  const authScreen = document.getElementById("authScreen");
  const authForm = document.getElementById("authForm");
  const authMessage = document.getElementById("authMessage");
  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");
  const authSubmit = document.getElementById("authSubmit");
  const registerFields = document.getElementById("registerFields");
  const registerOnly = document.querySelector(".register-only");

  const profileForm = document.getElementById("profileForm");
  const profileMessage = document.getElementById("profileMessage");

  const STORAGE_KEY = "campusconnect_demo_profiles";
  const SESSION_KEY = "campusconnect_demo_session";

  let authMode = "login";

  // Read demo profiles safely.
  function readProfiles() {
    try {
      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      return profiles && typeof profiles === "object" &&
        !Array.isArray(profiles) ? profiles : {};
    } catch {
      return {};
    }
  }

  function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  // Switch between login and registration.
  function setAuthMode(mode) {
    authMode = mode;

    document.querySelectorAll("[data-auth-mode]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.authMode === mode
      );
    });

    const registering = mode === "register";

    registerFields.hidden = !registering;
    registerOnly.hidden = !registering;

    document.getElementById("registerName").required = registering;
    document.getElementById("registerCollege").required = registering;
    document.getElementById("registerBranch").required = registering;
    document.getElementById("registerYear").required = registering;
    document.getElementById("registerSemester").required = registering;

    document.getElementById("authPassword").autocomplete =
      registering ? "new-password" : "current-password";

    authTitle.textContent = registering
      ? "Create your account"
      : "Welcome back!";

    authSubtitle.textContent = registering
      ? "Tell us a little about yourself."
      : "Enter your registered email to continue.";

    authSubmit.innerHTML = registering
      ? 'Create demo account <i class="fa-solid fa-arrow-right"></i>'
      : 'Login to CampusConnect <i class="fa-solid fa-arrow-right"></i>';

    authMessage.textContent = "";
  }

  document.querySelectorAll("[data-auth-mode]").forEach(button => {
    button.addEventListener("click", () => {
      setAuthMode(button.dataset.authMode);
    });
  });

  // Populate all visible student information.
  
function renderProfile(profile) {
  const name = (profile.name || "Student Name").trim();

  const firstName = name.split(/\s+/)[0];

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("") || "ST";

  // Update the profile section
  document.getElementById("profileInitials").textContent = initials;
  document.getElementById("profileDisplayName").textContent = name;
  document.getElementById("profileDisplayBranch").textContent =
    [profile.branch, profile.year, profile.semester]
      .filter(Boolean)
      .join(" · ");

  // Update profile form
  document.getElementById("profileName").value = name;
  document.getElementById("profileEmail").value = profile.email || "";
  document.getElementById("profileCollege").value = profile.college || "";
  document.getElementById("profileBranch").value = profile.branch || "CSE";
  document.getElementById("profileYear").value = profile.year || "1st Year";
  document.getElementById("profileSemester").value =
    profile.semester || "Semester 1";

  // Update top-right profile
  document.querySelectorAll(".top-profile .profile-info strong")
    .forEach(element => {
      element.textContent = name;
    });

  document.querySelectorAll(".top-profile .avatar")
    .forEach(element => {
      element.textContent = initials;
    });

  // Update dashboard welcome message
  const greeting = document.querySelector(".welcome-banner h1");

  if (greeting) {
    greeting.textContent = `Hey, ${firstName}! 👋`;
  }
}


  // Show the dashboard after a demo session begins.
  
function enterDashboard(profile) {
  document.body.classList.remove("auth-active");
  authScreen.hidden = true;
  renderProfile(profile);
}

function showLogin() {
  document.body.classList.add("auth-active");
  authScreen.hidden = false;
  setAuthMode("login");
}


  // Register or log in.
  authForm.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("authEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("authPassword").value;

    if (password.length < 6) {
      authMessage.textContent = "Use at least 6 characters for the demo.";
      return;
    }

    try {
      const profiles = readProfiles();

      if (authMode === "register") {
        const name = document.getElementById("registerName")
          .value.trim();

        if (!name) {
          authMessage.textContent = "Please enter your name.";
          return;
        }

        if (profiles[email]) {
          authMessage.textContent =
            "This email already has a demo profile. Please log in.";
          return;
        }

        const profile = {
          name,
          email,
          college: document.getElementById("registerCollege")
            .value.trim(),
          branch: document.getElementById("registerBranch").value,
          year: document.getElementById("registerYear").value,
          semester: document.getElementById("registerSemester").value
        };

        profiles[email] = profile;
        saveProfiles(profiles);

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        enterDashboard(profile);
        showToast("Welcome to CampusConnect, " + name + "!");
        return;
      }

      const profile = profiles[email];

      if (!profile) {
        authMessage.textContent =
          "No demo profile found. Please create an account first.";
        return;
      }

      // Demo only: the password is NOT verified or stored.
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      enterDashboard(profile);
      showToast("Welcome back, " + profile.name + "!");
    } catch {
      authMessage.textContent =
        "Browser storage is unavailable. Please enable site storage.";
    }
  });

  // Save profile edits.
  profileForm.addEventListener("submit", event => {
    event.preventDefault();

    const session = readSession();

    if (!session || !session.email) {
      profileMessage.textContent = "Please log in again.";
      return;
    }

    try {
      const profiles = readProfiles();

      const updatedProfile = {
        name: document.getElementById("profileName").value.trim(),
        email: session.email,
        college: document.getElementById("profileCollege").value.trim(),
        branch: document.getElementById("profileBranch").value,
        year: document.getElementById("profileYear").value,
        semester: document.getElementById("profileSemester").value
      };

      if (!updatedProfile.name) {
        profileMessage.textContent = "Please enter your full name.";
        return;
      }

      profiles[session.email] = updatedProfile;
      saveProfiles(profiles);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedProfile));

      renderProfile(updatedProfile);
      profileMessage.textContent = "Profile updated successfully!";
      showToast("Your profile has been updated.");
    } catch {
      profileMessage.textContent = "Could not save changes in browser storage.";
    }
  });

  // Log out of the current demo session.
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
    showToast("You have logged out.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Restore the demo session after a page refresh.
  
/* Restore the latest saved student profile */
const existingSession = readSession();

if (existingSession && existingSession.email) {
  const profiles = readProfiles();


  // Get the latest profile, not an outdated session copy.
  const latestProfile =
    profiles[existingSession.email] || existingSession;

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(latestProfile)
  );

  enterDashboard(latestProfile);
} else {
  showLogin();
}

  /* ==========================================
     STUDY MATERIAL SEARCH AND FILTERS
  ========================================== */

  const resourceSearch = document.getElementById("resourceSearch");
  const semesterFilter = document.getElementById("semesterFilter");
  const typeFilter = document.getElementById("typeFilter");
  const resourceCount = document.getElementById("resourceCount");
  const noResources = document.getElementById("noResources");
  const resourceGrid = document.getElementById("resourceGrid");

  const resourceCards = [
    ...document.querySelectorAll(".resource-tile")
  ];

  function filterResources() {
    const query = resourceSearch.value.trim().toLowerCase();
    const semester = semesterFilter.value;
    const type = typeFilter.value;

    let visible = 0;

    resourceCards.forEach(card => {
      const matchesText =
        card.dataset.search.toLowerCase().includes(query) ||
        card.textContent.toLowerCase().includes(query);

      const matchesSemester =
        semester === "all" || card.dataset.semester === semester;

      const matchesType =
        type === "all" || card.dataset.type === type;

      const show = matchesText && matchesSemester && matchesType;

      card.hidden = !show;

      if (show) visible++;
    });

    resourceCount.textContent =
      `${visible} resource${visible === 1 ? "" : "s"} found`;

    noResources.hidden = visible !== 0;
    resourceGrid.hidden = visible === 0;
  }

  resourceSearch.addEventListener("input", filterResources);
  semesterFilter.addEventListener("change", filterResources);
  typeFilter.addEventListener("change", filterResources);

  document.getElementById("clearFilters").addEventListener("click", () => {
    resourceSearch.value = "";
    semesterFilter.value = "all";
    typeFilter.value = "all";
    filterResources();
  });

  // Resource details preview.
  const resourceDetails = {
    "Data Structures & Algorithms":
      "Study arrays, linked lists, stacks, queues, trees and graph algorithms.",
    "Database Management Systems":
      "Revise SQL queries, normalization, transactions and relational databases.",
    "Java Programming":
      "Practice object-oriented programming, classes, inheritance and exceptions.",
    "Python Programming":
      "Review Python syntax, loops, functions, collections and coding exercises.",
    "Web Development":
      "Learn HTML structure, CSS layouts, JavaScript and responsive design.",
    "Operating Systems":
      "Study processes, CPU scheduling, memory management and file systems."
  };

  const resourceViewer = document.getElementById("resourceViewer");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerDescription = document.getElementById("viewerDescription");
  const viewerLink = document.getElementById("viewerLink");

  document.querySelectorAll("[data-resource]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      const name = link.dataset.resource;

      viewerTitle.textContent = name;
      viewerDescription.textContent =
        resourceDetails[name] || "Study resource details.";

      // Preview only until a real resource URL is configured.
      viewerLink.href = "#study";
      viewerLink.onclick = clickEvent => {
        clickEvent.preventDefault();
        showToast("Add a real PDF or resource URL to open this material.");
      };

      resourceViewer.hidden = false;
      resourceViewer.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  });

  document.getElementById("closeResource").addEventListener("click", () => {
    resourceViewer.hidden = true;
  });

  filterResources();
})();

/* FIX: Always load the actual student's name */

function updateStudentGreeting() {
  const greeting = document.getElementById("welcomeGreeting");

  if (!greeting) return;

  try {
    const session = JSON.parse(
      sessionStorage.getItem("campusconnect_demo_session") || "null"
    );

    if (session && session.name && session.name.trim()) {
      const firstName = session.name.trim().split(/\s+/)[0];
      greeting.textContent = `Hey, ${firstName}! 👋`;
    } else {
      greeting.textContent = "Hey, Student! 👋";
    }
  } catch (error) {
    console.error("Could not load student information:", error);
  }
}

// Update when the page loads.
updateStudentGreeting();

// Update after login, registration, or profile changes.
document.getElementById("authForm")?.addEventListener(
  "submit",
  updateStudentGreeting
);

document.getElementById("profileForm")?.addEventListener(
  "submit",
  updateStudentGreeting
);

