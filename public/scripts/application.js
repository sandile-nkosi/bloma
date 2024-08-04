const selectElement = document.getElementById("residences");
const residenceOneElement = document.getElementById("1");
const residenceTwoElement = document.getElementById("2");
const residenceThreeElement = document.getElementById("3");

selectElement.addEventListener("change", () => {
  if (selectElement.value === "1") {
    residenceOneElement.classList.remove("hidden");
    residenceTwoElement.classList.add("hidden");
    residenceThreeElement.classList.add("hidden");
  } else if (selectElement.value === "2") {
    residenceOneElement.classList.add("hidden");
    residenceTwoElement.classList.remove("hidden");
    residenceThreeElement.classList.add("hidden");
  } else if (selectElement.value === "3") {
    residenceOneElement.classList.add("hidden");
    residenceTwoElement.classList.add("hidden");
    residenceThreeElement.classList.remove("hidden");
  }
});
