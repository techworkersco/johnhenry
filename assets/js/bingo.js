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
    if (main) {
      main.className = style;
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
    // Get options
    var style = document.querySelector('input[name="cardStyle"]:checked').value;
    var useLessInk = style === 'useLessInk';
    var blackWhite = style === 'blackWhite';
    var fullColor = style === 'fullColor';
    var numCards = Math.max(1, Math.min(40, parseInt(document.getElementById('numCards').value) || 1));

    // Prepare bingo cards HTML
    var cardsHtml = '';
    for (var cardIdx = 0; cardIdx < numCards; cardIdx++) {
      // Shuffle bingoText for each card
      var phrases = bingoText.slice();
      for (var i = phrases.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = phrases[i];
        phrases[i] = phrases[j];
        phrases[j] = temp;
      }
      // Build squares
      var squares = [];
      var phraseIdx = 0;
      for (var r = 0; r < bingoSize; r++) {
        squares[r] = [];
        for (var c = 0; c < bingoSize; c++) {
          if (r === 2 && c === 2) {
            squares[r][c] = { type: 'center', img: '/assets/hammer-logo.png', alt: 'Hammer Logo' };
          } else {
            squares[r][c] = { type: 'text', text: phrases[phraseIdx++] };
          }
        }
      }
      // Card HTML
      var cardHtml = '';
      cardHtml += '<section class="bingo-card' + (useLessInk ? '' : ' full-bg') + ' print-card" aria-label="Bingo Card">';
      // Letters background SVG
      if (!useLessInk && !blackWhite) {
        cardHtml += '<img src="' + (fullColor ? bingo_letters_bgs : bingo_letters_printer_friendly) + '" alt="Bingo Letters Background" class="bingo-letters-bg">';
      }
      // Bingo title
      cardHtml += '<img src="' + bingo_title + '" alt="Workplace AI Implementation Bingo" class="bingo-title">';
      // Bingo grid
      cardHtml += '<table role="grid" aria-label="Bingo Grid" class="bingo-grid">';
      for (var rr = 0; rr < bingoSize; rr++) {
        cardHtml += '<tr>';
        for (var cc = 0; cc < bingoSize; cc++) {
          cardHtml += '<td class="bingo-square">';
          if (squares[rr][cc].type === 'center') {
            cardHtml += '<img src="' + squares[rr][cc].img + '" alt="' + squares[rr][cc].alt + '" class="center-img">';
          } else {
            cardHtml += squares[rr][cc].text;
          }
          cardHtml += '</td>';
        }
        cardHtml += '</tr>';
      }
      cardHtml += '</table>';
      // Footer
      if (!useLessInk) {
        cardHtml += '<img src="' + bingo_footer + '" alt="Bingo Card Footer" class="bingo-footer">';
      }
      cardHtml += '</section>';
      cardsHtml += cardHtml;
    }

    // Print window HTML and styles
    var printWindow = window.open('', '_blank');
    var printStyles = `
      <style>
      body { background: #fff !important; margin: 0; padding: 0; }
      .print-cards-container { width: 100vw; min-height: 100vh; }
      .print-page { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24pt 0; page-break-after: always; }
      .print-card-outer { width: 468pt; height: 324pt; display: flex; justify-content: center; align-items: center; margin: 12pt 0; position: relative; overflow: visible; }
      .print-card {
        width: 324pt; height: 468pt;
        box-sizing: border-box;
        border: 2pt solid #222;
        border-radius: 12pt;
        overflow: visible;
        margin: 0;
        position: absolute;
        left: 0; top: 0;
        background: #fff;
        page-break-inside: avoid;
        transform-origin: center center;
        display: block;
      }
      .bingo-title { display: block; margin: 18pt auto 8pt auto; width: 90%; height: auto; z-index: 3; }
      .bingo-letters-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100pt; z-index: 2; }
      .bingo-footer { width: 100%; height: 32pt; position: absolute; bottom: 0; left: 0; z-index: 6; }
      .bingo-grid { width: 95%; margin: 0 30pt; background: transparent; border-collapse: collapse; z-index: 4; }
      .bingo-square { width: 64pt; height: 64pt; background: #fff; border: 1.5pt solid #222; text-align: center; vertical-align: middle; font-size: 10pt; font-family: Inconsolata, Arial, sans-serif; padding: 0 6pt; overflow-wrap: break-word; position: relative; z-index: 5; box-sizing: border-box; word-break: break-word; white-space: normal; }
      .center-img { width: 36pt; height: 36pt; display: block; margin: 0 auto; }
      @media print {
        body { background: #fff !important; }
        .print-cards-container { page-break-inside: avoid; }
        .print-page { page-break-after: always; }
        .print-card { page-break-inside: avoid; }
      }
      </style>
    `;

    // Layout: 2 cards per page, each rotated 90deg
    var containerHtml = '<div class="print-cards-container">';
    var cardSections = cardsHtml.split('</section>');
    for (var i = 0; i < numCards; i += 2) {
      containerHtml += '<div class="print-page">';
      // Top card
      containerHtml += '<div class="print-card-outer"><div class="print-card">' + cardSections[i].replace('<section', '<section').replace('</section>', '') + '</section></div></div>';
      // Bottom card (if exists)
      if (i + 1 < numCards) {
        containerHtml += '<div class="print-card-outer"><div class="print-card">' + cardSections[i + 1].replace('<section', '<section').replace('</section>', '') + '</section></div></div>';
      }
      containerHtml += '</div>';
    }
    containerHtml += '</div>';

    printWindow.document.write('<!DOCTYPE html><html><head><title>Print Bingo Cards</title>' + printStyles + '</head><body>' + containerHtml + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function() { printWindow.print(); }, 500);
  });
  renderBingoCards();
});

