const proverbs = {
  1: {
    text: "The Beginning of Knowledge (Proverbs 9:1-12)",
  }
}

const apiUrl = "https://bible.helloao.org/api/BSB/PRO";

fetch(`${apiUrl}/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Proverbs 1(BSB)', chapter.chapter.content);
        console.log(chapter.chapter.content.length);
        console.log(chapter.chapter.content[1].type === 'verse');

        // console.log(chapter.chapter.content[1].content[0].text);
        // console.log(chapter.chapter.content[1].content[1].text);
        // console.log(chapter.chapter.content[2].content[0].text);

        for(i=0; i<chapter.chapter.content.length; i++) {
          if (chapter.chapter.content[i].type === 'heading') {
            console.log(chapter.chapter.content[i].content[0]);
            console.log(chapter.chapter.content[i].type);
            // if(chapter.chapter.content[i].type !== 'line_break'){
            //   console.log(chapter.chapter.content[i].content.length);
            // }
            // console.log(chapter.chapter.content[i].type);
            // console.log(`<sup>${chapter.chapter.content[i].number}</sup>`);
            // if(chapter.chapter.content[i].type === 'verse') {
            //   for(j=0; j<chapter.chapter.content[i].content.length; j++) {
            //     console.log(chapter.chapter.content[i].content[j].text);
            //   }
            // }
          }
          
        }
    });