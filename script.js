// imports
import { popularProverbs } from "./popularProverbs.js";
import { railsWideScreen } from "./uilayout/railsWideScreen.js";
import { railsMobile } from "./uilayout/railsMobile.js";

// constants
const railTop = document.getElementById("rail-top");
const railRight = document.getElementById("rail-right");
const railBottom = document.getElementById("rail-bottom");
const railLeft = document.getElementById("rail-left");

const panel = document.getElementById("panel");
const proverbDay = document.getElementById("proverbDay");
const randomProverb = document.getElementById("randomProverb");

const bottomButtons = document.getElementById("bottomButtons");
const proverbDayBottom = document.getElementById("proverbDayBottom");
const randomProverbBottom = document.getElementById("randomProverbBottom");
const startOver = document.getElementById("startOver");
const userHelper = document.createElement("div");
userHelper.innerHTML = "<p>Click or tap a number to reveal the corresponding Proverb.</p>";

function checkViewportWidth() {
  const viewportWidth = window.innerWidth;
  const screenOrientation = screen.orientation.type;
  console.log(viewportWidth);
  console.log(screenOrientation);
  let railsForUi;

  if (viewportWidth > 1000 && screenOrientation === "landscape-primary") {
    railsForUi = railsWideScreen;
    railTop.innerHTML = railsForUi.railsTopWideScreen;
    railRight.innerHTML = railsForUi.railsRightWideScreen;
    railBottom.innerHTML = railsForUi.railsBottomWideScreen;
    railLeft.innerHTML = railsForUi.railsLeftWideScreen;

    let numbers = document.querySelectorAll(".number");
    buttonClickCheck(numbers);
    
  } else {
    railsForUi = railsMobile;
    railTop.innerHTML = railsForUi.railsTopMobile;
    railRight.innerHTML = railsForUi.railsRightMobile;
    railBottom.innerHTML = railsForUi.railsBottomMobile;
    railLeft.innerHTML = railsForUi.railsLeftMobile;

    let numbers = document.querySelectorAll(".number");
    buttonClickCheck(numbers);
  }
};

checkViewportWidth();

function buttonClickCheck(numbers) {
  numbers.forEach(number => {
    number.addEventListener("click", async () => {
      numbers.forEach(l => l.removeAttribute("aria-current"));
      number.setAttribute("aria-current", "true");
      const num = number.innerHTML;
      
      panel.innerHTML = "<p>Loading...</p>";
      
      try {
        const res = await fetch(`https://bible.helloao.org/api/BSB/PRO/${num}.json`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        
        renderProverb(data);
      } catch (err) {
        panel.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
      }
    });
  });
};

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
  panel.innerHTML = `<h1>Proverbs ${proverbNumber}</h1>`;

  // Add audio player if available
  const audioUrl = data.thisChapterAudioLinks.hays;
  if (audioUrl) {
    const audioContainer = document.createElement("div");
    audioContainer.style.textAlign = "center";
    audioContainer.style.marginTop = "20px";

    const audioPlayer = document.createElement("audio");
    audioPlayer.controls = true;
    audioPlayer.src = audioUrl;
    audioPlayer.style.width = "100%";
    audioPlayer.style.position = "sticky-top";
    audioPlayer.style.maxWidth = "400px";
    audioContainer.appendChild(audioPlayer);

    panel.appendChild(audioContainer);
  };

  const proverbContent = data.chapter.content;
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

  showBottomButtons();
}

async function getDailyProverb() {
  const today = new Date().getDate();

  try {
    const res = await fetch(`https://bible.helloao.org/api/BSB/PRO/${today}.json`);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
  
    renderProverb(data);
  } catch (err) {
    panel.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
};

function getRandomProverb() {
  const random = Math.floor(Math.random() * popularProverbs.length);
  const randomProverb = popularProverbs[random].verse;
  const randomProverbText = popularProverbs[random].text;
  
  panel.innerHTML = `<h1>Proverbs ${randomProverb}</h1> 
                     <p>${randomProverbText}</p>`;

  showBottomButtons();
};

function showBottomButtons() {
  bottomButtons.classList.add("visible");
  panel.appendChild(bottomButtons);
  panel.appendChild(userHelper);
};

// event listeners
proverbDay.addEventListener("click", () => {
  getDailyProverb();
});

randomProverb.addEventListener("click", () => {
  getRandomProverb();
});

proverbDayBottom.addEventListener("click", () => {
  panel.innerHTML = "<p>Loading...</p>";
  getDailyProverb();
});

randomProverbBottom.addEventListener("click", () => {
  getRandomProverb();
});

startOver.addEventListener("click", () => {
  window.location.href = "/index.html";
});

window.addEventListener("resize", checkViewportWidth);