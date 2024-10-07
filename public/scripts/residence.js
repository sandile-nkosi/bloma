// popUpCode
document.getElementById("submitBtn").onclick = function() {
  document.getElementById("confirmModal").style.display = "block";
};

document.getElementById("confirmBtn").onclick = function() {
  document.getElementById("successModal").style.display = "block";
  document.getElementById("confirmModal").style.display = "block";
};

var closeButtons = document.getElementsByClassName("close");
for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].onclick = function() {
    const modal = this.closest('.modal');
    if (modal.id === "successModal") {
      document.getElementById("confirmModal").style.display = "none";
    }
    modal.style.display = "none";
  };
}

window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    if (event.target.id === "successModal") {
      document.getElementById("confirmModal").style.display = "none";
    }
  }
};
