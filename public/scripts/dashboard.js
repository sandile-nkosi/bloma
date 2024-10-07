const emailEditElement = document.getElementById('email-edit');
const phoneEditElement = document.getElementById('phone-edit');
const emailPara = document.getElementById('email-para');
const phonePara = document.getElementById('phone-para');

const detailsEditEmail = document.getElementById('details-edit-para');


function editEmail(){
  emailPara.style.display = 'none';
  detailsEditEmail.removeAttribute('hidden');
};

emailEditElement.addEventListener('click', editEmail);


