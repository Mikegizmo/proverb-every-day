const clockwiseOrder = [
  "1","2","3","4","5","6","7",     // top
  "8","9","9","10","11","12","13","14","15", // right
  "16","17","18","19","20","21","22","23",     // bottom
  "24","25","26","27","27","28","29","30","31"  // left
];

const numbers = document.querySelectorAll(".number");
const panel = document.getElementById("panel");

// helper to find letter by text
function getNumberButton(number) {
  return Array.from(numbers).find(l => l.textContent === number);
}

function showProverb(number) {
  const data = proverbs[number];
  console.log(data);
  if (data) {
    panel.innerHTML = `
      <h1>Proverbs ${number}</h1>
      <h3>${data.text}</h3>
    `;
  } else {
    panel.innerHTML = `<p>Click a number to see the corresponding Proverb.</p>`;
  }
}

// click events
numbers.forEach(number => {
  number.addEventListener("click", () => {
    numbers.forEach(l => l.removeAttribute("aria-current"));
    number.setAttribute("aria-current", "true");
    showProverb(number.textContent);
  });
});

// keyboard navigation
document.addEventListener("keydown", e => {
  const current = document.querySelector(".number[aria-current='true']");
  const currentNumber = current ? current.textContent : null;
  let index = clockwiseOrder.indexOf(currentNumber);

  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    index = (index + 1) % clockwiseOrder.length;
    getNumberButton(clockwiseOrder[index]).click();
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    index = (index - 1 + clockwiseOrder.length) % clockwiseOrder.length;
    getNumberButton(clockwiseOrder[index]).click();
  }

  const letter = e.key.toUpperCase();
  if (proverbs[letter]) {
    const target = getNumberButton(letter);
    if (target) target.click();
  }
});

// load instructions first
panel.innerHTML = `<h1>Proverb Every Day</h1>
        <p>Click or tap a number to reveal the corresponding Proverb. Use arrow keys to move clockwise or counter-clockwise around the letters. Screen readers will announce the
        active content.</p>`;
