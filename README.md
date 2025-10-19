# Proverb Every Day
Similar set up as A to Z devotional. Allows user to click or tap a number to show the corresponding Proverb.<br>
9/18/25 - First commit.  Setting up basic functionality. Next step is adding access to Free Use Bible API so the proverbs will load on demand instead of hard coded into a json file.<br>
9/20/25 - Adding logic to pull proverb data from Free Use Bible API.  Using console.log to test api calls.<br>
9/26/25 - Used ChatGPT to figure out how to pull specific Proverb after user selects the number.  Next step is to parse the json so the text is formatted correctly.<br>
9/28/25 - Cleaning up logic to parse the json file correctly and display the contents to the screen. Headings appear correctly, next to work on the verses to appear correctly without throwing errors.<br>
9/29/25 - Verses now appear correctly. Items called noteIds are showing up as undefined. Next step to filter those out so text does not show undefined.<br>
10/1/25 - NoteIds have been filtered out. Most verses appear correctly.  4 Proverbs show blank lines instead of text on some verse. Next step to check logic to get all verses to appear correctly.<br>
10/4/25 - Added extractTexts function to get all verses to appear correctly.  The verses that were not appearing correctly are single line arrays that were get filtered out, so they were showing as empty strings. Next step is to add buttons for the user to select proverb of the day or random popular verses.<br>
10/5/25 - Added button for Proverb of the Day which shows the proverb that corresponds to the date.  Next step is to create button for random popular verse. I will create a json file that has specific proverbs and the button click will randomize which proverb gets pulled from the json file.<br>
10/8/25 - Added popularProverbs.js file to store popular Proverbs and importing into script.js file.  Next step to add more verses to popularProverbs and create a button to randomly choose from the array.<br>
10/12/25 - Added button for Random Popular Proverbs. The button click pulls from the popularProverbs array and display the proverb to the screen.<br>
10/13/25 - Added buttons to bottom of the screen after user selection so that the user can choose to start over, another random proverb, or the proverb of the day. Next step to add functionality to the buttons.<br>
10/14/25 - Adjusted css for mobile so buttons look better.  Stacked them on mobile instead of side-by-side beacuse they looked squashed.<br>
10/18/25 - Added functionality to bottom buttons.  UI on iPhone with Chrome is partially hidden by toolbar.  Next step to get UI to look right on mobile.<br>