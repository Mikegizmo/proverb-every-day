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

  // const letter = e.key.toUpperCase();
  // if (proverbs[letter]) {
  //   const target = getNumberButton(letter);
  //   if (target) target.click();
  // }
});

function renderProverb(data) {
  const proverbNumber = data.chapter.number;
  console.log(proverbNumber);
  panel.innerHTML = `<h1>Proverb ${proverbNumber}</h1>`;

  const proverbContent = data.chapter.content;
  console.log(proverbContent);

  proverbContent.forEach(item => {
    if (item.type === "heading") {
      const h2 = document.createElement("h2");
      h2.textContent = item.content[0];
      panel.appendChild(h2);
    } 
    else if (item.type === "verse") {
      const p = document.createElement("p");
      const verseText = item.content
        .filter(c => c.text)
        .map(c => c.text + "<br>").join(" ");

      p.innerHTML = `<sup><strong>${item.number}</strong></sup> ` + verseText;
      panel.appendChild(p);
    } 
    else if (item.type === "lineBreak") {
      panel.appendChild(document.createElement("br"));
    }
  });
}

// const apiUrl = "https://bible.helloao.org/api/BSB/PRO";

// fetch(`${apiUrl}/1.json`)
//     .then(request => request.json())
//     .then(chapter => {
//         console.log('Proverbs 1(BSB)', chapter.chapter.content);
//         console.log(chapter.chapter.content.length);
//         console.log(chapter.chapter.content[1].type === 'verse');

//         // console.log(chapter.chapter.content[1].content[0].text);
//         // console.log(chapter.chapter.content[1].content[1].text);
//         // console.log(chapter.chapter.content[2].content[0].text);

//         for(i=0; i<chapter.chapter.content.length; i++) {
//           if (chapter.chapter.content[i].type === 'heading') {
//             console.log(chapter.chapter.content[i].content[0]);

//             let heading = chapter.chapter.content[i].content[0];
//             panel.innerHTML = `${heading}`;
//             console.log(chapter.chapter.content[i].type);
//             // if(chapter.chapter.content[i].type !== 'line_break'){
//             //   console.log(chapter.chapter.content[i].content.length);
//             // }
//             // console.log(chapter.chapter.content[i].type);
//             // console.log(`<sup>${chapter.chapter.content[i].number}</sup>`);
//             // if(chapter.chapter.content[i].type === 'verse') {
//             //   for(j=0; j<chapter.chapter.content[i].content.length; j++) {
//             //     console.log(chapter.chapter.content[i].content[j].text);
//             //   }
//             // }
//           }
          
//         }
//     });

// load instructions first
// panel.innerHTML = `<h1>Proverb Every Day</h1>
//         <p>Click or tap a number to reveal the corresponding Proverb. Use arrow keys to move clockwise or counter-clockwise around the letters. Screen readers will announce the
//         active content.</p>`;
// const heading = "chapter.chapter.content[0].content[0]";
// panel.innerHTML = `Proverbs 1(BSB): 
//           ${heading[0]}
//           `
