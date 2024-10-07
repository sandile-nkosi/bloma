// filtering

const maleElement = document.getElementById('male');
const femaleElement = document.getElementById('female');

const undergraduateElement = document.getElementById('undergraduate');
const postgraduateElement = document.getElementById('postgraduate');

const allOptions = document.getElementById('allOptions');
const maleOption = document.getElementById('maleOption');
const femaleOption = document.getElementById('femaleOption');

const undergraduateOption = document.getElementById('undergraduateOption');
const postgraduateOption = document.getElementById('postgraduateOption');


maleElement.addEventListener('change', function() {
  if (this.checked) {
    allOptions.style.display = 'none';
    maleOption.style.display = 'flex';
  }else {
    allOptions.style.display = 'flex';
    maleOption.style.display = "none";
  }
});

femaleElement.addEventListener('change', function() {
  if (this.checked) {
    allOptions.style.display = 'none';
    femaleOption.style.display = 'flex';
  }else {
    allOptions.style.display = 'flex';
    femaleOption.style.display = "none";
  }
});

undergraduateElement.addEventListener('change', function() {
  if (this.checked) {
    allOptions.style.display = 'none';
    undergraduateOption.style.display = 'flex';
  }else {
    allOptions.style.display = 'flex';
    undergraduateOption.style.display = "none";
  }
});

postgraduateElement.addEventListener('change', function() {
  if (this.checked) {
    allOptions.style.display = 'none';
    postgraduateOption.style.display = 'flex';
  }else {
    allOptions.style.display = 'flex';
    postgraduateOption.style.display = "none";
  }
});
