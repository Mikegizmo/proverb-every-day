const clockwiseOrder = [
  "1","2","3","4","5","6","7",     // top
  "8","9","9","10","11","12","13","14","15", // right
  "16","17","18","19","20","21","22","23",     // bottom
  "24","25","26","27","27","28","29","30","31"  // left
];

const numbers = document.querySelectorAll(".number");
const panel = document.getElementById("panel");

// helper to find number by text
function getNumberButton(number) {
  return Array.from(numbers).find(l => l.textContent === number);
}

// click events
numbers.forEach(number => {
  number.addEventListener("click", async () => {
    numbers.forEach(l => l.removeAttribute("aria-current"));
    number.setAttribute("aria-current", "true");
    const num = number.innerHTML;
    console.log(num);
    panel.innerHTML = "<p>Loading...</p>";
    
     try {
      const res = await fetch(`https://bible.helloao.org/api/BSB/PRO/${num}.json`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      console.log(data);
      console.log(data.chapter.number);

      renderProverb(data);
    } catch (err) {
      panel.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
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
});

function extractTexts(node) {
  if (node == null) return [];            // null/undefined
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(extractTexts);

  // node is an object
  if (typeof node === 'object') {
    // Prefer explicit text/content properties
    if (typeof node.text === 'string') return [node.text];
    if (typeof node.content === 'string') return [node.content];
    if (Array.isArray(node.content)) return extractTexts(node.content);

    // If object has nested content-like items (rare), attempt to gather them,
    // but DO NOT grab noteId (we intentionally ignore it).
    const collected = [];
    for (const key of Object.keys(node)) {
      if (key === 'noteId') continue;          // skip notes
      const val = node[key];
      if (typeof val === 'string') {
        // avoid grabbing short id-like strings by only grabbing longish text?
        // (optional) here we include it — but normally text/content will cover cases.
        // If you want to be stricter, remove this block.
        collected.push(val);
      } else if (Array.isArray(val) || typeof val === 'object') {
        collected.push(...extractTexts(val));
      }
    }
    return collected;
  }

  return [];
}

function renderProverb(data) {
  const proverbNumber = data.chapter.number;
  console.log(proverbNumber);
  panel.innerHTML = `<h1>Proverbs ${proverbNumber}</h1>`;

  const proverbContent = data.chapter.content;
  console.log(proverbContent);

  proverbContent.forEach(item => {
    if (item.type === "heading") {
      const h2 = document.createElement("h2");
      const headingParts = extractTexts(item.content);
      h2.textContent = headingParts.join(" ") || (Array.isArray(item.content) ? item.content.join(" ") : String(item.content || ""));
      panel.appendChild(h2);
    } 
    else if (item.type === "verse") {
      const p = document.createElement("p");
      // Use extractTexts so single-item content / nested content still yields text
      const verseParts = extractTexts(item.content);
      const verseText = verseParts.join("<br>").trim();
      // Prepend verse number if present
      p.innerHTML = `<sup><strong>${item.number}</strong></sup> ` + verseText;
      panel.appendChild(p);
    } 
    else if (item.type === "lineBreak") {
      panel.appendChild(document.createElement("br"));
    }
  });
}

const today = new Date();
const day = today.getDate();
console.log(day);

const proverbDay = document.getElementById("proverbDay");
proverbDay.addEventListener("click", async () => {
  try {
    const res = await fetch(`https://bible.helloao.org/api/BSB/PRO/${day}.json`);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    console.log(data);
    console.log(data.chapter);

    renderProverb(data);
  } catch (err) {
    panel.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});

