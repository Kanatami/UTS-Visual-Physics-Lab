
(function () {
  const KEY = "projectile";
  const TITLE = "Projectile (Parabolic) Motion";

  const deg2rad = d => (d * Math.PI) / 180;

  // DOM util
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function sliderRow(id, label, unit, min, max, step, val) {
    const row = el("div", "row");
    const lab = el("label", "label"); lab.htmlFor = id; lab.textContent = `${label} (${unit})`;
    const out = el("span", "value", String(val));
    const input = el("input"); input.type = "range"; input.id = id; input.min = min; input.max = max; input.step = step; input.value = val;
    input.oninput = () => { out.textContent = input.value; };
    row.append(lab, input, out);
    return { row, input, out };
  }
  function numberRow(id, label, unit, min, step, val) {
    const row = el("div", "row");
    const lab = el("label", "label"); lab.htmlFor = id; lab.textContent = `${label} (${unit})`;
    const input = el("input"); input.type = "number"; input.id = id; input.min = String(min); input.step = String(step); input.value = String(val);
    row.append(lab, input);
    return { row, input };
  }
  function register(def) {
    if (typeof window.registerSimulation === "function") window.registerSimulation(def);
    else { window.SimRegistry = window.SimRegistry || {}; window.SimRegistry[def.key] = def; }
  }


  function fitCanvasToCSS(canvas, ctx) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(300, Math.floor(rect.width));
    const cssH = Math.max(200, Math.floor(rect.height));
    const wantW = Math.round(cssW * dpr);
    const wantH = Math.round(cssH * dpr);
    if (canvas.width !== wantW || canvas.height !== wantH) {
      canvas.width = wantW;
      canvas.height = wantH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  register({
    key: KEY,
    title: TITLE,

    init(container) {
      const wrap = el("div", "");
      wrap.style.display = "grid";
      wrap.style.gridTemplateColumns = "340px 1fr";
      wrap.style.gridTemplateRows = "1fr auto";
      wrap.style.gap = "24px";

      const panel = el("div", "card"); panel.style.padding = "16px";
      panel.append(el("h3", "", TITLE));

      const vS  = sliderRow("v0", "Initial speed v0", "m/s", 1, 80, 0.5, 25);
      const thS = sliderRow("theta", "Launch angle θ", "deg", 0, 85, 0.5, 45);
      const hS  = numberRow("h0", "Initial height h0", "m", 0, 0.1, 0);
      const gS  = numberRow("g", "Gravity g", "m/s²", 0.1, 0.01, 9.81);
      const scS = numberRow("scale", "Scale", "px/m", 5, 1, 10);
      panel.append(vS.row, thS.row, hS.row, gS.row, scS.row);

      const btnRow = el("div", "row"); btnRow.style.gap = "12px";
      const startBtn = el("button", "btn primary", "Start");
      const resetBtn = el("button", "btn danger",  "Reset");
      const saveBtn  = el("button", "btn",         "Save Only");
      btnRow.append(startBtn, resetBtn, saveBtn);
      panel.append(btnRow);

      const zoomRow = el("div", "row"); zoomRow.style.gap = "8px"; zoomRow.style.marginTop = "16px";
      const zoomInBtn = el("button", "btn", "🔍+");
      const zoomOutBtn = el("button", "btn", "🔍-");
      const resetViewBtn = el("button", "btn", "Reset View");
      zoomRow.append(el("span", "", "Zoom:"), zoomInBtn, zoomOutBtn, resetViewBtn);
      panel.append(zoomRow);

      const view = el("div", "card"); view.style.position = "relative";
      const canvas = el("canvas"); canvas.style.width = "100%"; canvas.style.display = "block";
      view.append(canvas);
      
      const infoBar = el("div", "card");
      Object.assign(infoBar.style, {
        gridColumn: "1 / -1", 
        padding: "20px 24px",
        background: "#e0e5ec",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start"
      });
      
      const paramsSection = el("div", "");
      Object.assign(paramsSection.style, {
        flex: "1",
        padding: "16px 18px",
        borderRadius: "12px",
        background: "#e0e5ec",
        boxShadow: "inset 6px 6px 12px #b8bcc2, inset -6px -6px 12px #ffffff"
      });
      const paramsTitle = el("div", "");
      paramsTitle.innerHTML = "<strong style='color: #2a2f3a; font-size: 14px;'>Parameters</strong>";
      paramsTitle.style.marginBottom = "10px";
      const paramsDiv = el("div", "");
      paramsDiv.style.fontSize = "13px";
      paramsDiv.style.color = "#5e6774";
      paramsDiv.style.lineHeight = "1.6";
      paramsSection.append(paramsTitle, paramsDiv);
      
      const realtimeSection = el("div", "");
      Object.assign(realtimeSection.style, {
        flex: "1",
        padding: "16px 18px",
        borderRadius: "12px",
        background: "#e0e5ec",
        boxShadow: "inset 6px 6px 12px #b8bcc2, inset -6px -6px 12px #ffffff"
      });
      const realtimeTitle = el("div", "");
      realtimeTitle.innerHTML = "<strong style='color: #2a2f3a; font-size: 14px;'>Real-time Data</strong>";
      realtimeTitle.style.marginBottom = "10px";
      const realtimeDiv = el("div", "");
      realtimeDiv.style.fontSize = "13px";
      realtimeDiv.style.color = "#3b82f6";
      realtimeDiv.style.lineHeight = "1.6";
      realtimeSection.append(realtimeTitle, realtimeDiv);
      
      infoBar.append(paramsSection, realtimeSection);
      
      wrap.append(panel, view, infoBar);
      container.innerHTML = ""; container.appendChild(wrap);

      const ctx = canvas.getContext("2d");
      fitCanvasToCSS(canvas, ctx); 


      let running = false, t = 0, T = 0, vx0 = 0, vy0 = 0, h0 = 0, g = 9.81, scale = 10;
      let v0cur = 25, thetaDeg = 45, hMaxVal = 0, savedThisRun = false;
      let trace = [];
      
      let offsetX = 0, offsetY = 0; 
      let zoomLevel = 1.0; 
      let isDragging = false, dragStartX = 0, dragStartY = 0;
      

      const ORIGIN_MARGIN_X = 60;
      const ORIGIN_MARGIN_Y = 60;

      function worldToCanvas(xm, ym) {
        const x = (xm * scale * zoomLevel + ORIGIN_MARGIN_X) + offsetX;
        const y = canvas.clientHeight - ((ym * scale * zoomLevel + ORIGIN_MARGIN_Y) - offsetY);
        return [x, y];
      }
      function drawGrid() {
        const W = canvas.clientWidth, H = canvas.clientHeight;
        ctx.clearRect(0,0,W,H);
        const grad = ctx.createLinearGradient(0,0,W,H);
        grad.addColorStop(0,"#f7f9fe"); grad.addColorStop(1,"#e7ecf3");
        ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
        

        const gridSpacing = 20 * zoomLevel; 
        ctx.strokeStyle = "#d0d5dd"; 
        ctx.lineWidth = 0.5;
        
        for (let x = (offsetX % gridSpacing); x < W; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        
        for (let y = (offsetY % gridSpacing); y < H; y += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        

        ctx.strokeStyle = "#a0a5b0";
        ctx.lineWidth = 1.5;
        const majorSpacing = gridSpacing * 5;
        
        for (let x = (offsetX % majorSpacing); x < W; x += majorSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        
        for (let y = (offsetY % majorSpacing); y < H; y += majorSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        

        const [originX, originY] = worldToCanvas(0, 0);
        
        // Y
        ctx.strokeStyle = "#3b82f6"; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, H);
        ctx.stroke();
        
        // X
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(W, originY);
        ctx.stroke();
        

        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(originX, originY, 5, 0, Math.PI * 2);
        ctx.fill();
        

        ctx.fillStyle = "#1f2937";
        ctx.font = "14px system-ui, -apple-system, Segoe UI";
        ctx.fillText("O", originX - 15, originY + 20);
        ctx.fillText("x", originX + 10, originY - 10);
        ctx.fillText("y", originX - 20, originY - 10);
      }
      function draw(xm, ym) {
        drawGrid();
        if (trace.length > 1) {
          ctx.beginPath(); ctx.strokeStyle = "#4f7cff"; ctx.lineWidth = 2;
          trace.forEach(([x,y],i)=>{ const [cx,cy]=worldToCanvas(x,y); if(i===0)ctx.moveTo(cx,cy); else ctx.lineTo(cx,cy); });
          ctx.stroke();
        }
        const [cx, cy] = worldToCanvas(xm, ym);
        ctx.beginPath(); ctx.fillStyle = "#2a2f3a"; ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fill();
      }

      function recalc() {
        const v0 = parseFloat(vS.input.value);
        const th = deg2rad(parseFloat(thS.input.value));
        v0cur = v0; thetaDeg = parseFloat(thS.input.value);
        h0 = parseFloat(hS.input.value);
        g  = parseFloat(gS.input.value);
        scale = parseFloat(scS.input.value);
        vx0 = v0 * Math.cos(th); vy0 = v0 * Math.sin(th);
        const disc = (vy0**2) + 2*g*h0;
        T = (vy0 + Math.sqrt(Math.max(0, disc))) / g;
        hMaxVal = h0 + (vy0*vy0)/(2*g);
        
        paramsDiv.innerHTML =
          `v₀ = ${v0.toFixed(2)} m/s, θ = ${thetaDeg.toFixed(1)}°<br>` +
          `h₀ = ${h0.toFixed(2)} m, g = ${g.toFixed(2)} m/s²`;
      }

      function step() {
        if (!running) return;
        const dt = 1/60; t += dt;
        const xm = vx0 * t;
        const ym = h0 + vy0 * t - 0.5 * g * t * t;

        if (ym <= 0 || t >= T) {
          running = false;
          const R = vx0 * T;
          draw(R, 0);
          
          realtimeDiv.innerHTML =
            `<strong>Completed</strong><br>` +
            `Time: ${T.toFixed(2)} s<br>` +
            `Range: ${R.toFixed(2)} m<br>` +
            `h<sub>max</sub>: ${hMaxVal.toFixed(2)} m`;
          
          if (!savedThisRun && window.saveRunToCloud) {
            window.saveRunToCloud({
              v0: v0cur, 
              angle: thetaDeg, 
              h0, 
              g,
              T, 
              R, 
              hMax: hMaxVal
            }).catch(()=>{});
          }
          return;
        }
        trace.push([xm, ym]); if (trace.length > 1000) trace.shift();
        draw(xm, ym);
        
        realtimeDiv.innerHTML =
          `t = ${t.toFixed(2)} s<br>` +
          `x = ${Math.max(0, xm).toFixed(2)} m<br>` +
          `y = ${Math.max(0, ym).toFixed(2)} m<br>` +
          `h<sub>max</sub> ≈ ${hMaxVal.toFixed(2)} m`;
        
        requestAnimationFrame(step);
      }

      function start(){ 
        if (running) return; 
        recalc(); 
        running = true; 
        t = 0; 
        trace = []; 
        savedThisRun = false;
        realtimeDiv.innerHTML = `<strong>Starting...</strong>`;
        requestAnimationFrame(step); 
      }
      
      function reset(){ 
        running = false; 
        t = 0; 
        trace = []; 
        recalc(); 
        draw(0, parseFloat(hS.input.value)); 
        realtimeDiv.innerHTML = `Ready to start<br>Press "Start" button`;
      }
      async function saveOnly(){
        recalc();
        const R = (v0cur * Math.cos(deg2rad(thetaDeg))) * T;
        if (window.saveRunToCloud) {
          try {
            await window.saveRunToCloud({ v0: v0cur, angle: thetaDeg, h0, g, T, R, hMax: hMaxVal });
            realtimeDiv.innerHTML = 
              `<strong>Saved</strong><br>` +
              `Range: ${R.toFixed(2)} m<br>` +
              `T: ${T.toFixed(2)} s<br>` +
              `h<sub>max</sub>: ${hMaxVal.toFixed(2)} m`;
          } catch { 
            realtimeDiv.innerHTML = `<strong>Save failed</strong><br>Saved locally only`;
          }
        }
      }

      startBtn.onclick = start;
      resetBtn.onclick = reset;
      saveBtn.onclick  = saveOnly;
      
      zoomInBtn.onclick = () => {
        zoomLevel = Math.min(5, zoomLevel * 1.2);
        if (running) {
          const xm = vx0 * t;
          const ym = h0 + vy0 * t - 0.5 * g * t * t;
          draw(xm, Math.max(0, ym));
        } else {
          draw(0, parseFloat(hS.input.value));
        }
      };
      
      zoomOutBtn.onclick = () => {
        zoomLevel = Math.max(0.5, zoomLevel / 1.2);
        if (running) {
          const xm = vx0 * t;
          const ym = h0 + vy0 * t - 0.5 * g * t * t;
          draw(xm, Math.max(0, ym));
        } else {
          draw(0, parseFloat(hS.input.value));
        }
      };
      
      resetViewBtn.onclick = () => {
        offsetX = 0;
        offsetY = 0;
        zoomLevel = 1.0;
        if (running) {
          const xm = vx0 * t;
          const ym = h0 + vy0 * t - 0.5 * g * t * t;
          draw(xm, Math.max(0, ym));
        } else {
          draw(0, parseFloat(hS.input.value));
        }
      };
      
      [vS.input, thS.input, hS.input, gS.input, scS.input].forEach(inp=>{
        inp.addEventListener("input", ()=>{ 
          if(!running){ 
            recalc(); 
            draw(0, parseFloat(hS.input.value)); 
            realtimeDiv.innerHTML = `Parameters updated<br>Press "Start" to run`;
          } 
        });
      });


      window.addEventListener('resize', () => {
        fitCanvasToCSS(canvas, ctx);
        if (running) {
          const xm = vx0 * t;
          const ym = h0 + vy0 * t - 0.5 * g * t * t;
          draw(xm, Math.max(0, ym));
        } else {
          recalc(); draw(0, parseFloat(hS.input.value));
        }
      });

      canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
        canvas.style.cursor = 'grabbing';
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        
        if (running) {
          const xm = vx0 * t;
          const ym = h0 + vy0 * t - 0.5 * g * t * t;
          draw(xm, Math.max(0, ym));
        } else {
          draw(0, parseFloat(hS.input.value));
        }
      });

      canvas.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
      });

      canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        canvas.style.cursor = 'default';
      });

      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          const touch = e.touches[0];
          dragStartX = touch.clientX - offsetX;
          dragStartY = touch.clientY - offsetY;
        }
      });

      canvas.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        offsetX = touch.clientX - dragStartX;
        offsetY = touch.clientY - dragStartY;
        
        if (running) {
          const xm = vx0 * t;
          const ym = h0 + vy0 * t - 0.5 * g * t * t;
          draw(xm, Math.max(0, ym));
        } else {
          draw(0, parseFloat(hS.input.value));
        }
      }, { passive: false });

      canvas.addEventListener('touchend', () => {
        isDragging = false;
      });

      canvas.style.cursor = 'grab'; 

      recalc(); 
      draw(0, parseFloat(hS.input.value)); 
      realtimeDiv.innerHTML = `Ready to start<br>Press "Start" button`;
      
      return { start, pause(){ running = !running; if (running) requestAnimationFrame(step); }, reset };
    }
  });
})();