const bingo_footer = '/assets/bingo-assets/bingo-footer.svg';
const bingo_letters_bgs = '/assets/bingo-assets/bingo-letters-bgs.svg';
const bingo_letters_printer_friendly = '/assets/bingo-assets/bingo-letters-printer-friendly.svg';
const bingo_letters = '/assets/bingo-assets/bingo-letters.svg';
const bingo_title = '/assets/bingo-assets/bingo-title.svg';

const bingoText = [
  "AI increases efficiency & productivity",
  "This is not deskilling, it's upskilling",
  "It frees time for more valuable work",
  "AI is here to stay",
  "It's early tech, but will get better soon",
  "AI is already helping me in my job",
  "You must align with company values",
  "We need to adapt and learn to use AI",
  "Everyone else is using AI, we can't fall behind",
  "There are ways to use AI ethically",
  "Are you some sort of Luddite?",
  "It's workers' job to review bad AI output",
  "If you don't learn AI, you won't grow your career",
  "AI is what we need to excite investors",
  "Funders/the board are asking us to use it",
  "You're just not using it right",
  "This is the wave of the future",
  "Customers are clamoring for it!",
  "AI is a tool, not a replacement",
  "AI does the grunt work, so you can be creative!",
  "You used an early version, it's much better now!",
  "You're not being mentally curious",
  "We'll ensure data safety and privacy",
  "We're not paid to worry about social harms",
  "It's a fad, play along and let it blow over"
]

const extraPhrases = [
    "AI will create new jobs we can't imagine yet",
    "AI can help with diversity and inclusion",
    "AI can help reduce bias",
    "AI can handle repetitive tasks",
    "We need to embrace AI to stay competitive",
    "AI can help with accessibility",
    "AI can help with sustainability",
    "AI can help with mental health",
    "AI can help with work-life balance",
    "AI can help with creativity",
    "AI can help with innovation",
    "AI reduces personal bias in decision making"
]

const bingoSize = 5;
let bingoGrid = [];
let selected = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Bingo Card Generator UI and Logic

document.addEventListener('DOMContentLoaded', function() {
  // Main render function
  function renderBingoCards() {
    // Get options
    const style = document.querySelector('input[name="cardStyle"]:checked').value;
    const useLessInk = style === 'useLessInk';
    const blackWhite = style === 'blackWhite';
    const fullColor = style === 'fullColor';

    // Set the main container class for style switching
    var main = document.getElementById('bingo-main');
    var showBgCheckbox = document.getElementById('showBackground');
    var showBg = showBgCheckbox.checked;
    // If useLessInk is selected, auto-deselect showBg ONCE, but allow user to re-check it
    if (useLessInk && showBg && !showBgCheckbox._autoDeselected) {
      showBgCheckbox.checked = false;
      showBgCheckbox._autoDeselected = true;
      showBg = false;
    } else if (!useLessInk) {
      if (showBgCheckbox._autoDeselected) {
        showBgCheckbox.checked = true;
      }
      showBgCheckbox._autoDeselected = false;
    }
    showBg = showBgCheckbox.checked;
    if (main) {
      main.className = style + (showBg ? '' : ' hide-bg');
    }

    // Fill in the bingo grid
    const table = document.querySelector('.bingo-grid tbody');
    if (!table) return;
    table.innerHTML = '';
    // Shuffle bingoText for the card
    const phrases = [...bingoText];
    for (let i = phrases.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
    }
    let phraseIdx = 0;
    for (let r = 0; r < bingoSize; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < bingoSize; c++) {
        const td = document.createElement('td');
        td.className = 'bingo-square';
        if (r === 2 && c === 2) {
          const img = document.createElement('img');
          img.src = '/assets/hammer-logo.png';
          img.alt = 'Hammer Logo';
          img.className = 'center-img';
          td.appendChild(img);
        } else {
          td.textContent = phrases[phraseIdx++];
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  // Update card automatically when options change
  document.getElementById('bingo-options-form').addEventListener('input', function(e) {
    if (e.target.id !== 'printBingo' && e.target.id !== 'numCards') {
      renderBingoCards();
    }
  });

  document.getElementById('printBingo').addEventListener('click', function() {
    var style = document.querySelector('input[name="cardStyle"]:checked').value;
    var numCards = Math.max(1, Math.min(40, parseInt(document.getElementById('numCards').value) || 1));
    var main = document.getElementById('bingo-main');
    if (main) main.className = style;

    // Prepare print window
    var printWindow = window.open('', '_blank');
    // Add bingo-print-mode class to body and link to bingo.css
    var printCssLink = '<link rel="stylesheet" href="/css/bingo.css">';
    var printBodyClass = ' class="bingo-print-mode"';

    // Clone the current bingo card
    var cardElem = document.querySelector('.bingo-card');
    if (!cardElem) return;
    var originalClass = cardElem.className;
    var cardsHtml = [];
    for (var i = 0; i < numCards; i++) {
      // For each print card, set full-bg class based on current showBackground state
      var showBg = document.getElementById('showBackground').checked;
      if (showBg) {
        cardElem.classList.add('full-bg');
      } else {
        cardElem.classList.remove('full-bg');
      }
      renderBingoCards();
      var clone = cardElem.cloneNode(true);
      clone.className = cardElem.className + ' ' + style + ' print-card';
      cardsHtml.push('<div class="print-card-rotator">' + clone.outerHTML + '</div>');
    }
    // Restore the original class after print staging so toggling works again
    cardElem.className = originalClass;

    // Layout: 2 cards per page
    var containerHtml = '<div class="print-cards-container">';
    for (var i = 0; i < numCards; i += 2) {
      containerHtml += '<div class="print-page">';
      containerHtml += cardsHtml[i] || '';
      if (i + 1 < numCards) {
        containerHtml += cardsHtml[i + 1];
      }
      containerHtml += '</div>';
    }
    containerHtml += '</div>';

    printWindow.document.write('<!DOCTYPE html><html><head><title>Print Bingo Cards</title>' + printCssLink + '</head><body' + printBodyClass + '>' + containerHtml + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function() { printWindow.print(); }, 500);
  });
  renderBingoCards();
});

