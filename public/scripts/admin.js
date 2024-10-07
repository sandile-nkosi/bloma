const acceptedElement = document.getElementById('accepted');
const rejectedElement = document.getElementById('rejected');
const submittedElement = document.getElementById('submitted');

const allOptions = document.getElementById('allOptions');
const acceptedOptions = document.getElementById('acceptedOptions');
const rejectedOptions = document.getElementById('rejectedOptions');
const submittedOptions = document.getElementById('submittedOptions');


acceptedElement.addEventListener('change', function() {
  if (this.checked) {
    acceptedOptions.style.display = "table";
    rejectedOptions.style.display = 'none';
    allOptions.style.display = 'none';
    submittedOptions.style.display = 'none';
  }else {
    allOptions.style.display = 'table';
    acceptedOptions.style.display = "none";
  }
});

rejectedElement.addEventListener('change', function() {
  if (this.checked) {
    acceptedOptions.style.display = "none";
    rejectedOptions.style.display = 'table';
    allOptions.style.display = 'none';
    submittedOptions.style.display = 'none';
  }else {
    allOptions.style.display = 'table';
    rejectedOptions.style.display = "none";
  }
});

submittedElement.addEventListener('change', function() {
  if (this.checked) {
    acceptedOptions.style.display = "none";
    rejectedOptions.style.display = 'none';
    allOptions.style.display = 'none';
    submittedOptions.style.display = 'table';
  }else {
    allOptions.style.display = 'table';
    submittedOptions.style.display = "none";
  }
});



