var dataArray = [
  `You have done well Sora. However, can you find my next hint in the house of your friends?`,
  `It seems these aren't hidden as well as I thought. However, sand might cover your next hint.`,
  `You are proving quite troublesome. However, the next will be in a place where you feel deja vu.`,
  `Nobody's have helped you thus far. However, you must become a Nobody to find the next hint.`,
  `Roxas did well reminding you where this was. However, familiar faces are hiding your next hint.`,
  `Leon might have caved, but this next world will have you solving digital problems before you find the next clue.`,
  `You might be thinking you are a hero finding all of these hints. However, only a true hero knows where to look for the next hint.`,
  `It turns out Hades dropped this. Let's see you brave this spooky world to find the next one.`,
  `If Halloween didn't scare you, then sailing for this answer might.`,
  `Jack might be unpredictable, but this next clue will only be found in a world forgotten by those in it.`,
  `This next hint will be found in a world where you help someone become what they are suppose to be.`,
  `This next world will have you understand just what it means to be true to yourself.`,
  `Your final piece of the puzzle lays with finding yourself. Good Luck.`,
];

function reveal(id) {
    if(dataArray.length === 0) {
        document.getElementById('report-' + id).innerHTML = "Please select a seed to generate hints.";
    }
    else {
        var text = document.getElementById('report-' + id);
        text.innerHTML = dataArray[id - 1];
        document.getElementById(id).style.backgroundColor = "green";
    }
}
