const residenceOneSelectElement = document.getElementById("residenceOneStatus");
const residenceTwoSelectElement = document.getElementById("residenceTwoStatus");
const residenceThreeSelectElement = document.getElementById("residenceThreeStatus");

if(residenceOneSelectElement.value == "Accepted"){
  residenceTwoSelectElement.disabled = true;
  residenceThreeSelectElement.disabled = true;
}else if(residenceTwoSelectElement.value == "Accepted"){
  residenceOneSelectElement.disabled = true;
  residenceThreeSelectElement.disabled = true;
}else if(residenceThreeSelectElement.value == "Accepted"){
  residenceOneSelectElement.disabled = true;
  residenceTwoSelectElement.disabled = true;
};
