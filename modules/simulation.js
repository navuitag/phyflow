export function renderSimulationPanel(config = {}) {
  const type = config.simulation || config.visualization || "ohm";
  return `
    <div class="viz simulation-viz" aria-label="Mô phỏng vật lí">
      <div class="sim-controls" id="simControls">
        <label>U (V): <input type="range" id="simU" min="1" max="24" value="${config.voltage || 12}"> <output id="simUVal">${config.voltage || 12}</output></label>
        <label>R (Ω): <input type="range" id="simR" min="1" max="24" value="${config.resistance || 6}"> <output id="simRVal">${config.resistance || 6}</output></label>
      </div>
      <canvas id="simCanvas" width="420" height="200" aria-label="Mô phỏng mạch điện"></canvas>
      <p class="sim-readout" id="simReadout">I = 2,0 A · P = 24 W</p>
      <div data-simulation="${type}" data-u="${config.voltage || 12}" data-r="${config.resistance || 6}"></div>
    </div>
  `;
}

export function initSimulation(container, type = "ohm") {
  if (type !== "ohm") return;

  const canvas = container.closest(".viz")?.querySelector("#simCanvas")
    || container.querySelector("#simCanvas")
    || document.querySelector("#simCanvas");
  if (!canvas) {
    const parent = container.closest(".ohm-viz") || container.parentElement;
    if (parent && !parent.querySelector("canvas")) {
      const c = document.createElement("canvas");
      c.id = "simCanvas";
      c.width = 420;
      c.height = 160;
      container.append(c);
      bindOhmSimulation(c, container);
    }
    return;
  }
  bindOhmSimulation(canvas, container);
}

function bindOhmSimulation(canvas, container) {
  const root = canvas.closest(".viz") || container.closest(".viz") || document;
  const uInput = root.querySelector("#simU");
  const rInput = root.querySelector("#simR");
  const uVal = root.querySelector("#simUVal");
  const rVal = root.querySelector("#simRVal");
  const readout = root.querySelector("#simReadout");

  let u = Number(container.dataset.u || uInput?.value || 12);
  let r = Number(container.dataset.r || rInput?.value || 6);

  function getValues() {
    if (uInput) u = Number(uInput.value);
    if (rInput) r = Number(rInput.value);
    if (uVal) uVal.textContent = u;
    if (rVal) rVal.textContent = r;
    return { u, r, i: u / r };
  }

  function draw() {
    const { u, r, i } = getValues();
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#f8fbfe";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#17324d";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    const y = h / 2;
    const x1 = 40;
    const x2 = w - 40;

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x1 + 60, y);
    ctx.lineTo(x1 + 60, y - 50);
    ctx.lineTo(x2 - 60, y - 50);
    ctx.lineTo(x2 - 60, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    ctx.fillStyle = "#20a36b";
    ctx.fillRect(x1 + 55, y - 58, 10, 16);
    ctx.fillRect(x2 - 65, y - 58, 10, 16);

    ctx.fillStyle = "#2d7ff9";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.fillText("+", x1 + 52, y - 62);
    ctx.fillText("−", x2 - 62, y - 62);

    const rx = (x1 + x2) / 2 - 30;
    ctx.strokeStyle = "#f5b942";
    ctx.lineWidth = 4;
    ctx.strokeRect(rx, y - 20, 60, 40);
    ctx.fillStyle = "#17324d";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillText(`R=${r}Ω`, rx + 8, y + 5);

    const flowSpeed = Math.min(i / 3, 1);
    const dots = 6;
    for (let n = 0; n < dots; n++) {
      const t = ((Date.now() / (800 / (flowSpeed + 0.2)) + n * 40) % 280) / 280;
      const px = x1 + 60 + t * (x2 - x1 - 120);
      ctx.fillStyle = "#df4f5f";
      ctx.beginPath();
      ctx.arc(px, y - 50, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#637487";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(`U = ${u} V`, x1, y + 30);
    ctx.fillText(`I = ${i.toFixed(1)} A`, x2 - 70, y + 30);

    if (readout) {
      const p = u * i;
      readout.textContent = `I = ${i.toFixed(1)} A · P = ${p.toFixed(0)} W · Theo Định luật Ôm: I = U/R`;
    }
  }

  if (uInput) uInput.addEventListener("input", draw);
  if (rInput) rInput.addEventListener("input", draw);

  draw();
  const loop = () => {
    draw();
    canvas._simFrame = requestAnimationFrame(loop);
  };
  if (canvas._simFrame) cancelAnimationFrame(canvas._simFrame);
  loop();
}
