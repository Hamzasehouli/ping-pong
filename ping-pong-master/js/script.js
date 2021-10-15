const canvas = document.getElementById("pong");
const ctx = canvas?.getContext("2d");
const startBtn = document.querySelector(".btn--start");
const endBtn = document.querySelector(".btn--end");
const restartBtn = document.querySelector(".btn--restart");
const selectedDifficulty = document.querySelector(".selectDifficulty");
const slectedPlayer = document.querySelector(".selectPlayer");
const characters = document.querySelectorAll(".killer");
const init = document.querySelector(".init");

let theScore = 0;

let difficutly;
let person;
const tar = {
  difficutly: "easy",
};

const handl = function () {};

const p1 = new Proxy(tar, handl);

const ball = {
  x: canvas?.width / 2,
  y: canvas?.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "WHITE",
};

// const target = {
//   message1: "hello",
//   message2: "everyone",
// };

const handler = {
  get(target, prop, receiver) {
    console.log(target, prop, receiver);
  },
};

const proxy = new Proxy(ball, handler);

selectedDifficulty.addEventListener("change", (e) => {
  difficutly = e.target.value;
  if (difficutly === "easy") {
    proxy.velocityX = 5;
    proxy.velocityY = 5;
    proxy.speed = 7;
  } else if (difficutly === "medium") {
    proxy.velocityX = 7;
    proxy.velocityY = 7;
    proxy.speed = 10;
  } else {
    proxy.velocityX = 9;
    proxy.velocityY = 9;
    proxy.speed = 12;
  }
});

// selectedPlayer.addEventListener("change", (e) => {
//   person = e.target.value;
//   if (difficutly === "easy") {
//     proxy.velocityX = 5;
//     proxy.velocityY = 5;
//     proxy.speed = 7;
//   } else {
//     proxy.velocityX = 9;
//     proxy.velocityY = 9;
//     proxy.speed = 12;
//   }
// });

const user = {
  x: 0, // left side of canvas
  y: (canvas?.height - 100) / 2, // -100 the height of paddle
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

// COM Paddle
const com = {
  x: canvas?.width - 10, // - width of paddle
  y: (canvas?.height - 100) / 2, // -100 the height of paddle
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

// const user = {
//   x: 0,
//   y: (canvas?.height - 100) / 2,
//   width: 10,
//   height: 100,
//   score: 0,
//   color: "WHITE",
// };

// const com = {
//   x: canvas?.width - 10,
//   y: (canvas?.height - 100) / 2,
//   width: 10,
//   height: 100,
//   score: 0,
//   color: "WHITE",
// };

const proxy1 = new Proxy(user, handler);
const proxy2 = new Proxy(com, handler);

const net = {
  x: (canvas?.width - 2) / 2,
  y: 0,
  height: canvas?.height,
  width: 5,
  color: "WHITE",
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx?.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

canvas?.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = canvas?.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
  if (difficutly === "easy") {
    ball.x = canvas?.width / 2;
    ball.y = canvas?.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
  } else if (difficutly === "medium") {
    ball.x = canvas?.width / 2;
    ball.y = canvas?.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 10;
  } else {
    ball.x = canvas?.width / 2;
    ball.y = canvas?.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 12;
  }
}

function drawNet() {
  for (let i = 0; i <= canvas?.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "22px fantasy";
  ctx.fillText(text, x, y);
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

function update() {
  if (ball.x - ball.radius < 0) {
    com.score++;

    if (com.score > 4) {
      alert("computer won");
      restartFn();
      return;
    }
    resetBall();
  } else if (ball.x + ball.radius > canvas?.width) {
    user.score++;
    if (user.score > 4) {
      alert("User won");
      restartFn();
      return;
    }
    resetBall();
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  com.y += (ball.y - (com.y + com.height / 2)) * 0.15;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas?.height) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x + ball.radius < canvas?.width / 2 ? user : com;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = ball.x + ball.radius < canvas?.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // ball.speed += 0.1;
  }
}

function render() {
  drawRect(0, 0, canvas?.width, canvas?.height, "#f9861a");

  drawText(
    "Player" + ": " + user.score,
    canvas?.width / 4.8,
    canvas?.height / 5
  );

  drawText(
    "Com" + ": " + com.score,
    (3 * canvas?.width) / 4.3,
    canvas?.height / 5
  );

  drawNet();

  drawRect(user.x, user.y, user.width, user.height, user.color);

  drawRect(com.x, com.y, com.width, com.height, com.color);

  drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game() {
  update();
  render();
}
let framePerSecond = 50;
let loop;
let counting = 0;

startBtn.addEventListener("click", () => {
  if (!difficutly || difficutly === "Game difficulty") {
    return alert("please select the difficulty");
  }
  console.log(difficutly);
  init.style.display = "none";
  characters.forEach((c) => {
    c.classList.remove("hidden");
  });
  ++counting;
  if (counting === 1) {
    console.log(counting);
    loop = setInterval(game, 1000 / framePerSecond);
  }
});

endBtn?.addEventListener("click", () => {
  counting = 0;
  clearInterval(loop);
});

const restartFn = () => {
  if (!difficutly || difficutly === "Game difficulty") {
    return alert("please select the difficulty");
  }
  characters.forEach((c) => {
    c.classList.remove("hidden");
  });
  clearInterval(loop);
  counting = 0;
  difficutly = undefined;
  selectedDifficulty.value = "Game difficulty";
  proxy1.score = 0;
  proxy1.x = 0;
  proxy1.y = (canvas?.height - 100) / 2;
  proxy2.score = 0;
  proxy2.x = canvas?.width - 10;
  proxy2.y = (canvas?.height - 100) / 2;
  resetBall();
  game();
};
restartBtn?.addEventListener("click", () => {
  restartFn();
});
document.querySelector(".selectPlayer").addEventListener("change", (e) => {
  console.log(e.target.value);
});
