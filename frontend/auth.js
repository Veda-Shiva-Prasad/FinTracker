// Dynamic API base URL for both development and production
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api";

// Register function
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Login function
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Register form handler
if (document.getElementById("register-form")) {
  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const messageEl = document.getElementById("register-message");

      try {
        messageEl.innerHTML =
          '<div class="import-info">Creating account...</div>';

        const result = await registerUser({ name, email, password });

        // Save token and user data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        messageEl.innerHTML =
          '<div class="import-success">Account created successfully! Redirecting...</div>';

        // Redirect to main app
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        console.error("Registration frontend error:", error);
        messageEl.innerHTML = `<div class="import-error">Error: ${error.message}</div>`;
      }
    });
}

// Login form handler
if (document.getElementById("login-form")) {
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const messageEl = document.getElementById("login-message");

      try {
        messageEl.innerHTML = '<div class="import-info">Signing in...</div>';

        const result = await loginUser({ email, password });

        // Save token and user data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        messageEl.innerHTML =
          '<div class="import-success">Login successful! Redirecting...</div>';

        // Redirect to main app
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        console.error("Login frontend error:", error);
        messageEl.innerHTML = `<div class="import-error">Error: ${error.message}</div>`;
      }
    });
}

// Check if user is already logged in
if (
  window.location.pathname.includes("login.html") ||
  window.location.pathname.includes("register.html")
) {
  const token = localStorage.getItem("authToken");
  if (token) {
    window.location.href = "index.html";
  }
}
