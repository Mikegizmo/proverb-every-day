const proverbs = {
  1: {
    text: "The Beginning of Knowledge (Proverbs 9:1-12)",
  }
}

const apiUrl = "https://bible.helloao.org/api/BSB/PRO";

fetch(`${apiUrl}/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Proverbs 1(BSB):', chapter.chapter);
    });