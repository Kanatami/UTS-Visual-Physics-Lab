function toNum(x){ return (typeof x === "number") ? x : Number(x); }

const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  if (window.location.hostname.includes('web.app') || window.location.hostname.includes('firebaseapp.com')) {
    return 'https://api-zldmksklha-uc.a.run.app';
  }
  return 'https://api-zldmksklha-uc.a.run.app';
};

window.saveRunToCloud = async (raw) => {
  let payload;
  if (raw.simType === 'projectile') {
    payload = {
      simType: 'projectile',
      v0: toNum(raw.v0),
      angle: toNum(raw.angle),
      h0: toNum(raw.h0),
      g: toNum(raw.g),
      T: toNum(raw.T),
      R: toNum(raw.R),
      hMax: raw.hMax != null ? toNum(raw.hMax) : undefined
    };
  } else if (raw.simType === 'circular_motion') {
    payload = {
      simType: 'circular_motion',
      v: toNum(raw.v),
      r: toNum(raw.r),
      bank: toNum(raw.bank),
      mu: toNum(raw.mu),
      g: toNum(raw.g),
      lapTime: toNum(raw.lapTime),
      ac: toNum(raw.ac),
      omega: toNum(raw.omega)
    };
  } else {
    throw new Error("Invalid simulation type");
  }

  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken(true);

  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/runs`, {
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

  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/quiz-results`, {
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

  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/quiz-results`, {
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

window.getSimulationHistory = async () => {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken(true);

  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/simulation-runs`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const text = await res.text().catch(()=> "");
  if (!res.ok) {
    console.error("getSimulationHistory failed", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return text ? JSON.parse(text) : [];
};
