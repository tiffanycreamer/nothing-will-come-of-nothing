(function () {
  const params = new URLSearchParams(window.location.search);
  const successMessage = document.getElementById("successMessage");

  if (params.get("submitted") === "true" && successMessage) {
    successMessage.hidden = false;
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();