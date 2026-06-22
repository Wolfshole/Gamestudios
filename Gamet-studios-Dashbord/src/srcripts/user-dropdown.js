document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("user-button");
  const menu = document.getElementById("user-menu");

  if (!button || !menu) {
    console.warn("UserDropdown Elemente nicht gefunden");
    return;
  }

  // Klick auf Button
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });

  // Klick außerhalb schließen
  document.addEventListener("click", (e) => {
    if (!button.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

  // Logout Funktion
  window.handleLogout = function () {
    if (confirm("Wirklich abmelden?")) {
      document.cookie =
        "discord_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
  };
});
