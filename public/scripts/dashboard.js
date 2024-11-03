const editBtnElement = document.getElementById('edit');
const emailInputElement = document.getElementById('email-input');
const phoneInputElement = document.getElementById('phone-input');
const noDocsHeader = document.getElementById('no-documents');
const uploadElement = document.getElementById('upload-file');

const emailPara = document.getElementById('email-para');
const phonePara = document.getElementById('phone-para');

function allowEdit(){
  emailInputElement.removeAttribute('hidden');
  emailPara.style.display = 'none';
  phoneInputElement.removeAttribute('hidden');
  phonePara.style.display = 'none';
  noDocsHeader.style.display = 'none';
  uploadElement.removeAttribute('hidden');
}







editBtnElement.addEventListener('click', allowEdit);




