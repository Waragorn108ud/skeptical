// ===== คลังคำศัพท์: แก้ไข/เพิ่มคำได้ที่นี่ (word = คำศัพท์, meaning = ความหมาย) =====
const vocabulary = [
    { word: 'apple',    meaning: 'แอปเปิล' },
    { word: 'book',     meaning: 'หนังสือ' },
    { word: 'cat',      meaning: 'แมว' },
    { word: 'dog',      meaning: 'สุนัข' },
    { word: 'house',    meaning: 'บ้าน' },
    { word: 'water',    meaning: 'น้ำ' },
    { word: 'school',   meaning: 'โรงเรียน' },
    { word: 'teacher',  meaning: 'ครู' },
    { word: 'friend',   meaning: 'เพื่อน' },
    { word: 'sun',      meaning: 'ดวงอาทิตย์' },
    { word: 'tree',     meaning: 'ต้นไม้' },
    { word: 'car',      meaning: 'รถยนต์' },
    { word: 'happy',    meaning: 'มีความสุข' },
    { word: 'eat',      meaning: 'กิน' },
    { word: 'run',      meaning: 'วิ่ง' },
    { word: 'beautiful',meaning: 'สวยงาม' },
];

const PAIRS = 8; // จำนวนคู่ต่อเกม (กระดาน 4x4 = 8 คู่)

const game = document.getElementById('game');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

let firstPick;
let isPaused = true;
let matches;
let moves;

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const resetGame = () => {
    firstPick = null;
    matches = 0;
    moves = 0;
    messageEl.textContent = '';
    updateScore();

    // สุ่มคำศัพท์ แล้วสร้างการ์ด 2 ใบต่อคำ: ใบคำศัพท์ + ใบความหมาย
    const chosen = shuffle(vocabulary).slice(0, PAIRS);
    const cards = chosen.flatMap((item, id) => [
        { id, text: item.word,    kind: 'word' },
        { id, text: item.meaning, kind: 'meaning' },
    ]);
    displayCards(shuffle(cards));
    isPaused = false;
};

const displayCards = (cards) => {
    game.innerHTML = cards.map(card => `
        <div class="card" onclick="clickCard(event)" data-pair="${card.id}">
            <div class="front">?</div>
            <div class="back rotated ${card.kind}">
                <h2>${card.text}</h2>
            </div>
        </div>
    `).join('');
};

const clickCard = (e) => {
    const card = e.currentTarget;
    const [front, back] = getFrontAndBackFromCard(card);
    if (front.classList.contains('rotated') || isPaused) return;

    isPaused = true;
    rotateElements([front, back]);

    if (!firstPick) {
        firstPick = card;
        isPaused = false;
        return;
    }

    moves++;
    if (firstPick.dataset.pair !== card.dataset.pair) {
        const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
        setTimeout(() => {
            rotateElements([front, back, firstFront, firstBack]);
            firstPick = null;
            isPaused = false;
        }, 800);
    } else {
        matches++;
        firstPick.classList.add('matched');
        card.classList.add('matched');
        firstPick = null;
        isPaused = false;
        if (matches === PAIRS) {
            messageEl.textContent = `ยอดเยี่ยม! จับคู่ครบทั้งหมดใน ${moves} ครั้ง`;
        }
    }
    updateScore();
};

const updateScore = () => {
    scoreEl.textContent = `จับคู่ได้ ${matches} / ${PAIRS}`;
};

const getFrontAndBackFromCard = (card) => [
    card.querySelector('.front'),
    card.querySelector('.back'),
];

const rotateElements = (elements) => {
    elements.forEach(element => element.classList.toggle('rotated'));
};

resetGame();
