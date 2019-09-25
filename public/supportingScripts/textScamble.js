/*------------------------------------*/
/*   SCAMBLE TEXT (by Justin Windle)  */
/*------------------------------------*/ 

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }}


// ——————————————————————————————————————————————————
// Scamble Text implementation
// ——————————————————————————————————————————————————

const next = (phrases, el, cnter) => {
  const fx = new TextScramble(el);
  if (cnter < phrases.length) { 
    fx.setText(phrases[cnter]).then(() => {
      cnter += 1;
      setTimeout(() => {next(phrases, el, cnter);}, 800);
      });
  }
};

let counter = 0;
const introPhrases0 = [
'Hello,',
'My name is Thao Phuong'];
const el0 = document.querySelector('.intro1');
next(introPhrases0, el0, counter);

const introPhrases1 = [ 'I \'m a coder, K-pop dancer, online gamer, thinker, organizer, leader, and LEARNER!'];
const el1 = document.querySelector('.intro2');
setTimeout(() => {next(introPhrases1, el1, counter);}, 1650);





