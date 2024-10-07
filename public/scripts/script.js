document.addEventListener('DOMContentLoaded', function() {

  function initializeCustomSelect(customSelectWrapper) {
    const selectTrigger = customSelectWrapper.querySelector('.custom-select-trigger');
    const selectOptions = customSelectWrapper.querySelector('.custom-select-options');
    const selectArrow = customSelectWrapper.querySelector('.custom-select-arrow');
    const options = selectOptions.querySelectorAll('span');

    if (!selectTrigger || !selectOptions || !selectArrow) {
      console.error('Custom select elements not found');
      return;
    }

    selectTrigger.addEventListener('click', function() {
      selectOptions.classList.toggle('active');
      selectArrow.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
      if (!selectTrigger.contains(e.target) && !selectOptions.contains(e.target)) {
        selectOptions.classList.remove('active');
        selectArrow.classList.remove('active');
      }
    });

    options.forEach(option => {
      option.addEventListener('click', function() {
        selectTrigger.querySelector('span').textContent = this.textContent;
        selectOptions.classList.remove('active');
        selectArrow.classList.remove('active');
      });
    });
  }

  document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
    initializeCustomSelect(wrapper);
  });

  document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('file-upload').click();
  });
  
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

});

function disabilityButton(){
  const disabilityRdbButton = getElementById('yes');
  const disabilityInput = getElementById('disability');
  if(disabilityRdbButton){
    disabilityInput.disabled = false;   
  }
}

