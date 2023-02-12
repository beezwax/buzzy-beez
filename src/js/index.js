import bzBond from "@beezwax/bzbond-js";
import "../scss/app.scss";

const BEE_COUNT = 20;
const DURATION = 10;
const BEE_SIZE = 20;
const BEEZWAX_LOGO = `url("data:image/svg+xml,%3Csvg class='bee' width='${BEE_SIZE}' height='${BEE_SIZE}' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg class='nav-logo-seal'%3E%3Cpath d='M50.8 106.625C59.1 99.325 61.9 91.625 61.9 91.625C63.2 87.725 64.7 84.525 64.7 69.325C64.7 46.425 56.2 38.925 47 32.025C40.8 27.325 24.9 21.125 15.5 17.625L2.29998 25.125C1.49998 25.725 0.999976 26.225 0.599976 26.825C24.4 32.125 41.5 48.025 41.5 66.825C41.5 78.225 35.1 88.625 24.9 96.125L44.7 107.525C45.1 107.725 46 108.125 47.3 108.125C47.9 108.125 49 107.925 50.3 106.825L50.8 106.625Z' fill='%23FFD939'%3E%3C/path%3E%3Cpath d='M22.9 13.3248L44 20.4248C64.6 27.7248 73.2 37.8248 73.2 37.8248C84.5 49.1248 83.2 61.6248 83.2 76.8248C83.2 80.6248 82.6 84.9248 81.7 89.0248L93 82.6248C95.6 81.1248 95.6 77.9248 95.6 77.9248V29.3248C95.6 26.1248 93 24.6248 93 24.6248L72.5 13.2248L50.6 0.624845C48.1 -0.675155 45.5 0.424845 45.3 0.624845L23.1 13.3248H22.9Z' fill='%23FFD939'%3E%3C/path%3E%3Cpath d='M0.1 31.5244V78.2244C0.1 80.8244 2.2 82.3244 2.7 82.7244L14.8 89.6244L17.8 91.3244C24.4 84.7244 28.4 76.3244 28.5 67.1244C28.5 51.5244 16.8 38.0244 0 31.5244H0.1Z' fill='%23FFD939'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`;
const CB_HANDLE = -.5;
const CB_TEMPER = 3;

let config;

play();

function reset() {
  document.querySelector("main").textContent = "";
  document.querySelector(".score").textContent = "0";
  document.getElementById("last-caught").textContent = "Nothing caught yet";
  document.querySelector(".beeBox").textContent = "";
}

function buildStyles() {
  const maxVertical = document.querySelector("main").clientHeight - BEE_SIZE;
  const maxHorizontal = document.querySelector("main").clientWidth - BEE_SIZE;

  let cssVars = `
    --duration: ${DURATION}s;
    --beezwax-logo: ${BEEZWAX_LOGO};
    --bee-size: ${BEE_SIZE};`;

  let cssBody = "";

  for (let beeNum = 1; beeNum <= BEE_COUNT; beeNum++) {
    const className = `bee${beeNum}`;
    let keyFramesX = "";
    let keyFramesY = "";
    for(let i = 1; i < 11; i++) {
      cssVars += `
      --${className}-x-${i * 10}: ${i === 10 ? maxHorizontal + BEE_SIZE + 10: Math.round((Math.random() - 0.5) * (maxHorizontal - BEE_SIZE))}px;
      --${className}-y-${i * 10}: ${Math.round((Math.random() - 0.5) * (maxVertical - BEE_SIZE))}px;`;
    }
    cssBody += `.${className} {
      animation: ${className}xaxis var(--duration) 1 ease-in forwards;
    }
    .${className}:after {
      content: var(--beezwax-logo);
      display: block;
      width: var(--bee-size)px;
      height: var(--bee-size)px;
      border-radius: var(--bee-size)px;
      background: rgba(0, 0, 0, 0);
      animation: ${className}yaxis var(--duration) 1 ease-in forwards;
    }
    .${className}:hover, .${className}:hover:after {
      /* animation-play-state: paused; */
      cursor: pointer;
    }
    `;
    let percentage = 0;
    for (let i = 10; i < 110; i += 10) {
      percentage = i === 100 ? 100 : Math.round(Math.random() * (100 - percentage));
      
      keyFramesX += `
        ${percentage}% {
          animation-timing-function: cubic-bezier(${Math.random() / CB_TEMPER}, ${(Math.random() + CB_HANDLE ) * ( 1 / Math.abs(CB_HANDLE) ) / CB_TEMPER }, ${Math.random() / CB_TEMPER}, ${(Math.random() + CB_HANDLE ) * ( 1 / Math.abs(CB_HANDLE) ) / CB_TEMPER });
          transform: translateX(var(--${className}-x-${i}));
        }`;
      keyFramesY += `
        ${percentage}% {
          animation-timing-function: cubic-bezier(${Math.random() / CB_TEMPER}, ${(Math.random() + CB_HANDLE ) * ( 1 / Math.abs(CB_HANDLE) ) / CB_TEMPER }, ${Math.random() / CB_TEMPER}, ${(Math.random() + CB_HANDLE ) * ( 1 / Math.abs(CB_HANDLE) ) / CB_TEMPER });
          transform: translateY(var(--${className}-y-${i}));
        }`;
    }
    cssBody += `
      @keyframes ${className}xaxis {
        ${keyFramesX}
      }

      @keyframes ${className}yaxis {
        ${keyFramesY}
      }
    `;
  }

  cssBody += `
    .caught-bee {
      content: var(--beezwax-logo);
      display: inline;
      margin: 3px;
      width: 10px;
      height: 10px;
      cursor: pointer;
    }
  `

  let css = `
  :root {
    ${cssVars}
  }

  ${cssBody}
  `;

  const head = document.head;
  const style = document.createElement("style");
  style.textContent = css;
  head.appendChild(style);
}

async function getReady() {

  const getReadyMessage = createFromTemplate("message");

  getReadyMessage.textContent = "Gathering Beez...";
  document.querySelector("main").appendChild(getReadyMessage);

  config = await bzBond.SyncConfig();

  const { response: { data: beez } } = await bzBond.PerformScript(config.script.getBeez, BEE_COUNT);

  getReadyMessage.textContent = "Get Ready!";
  getReadyMessage.classList.add("ready");
  
  await wait(1000);
  
  getReadyMessage.classList.remove("ready");

  getReadyMessage.addEventListener("animationend", (e) => e.target.remove());
  getReadyMessage.textContent = "Go!";
  getReadyMessage.classList.add("go");

  return beez;
}

function releaseBeez(beez) {
  const main = document.querySelector("main");
  const hive = createFromTemplate("hive");
  for (let beeNum = 1; beeNum < BEE_COUNT + 1; beeNum++) {
    const bee = document.createElement("div");
    bee.classList.add("flying-bee");
    bee.classList.add(`bee${beeNum}`);
    bee.setAttribute("data-id", beez[beeNum - 1].fieldData.ID);
    bee.setAttribute("data-title", beez[beeNum - 1].fieldData.TITLE);
    bee.setAttribute("data-name", beez[beeNum - 1].fieldData.NAME);
    bee.setAttribute("data-image", beez[beeNum - 1].fieldData.IMAGE_BASE64);
    bee.addEventListener("mousedown", catchBee);
    bee.addEventListener("animationend", removeBee);
    hive.appendChild(bee);
  }

  main.appendChild(hive);
}

async function endGame () {
  const beezCaught = +document.querySelector(".score").textContent;
  const descriptor = beezCaught !== 1 ? "beez" : "bee"; 
  const percentage = Math.round((beezCaught / BEE_COUNT) * 100);
  const postGame = createFromTemplate("post-game");
  const h2 = postGame.querySelector("h2");
  h2.textContent = "Game Over";
  const hive = document.querySelector(".hive");
  hive.appendChild(postGame);

  await wait(2000);

  h2.textContent = `You caught ${beezCaught} ${descriptor}.`;

  await wait(2000);

  h2.textContent = `That's ${percentage}% of the swarm.`;

  await wait(2000);


  const backToWork = createFromTemplate("back-to-work");
  const playAgain = createFromTemplate("play-again");
  h2.remove();
  backToWork.addEventListener("click", (e) => {
    bzBond.PerformScript(config.script.goToWork);
  });
  playAgain.addEventListener("click", (e) => play());

  postGame.appendChild(playAgain);
  postGame.appendChild(backToWork);

  if(beezCaught) {
    const lastCaught = document.getElementById("last-caught");
    lastCaught.textContent = `You caught ${beezCaught} ${descriptor}. Click on them in your bee box >>>`;
  }

}

function catchBee(e) {
  const score = document.querySelector(".score");
  const lastCaught = document.getElementById("last-caught");
  const beeBox = document.querySelector(".beeBox");
  e.target.className = "";
  e.target.classList.add("caught-bee");
  beeBox.appendChild(e.target);
  score.textContent = +score.textContent + 1;
  lastCaught.textContent = `You caught a ${e.target.dataset.title}!`;
  e.target.removeEventListener("mousedown", catchBee);
  e.target.removeEventListener("animationend", removeBee);
  e.target.addEventListener("click", showBeeDialog);
  bzBond.PerformScript(config.script.reportResult, e.target.dataset.id);
}

function removeBee(e) {
  e.target.remove();
}

async function showBeeDialog(e) {
  const dialog = document.createElement("dialog");
  const image = document.createElement("img");
  const closeButton = document.createElement("button");
  const name = document.createElement("p");
  const title = document.createElement("p");
  const imageWidth = await loadImage(image, `data:image/jpeg;base64,${e.target.dataset.image}`);
  closeButton.textContent = "✕";
  closeButton.classList.add("close-dialog-button");
  closeButton.addEventListener("click", e => {
    e.target.parentElement.close();
    document.querySelectorAll(".post-game-button").forEach(
      button => button.style.display = "unset"
    );
  });
  name.textContent = e.target.dataset.name;
  title.innerHTML = e.target.dataset.title;
  name.style.maxWidth = `${imageWidth}px`;
  title.style.maxWidth = `${imageWidth}px`;
  dialog.appendChild(closeButton);
  dialog.appendChild(image);
  dialog.appendChild(name);
  dialog.appendChild(title);
  const main = document.querySelector("main");
  const existingDialog = document.querySelector("dialog");
  if(existingDialog) {
    existingDialog.remove();
  }
  main.appendChild(dialog);
  document.querySelectorAll(".post-game-button").forEach(
    button => button.style.display = "none"
  );
  dialog.show();
  document.activeElement.blur();
}

async function play() {

  reset();

  buildStyles();

  const beez = await getReady();

  releaseBeez(beez);

  setTimeout(endGame, (DURATION + 1) * 1000);

}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function loadImage(img, src) {
  return new Promise (function (resolved, rejected) {
    img.onload = function(){
      resolved(img.width);
    };
    img.src = src;
  })
}

function createFromTemplate(templateId) {
  const template = document.getElementById(templateId);
  return template.content.firstElementChild.cloneNode(true);
}