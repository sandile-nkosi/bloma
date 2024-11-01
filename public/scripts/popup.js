document.querySelector(".edit").onclick = function() {
    document.getElementById("confirmModal").style.display = "block";
  };
  
  document.getElementById("confirmBtn").onclick = function() {
    document.getElementById("successModal").style.display = "block";
    document.getElementById("confirmModal").style.display = "block";
  };
  
  
  var closeButtons = document.getElementsByClassName("successclose");
  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function() {
      const modal = this.closest('.modals');
      if (modal.id === "successModal") {
        document.getElementById("confirmModal").style.display = "none";
      }
      modal.style.display = "none";
    };
  }
  
  window.onclick = function(event) {
    if (event.target.classList.contains("modals")) {
      event.target.style.display = "none";
      if (event.target.id === "successModal") {
        document.getElementById("confirmModal").style.display = "none";
      }
    }
  };



  // removes the modal in the background......
// document.getElementById("submitBtn").onclick = function() {
//   const modal = document.getElementById("confirmModal");
//   modal.classList.add("show"); // Add the class to show modal
// };

// document.getElementById("confirmBtn").onclick = function() {
//   const successModal = document.getElementById("successModal");
//   successModal.classList.add("show"); // Show success modal
//   document.getElementById("confirmModal").classList.remove("show"); // Hide confirm modal
// };

// Adjust close functionality
// var closeButtons = document.getElementsByClassName("close");
// for (var i = 0; i < closeButtons.length; i++) {
//   closeButtons[i].onclick = function() {
//       const modal = this.closest('.modal');
//       modal.classList.remove("show"); // Remove the class to hide modal
//   };
// }


// edit button for mobile view. 

document.querySelector(".edit-mobile").onclick = function() {
  document.getElementById("confirmModal").style.display = "block";
};

document.getElementById("confirmBtn").onclick = function() {
  document.getElementById("successModal").style.display = "block";
  document.getElementById("confirmModal").style.display = "block";
};


var closeButtons = document.getElementsByClassName("successclose");
for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].onclick = function() {
    const modal = this.closest('.modals');
    if (modal.id === "successModal") {
      document.getElementById("confirmModal").style.display = "none";
    }
    modal.style.display = "none";
  };
}

window.onclick = function(event) {
  if (event.target.classList.contains("modals")) {
    event.target.style.display = "none";
    if (event.target.id === "successModal") {
      document.getElementById("confirmModal").style.display = "none";
    }
  }
};