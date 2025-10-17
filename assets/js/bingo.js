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
  "Its workers' job to review bad AI output",
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
  // Create options UI
  let optionsDiv = document.getElementById('bingo-options');
  if (!optionsDiv) {
    optionsDiv = document.createElement('div');
    optionsDiv.id = 'bingo-options';
    optionsDiv.style.marginBottom = '1.5rem';
    optionsDiv.innerHTML = `
      <form id="bingo-options-form" style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
        <fieldset style="border:none;display:flex;gap:1rem;align-items:center;">
          <legend style="font-weight:bold;">Card Style:</legend>
          <label><input type="radio" name="cardStyle" id="fullColor" value="fullColor" checked> Full Color</label>
          <label><input type="radio" name="cardStyle" id="blackWhite" value="blackWhite"> Black & White</label>
          <label><input type="radio" name="cardStyle" id="printerFriendly" value="printerFriendly"> Printer-friendly</label>
        </fieldset>
        <label>Number of cards to print: <input type="number" id="numCards" min="1" max="40" value="1" style="width:3em;"></label>
        <button type="button" id="printBingo">Print Bingo Cards</button>
      </form>
    `;
    // Insert optionsDiv just above the rendered card, below other page content
    let mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.parentNode.insertBefore(optionsDiv, mainContent.nextSibling);
    } else {
      document.body.appendChild(optionsDiv);
    }
  }

  // Add CSS styles for bingo card and grid
  function injectBingoStyles() {
    if (document.getElementById('bingo-card-styles')) return;
    const style = document.createElement('style');
    style.id = 'bingo-card-styles';
    style.textContent = `
      .bingo-cards-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2rem;
        aria-label: Printable Bingo Cards;
      }
      .bingo-card {
        position: relative;
        width: 420px;
        height: 540px;
        background: #fff;
        box-sizing: border-box;
        border: 2px solid #222;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 2rem;
      }
      .bingo-card.full-bg {
        background: url('/assets/bingo-assets/bingo-bg.svg') center/cover;
      }
      .bingo-title {
        display: block;
        margin: 18px auto 8px auto;
        width: 90%;
        height: auto;
        z-index: 3;
      }
      .bingo-letters-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        z-index: 2;
      }
      .bingo-footer {
        width: 100%;
        height: 32px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 6;
      }
      .bingo-grid {
        width: 95%;
        margin: 0 30px;
        background: transparent;
        border-collapse: collapse;
        z-index: 4;
      }
      .bingo-square {
        width: 80px;
        height: 80px;
        background: #fff;
        border: 1.5px solid #222;
        text-align: center;
        vertical-align: middle;
        font-size: 1rem;
        font-family: Inconsolata, Arial, sans-serif;
        padding: 0 6px;
        overflow-wrap: break-word;
        position: relative;
        z-index: 5;
        box-sizing: border-box;
        word-break: break-word;
        white-space: normal;
      }
      .bingo-square .center-img {
        width: 48px;
        height: 48px;
        display: block;
        margin: 0 auto;
      }
      @media print {
        body {
          background: #fff !important;
        }
        .bingo-cards-container {
          page-break-inside: avoid;
        }
        .bingo-card {
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Main render function
  function renderBingoCards() {
    injectBingoStyles();
    // Get options
    const style = document.querySelector('input[name="cardStyle"]:checked').value;
    const printerFriendly = style === 'printerFriendly';
    const blackWhite = style === 'blackWhite';
    const fullColor = style === 'fullColor';
    const numCards = Math.max(1, Math.min(40, parseInt(document.getElementById('numCards').value) || 1));

    // Remove old cards
    document.querySelectorAll('.bingo-cards-container').forEach(e => e.remove());

    // Create container
    const container = document.createElement('main');
    container.className = 'bingo-cards-container';
    container.setAttribute('aria-label', 'Printable Bingo Cards');

    for (let cardIdx = 0; cardIdx < 1; cardIdx++) {
      // Shuffle bingoText for each card
      const phrases = [...bingoText];
      for (let i = phrases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
      }
      // Build squares
      let squares = [];
      let phraseIdx = 0;
      for (let r = 0; r < bingoSize; r++) {
        squares[r] = [];
        for (let c = 0; c < bingoSize; c++) {
          if (r === 2 && c === 2) {
            squares[r][c] = { type: 'center', img: '/assets/hammer-logo.png', alt: 'Hammer Logo' };
          } else {
            squares[r][c] = { type: 'text', text: phrases[phraseIdx++] };
          }
        }
      }
      // Card section
      const cardSection = document.createElement('section');
      cardSection.className = 'bingo-card' + (printerFriendly ? '' : ' full-bg');
      cardSection.setAttribute('aria-label', 'Bingo Card');
      // Letters background SVG
      if (!printerFriendly && !blackWhite) {
        const lettersBg = document.createElement('img');
        lettersBg.src = fullColor ? bingo_letters_bgs : bingo_letters_printer_friendly;
        lettersBg.alt = 'Bingo Letters Background';
        lettersBg.className = 'bingo-letters-bg';
        cardSection.appendChild(lettersBg);
      }
      // Bingo title
      const titleImg = document.createElement('img');
      titleImg.src = bingo_title;
      titleImg.alt = 'Workplace AI Implementation Bingo';
      titleImg.className = 'bingo-title';
      cardSection.appendChild(titleImg);
      // Bingo grid
      const table = document.createElement('table');
      table.setAttribute('role', 'grid');
      table.setAttribute('aria-label', 'Bingo Grid');
      table.className = 'bingo-grid';
      for (let r = 0; r < bingoSize; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < bingoSize; c++) {
          const td = document.createElement('td');
          td.className = 'bingo-square';
          if (squares[r][c].type === 'center') {
            const img = document.createElement('img');
            img.src = squares[r][c].img;
            img.alt = squares[r][c].alt;
            img.className = 'center-img';
            td.appendChild(img);
          } else {
            td.textContent = squares[r][c].text;
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      cardSection.appendChild(table);
      // Footer
      if (!printerFriendly) {
        const footerImg = document.createElement('img');
        footerImg.src = bingo_footer;
        footerImg.alt = 'Bingo Card Footer';
        footerImg.className = 'bingo-footer';
        cardSection.appendChild(footerImg);
      }
      container.appendChild(cardSection);
    }
    // Insert container just after the optionsDiv
    optionsDiv.parentNode.insertBefore(container, optionsDiv.nextSibling);
  }

  // Update card automatically when options change
  document.getElementById('bingo-options-form').addEventListener('input', function(e) {
    if (e.target.id !== 'printBingo' && e.target.id !== 'numCards') {
      renderBingoCards();
    }
  });

  document.getElementById('printBingo').addEventListener('click', function() {
    renderBingoCards();
    window.print();
  });
  renderBingoCards();
});

