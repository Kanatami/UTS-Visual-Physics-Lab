function toNum(x){ return (typeof x === "number") ? x : Number(x); }

window.saveRunToCloud = async (raw) => {
  const payload = {
    v0: toNum(raw.v0),
    theta: toNum(raw.angle ?? raw.theta),
    h0: toNum(raw.h0),
    g: toNum(raw.g),
    flightTime: raw.T != null ? toNum(raw.T ?? raw.flightTime) : toNum(raw.flightTime),
    range: raw.R != null ? toNum(raw.R ?? raw.range) : toNum(raw.range),
    hMax: raw.hMax != null ? toNum(raw.hMax) : undefined
  };

  // Firebase Compat API
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken(true);

  const res = await fetch("/api/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(()=> "");
  if (!res.ok) {
    console.error("saveRun failed", res.status, text); 
    throw new Error(text || `HTTP ${res.status}`);
  }
  return text ? JSON.parse(text) : null;
};

window.saveQuizResultToCloud = async (data) => {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken(true);

  const res = await fetch("/api/quiz-results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await res.text().catch(()=> "");
  if (!res.ok) {
    console.error("saveQuizResult failed", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return text ? JSON.parse(text) : null;
};

window.getQuizHistory = async () => {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken(true);

  const res = await fetch("/api/quiz-results", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const text = await res.text().catch(()=> "");
  if (!res.ok) {
    console.error("getQuizHistory failed", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return text ? JSON.parse(text) : [];
};
