async function restoreDefaultMenu() {
  if (!confirm("This will remove all current menu items and restore the default menu. Continue?")) return;

  try {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const res = await fetch(`${API_BASE}/menu/reset-default`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to reset menu");
    }

    alert("Menu has been restored to default.");
    if (typeof loadMenuFromDatabase === "function") loadMenuFromDatabase();
  } catch (err) {
    console.error(err);
    alert("Error restoring default menu: " + err.message);
  }
}
window.restoreDefaultMenu = async function restoreDefaultMenu () {
  if (!confirm(
        "This will remove ALL current menu items and restore the default set.\nContinue?"
      )) return;

  try {
    const session = JSON.parse(localStorage.getItem("session") || "{}");

    const res = await fetch(`${API_BASE}/menu/reset-default`, {
      method : "POST",
      headers: {
        "Content-Type" : "application/json",
        Authorization  : `Bearer ${session.token || ""}`
      }
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Failed to reset menu");
    }

    alert("Menu has been restored to the default list.");
    if (typeof loadMenuFromDatabase === "function") loadMenuFromDatabase();

  } catch (err) {
    console.error(err);
    alert("Error restoring default menu: " + err.message);
  }
};