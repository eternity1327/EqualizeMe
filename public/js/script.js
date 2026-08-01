// Used on test.html - sends the chosen preference to the backend
async function choose(sound) {
  const result = document.getElementById("result");
  result.innerHTML = "Saving...";

  try {
    const res = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sound })
    });

    const data = await res.json();

    if (!res.ok) {
      result.innerHTML = `Error: ${data.error}`;
      return;
    }

    const labels = { bass: "Bass", balanced: "Balanced", detail: "Clarity" };
    result.innerHTML = `You prefer: ${labels[sound]}`;
  } catch (err) {
    result.innerHTML = "Something went wrong. Is the server running?";
    console.error(err);
  }
}

// Used on recommendations.html - fetches matching IEMs from the backend
async function loadRecommendations() {
  const grid = document.getElementById("iem-grid");
  if (!grid) return;

  try {
    const res = await fetch("/api/recommendations");
    const data = await res.json();

    grid.innerHTML = data.results.map(item => `
      <div class="iem-card">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p class="price">₱${item.price.toLocaleString()}</p>
      </div>
    `).join("");
  } catch (err) {
    grid.innerHTML = "<p>Could not load recommendations.</p>";
    console.error(err);
  }
}

// Used on profile.html - loads and saves the user's profile
async function loadProfile() {
  const nameEl = document.getElementById("profile-name");
  const soundEl = document.getElementById("profile-sound");
  const genreEl = document.getElementById("profile-genre");
  if (!nameEl) return;

  try {
    const res = await fetch("/api/profile");
    const profile = await res.json();
    nameEl.textContent = profile.name;
    soundEl.textContent = profile.preferredSound;
    genreEl.textContent = profile.favoriteGenre;
  } catch (err) {
    console.error(err);
  }
}

// Used on settings.html - loads and saves checkbox toggles
async function loadSettings() {
  const checkboxes = document.querySelectorAll(".setting-checkbox");
  if (!checkboxes.length) return;

  try {
    const res = await fetch("/api/settings");
    const settings = await res.json();

    checkboxes.forEach(box => {
      const key = box.dataset.key;
      box.checked = !!settings[key];
    });
  } catch (err) {
    console.error(err);
  }
}

async function saveSetting(key, checked) {
  try {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: checked })
    });
  } catch (err) {
    console.error(err);
  }
}

// Run the right loader depending on which page we're on
document.addEventListener("DOMContentLoaded", () => {
  loadRecommendations();
  loadProfile();
  loadSettings();
});
