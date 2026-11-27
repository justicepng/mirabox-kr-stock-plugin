/**
 * KR & Global Stock/Index/Futures/Macro Plugin for Mirabox Stream Dock (v1.3.0)
 * - Supports Keypad, Information, and SecondaryScreen (293S Right Screen)
 * - Uses Local Realtime Relay (http://127.0.0.1:18765)
 * - Per-context inFlight lock prevents overlapping requests / stale overwrites
 * - Change Rate & Diff Primary Layout, Default Refresh: 10s
 */

const ACTION_UUID = "com.antigravity.krstock.ticker";
const LOCAL_RELAY_BASE = "http://127.0.0.1:18765";

const DEFAULT_SETTINGS = {
  stockCode: "005930",
  stockName: "삼성전자",
  refreshInterval: 10,
  urlMode: "naverPay",
  dataSource: "auto", // "auto" | "direct" | "relay"
  showExchange: true,
};

const DOMESTIC_INDICES = {
  KOSPI: { name: "코스피", market: "INDEX" },
  KOSDAQ: { name: "코스닥", market: "INDEX" },
  KPI200: { name: "코스피200", market: "INDEX" },
};

const GLOBAL_SYMBOLS = {
  // 해외 지수 선물
  NQCV1:     { name: "나스닥100 선물", market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/NQcv1", decimals: 2 },
  "NQ=F":    { name: "나스닥100 선물", market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/NQcv1", decimals: 2 },
  ESCV1:     { name: "S&P500 선물",   market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/EScv1", decimals: 2 },
  "ES=F":    { name: "S&P500 선물",   market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/EScv1", decimals: 2 },
  YMCV1:     { name: "다우 선물",     market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/YMcv1", decimals: 2 },
  "YM=F":    { name: "다우 선물",     market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/YMcv1", decimals: 2 },
  RTYCV1:    { name: "러셀2000 선물", market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/RTYcv1", decimals: 2 },
  "RTY=F":   { name: "러셀2000 선물", market: "FUTURES", naverUrl: "https://m.stock.naver.com/marketindex/futures/RTYcv1", decimals: 2 },
  // 해외 주요 지수
  ".IXIC":   { name: "나스닥 종합",     market: "US IDX", naverUrl: "https://stock.naver.com/world/index/.IXIC", decimals: 2 },
  ".NDX":    { name: "나스닥 100",      market: "US IDX", naverUrl: "https://stock.naver.com/world/index/.NDX", decimals: 2 },
  ".INX":    { name: "S&P 500",         market: "US IDX", naverUrl: "https://stock.naver.com/world/index/.INX", decimals: 2 },
  ".DJI":    { name: "다우존스",        market: "US IDX", naverUrl: "https://stock.naver.com/world/index/.DJI", decimals: 2 },
  ".SOX":    { name: "필라델피아반도체", market: "US IDX", naverUrl: "https://stock.naver.com/world/index/.SOX", decimals: 2 },
  // 환율 & 달러인덱스
  FX_USDKRW: { name: "원/달러 환율",  market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDKRW", decimals: 2 },
  USDKRW:    { name: "원/달러 환율",  market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDKRW", decimals: 2 },
  "KRW=X":   { name: "원/달러 환율",  market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDKRW", decimals: 2 },
  "DX-Y.NYB":{ name: "달러인덱스",    market: "DXY", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDX", decimals: 2 },
  DXY:       { name: "달러인덱스",    market: "DXY", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDX", decimals: 2 },
  USDX:      { name: "달러인덱스",    market: "DXY", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDX", decimals: 2 },
  "JPY=X":   { name: "달러/엔 환율",  market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDJPY", decimals: 2 },
  USDJPY:    { name: "달러/엔 환율",  market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDJPY", decimals: 2 },
  "EURUSD=X":{ name: "유로/달러",     market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_EURUSD", decimals: 4 },
  EURUSD:    { name: "유로/달러",     market: "FX", naverUrl: "https://m.stock.naver.com/marketindex/exchange/FX_EURUSD", decimals: 4 },
  // 원자재 (에너지 & 귀금속/비철)
  "CL=F":    { name: "WTI 원유",      market: "OIL",    naverUrl: "https://m.stock.naver.com/marketindex/energy/CLcv1", decimals: 2, prefix: "$" },
  CLCV1:     { name: "WTI 원유",      market: "OIL",    naverUrl: "https://m.stock.naver.com/marketindex/energy/CLcv1", decimals: 2, prefix: "$" },
  WTI:       { name: "WTI 원유",      market: "OIL",    naverUrl: "https://m.stock.naver.com/marketindex/energy/CLcv1", decimals: 2, prefix: "$" },
  "BZ=F":    { name: "브렌트유",      market: "OIL",    naverUrl: "https://m.stock.naver.com/marketindex/energy/LCOcv1", decimals: 2, prefix: "$" },
  LCOCV1:    { name: "브렌트유",      market: "OIL",    naverUrl: "https://m.stock.naver.com/marketindex/energy/LCOcv1", decimals: 2, prefix: "$" },
  BRENT:     { name: "브렌트유",      market: "OIL",    naverUrl: "https://m.stock.naver.com/marketindex/energy/LCOcv1", decimals: 2, prefix: "$" },
  "NG=F":    { name: "천연가스",      market: "ENERGY", naverUrl: "https://m.stock.naver.com/marketindex/energy/NGcv1", decimals: 3, prefix: "$" },
  NGCV1:     { name: "천연가스",      market: "ENERGY", naverUrl: "https://m.stock.naver.com/marketindex/energy/NGcv1", decimals: 3, prefix: "$" },
  "GC=F":    { name: "국제 금(Gold)", market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/GCcv1", decimals: 2, prefix: "$" },
  GCCV1:     { name: "국제 금(Gold)", market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/GCcv1", decimals: 2, prefix: "$" },
  GOLD:      { name: "국제 금(Gold)", market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/GCcv1", decimals: 2, prefix: "$" },
  "SI=F":    { name: "국제 은(Silver)", market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/SIcv1", decimals: 2, prefix: "$" },
  SICV1:     { name: "국제 은(Silver)", market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/SIcv1", decimals: 2, prefix: "$" },
  SILVER:    { name: "국제 은(Silver)", market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/SIcv1", decimals: 2, prefix: "$" },
  "HG=F":    { name: "구리 선물",     market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/HGcv1", decimals: 3, prefix: "$" },
  HGCV1:     { name: "구리 선물",     market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/HGcv1", decimals: 3, prefix: "$" },
  COPPER:    { name: "구리 선물",     market: "METALS", naverUrl: "https://m.stock.naver.com/marketindex/metals/HGcv1", decimals: 3, prefix: "$" },
  // 채권 금리 / 공포지수 / 비트코인
  "^TNX":    { name: "미 10년 국채",  market: "BOND",   naverUrl: "https://m.stock.naver.com/marketindex/bond/US10YT=RR", decimals: 3, suffix: "%" },
  US10Y:     { name: "미 10년 국채",  market: "BOND",   naverUrl: "https://m.stock.naver.com/marketindex/bond/US10YT=RR", decimals: 3, suffix: "%" },
  TNX:       { name: "미 10년 국채",  market: "BOND",   naverUrl: "https://m.stock.naver.com/marketindex/bond/US10YT=RR", decimals: 3, suffix: "%" },
  "^TYX":    { name: "미 30년 국채",  market: "BOND",   naverUrl: "https://m.stock.naver.com/marketindex/bond/US30YT=RR", decimals: 3, suffix: "%" },
  US30Y:     { name: "미 30년 국채",  market: "BOND",   naverUrl: "https://m.stock.naver.com/marketindex/bond/US30YT=RR", decimals: 3, suffix: "%" },
  TYX:       { name: "미 30년 국채",  market: "BOND",   naverUrl: "https://m.stock.naver.com/marketindex/bond/US30YT=RR", decimals: 3, suffix: "%" },
  "^VIX":    { name: "VIX 공포지수",  market: "VIX",    naverUrl: "https://finance.yahoo.com/quote/%5EVIX", decimals: 2 },
  VIX:       { name: "VIX 공포지수",  market: "VIX",    naverUrl: "https://finance.yahoo.com/quote/%5EVIX", decimals: 2 },
  "BTC-USD": { name: "비트코인(USD)", market: "CRYPTO", naverUrl: "https://finance.yahoo.com/quote/BTC-USD", decimals: 0, prefix: "$" },
  BTC:       { name: "비트코인(USD)", market: "CRYPTO", naverUrl: "https://finance.yahoo.com/quote/BTC-USD", decimals: 0, prefix: "$" },
};

function isDomesticIndex(code) {
  return Object.prototype.hasOwnProperty.call(
    DOMESTIC_INDICES,
    String(code || "").trim().toUpperCase()
  );
}

function getGlobalMeta(code) {
  return GLOBAL_SYMBOLS[String(code || "").trim().toUpperCase()] || null;
}

let $websocket = null;
const contexts = new Map();

async function fetchJsonWithTimeout(url, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const text = await res.text();
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

function sendEvent(payload) {
  if ($websocket && $websocket.readyState === WebSocket.OPEN) {
    $websocket.send(JSON.stringify(payload));
  }
}

function setImage(context, dataUrl) {
  sendEvent({
    event: "setImage",
    context,
    payload: {
      target: 0,
      image: dataUrl,
    },
  });
}

function setSettings(context, settings) {
  sendEvent({
    event: "setSettings",
    context,
    payload: settings,
  });
}

function sendToPropertyInspector(action, context, payload) {
  sendEvent({
    event: "sendToPropertyInspector",
    action: action || ACTION_UUID,
    context,
    payload,
  });
}

function openUrl(url) {
  sendEvent({
    event: "openUrl",
    payload: { url },
  });
}

function showAlert(context) {
  sendEvent({
    event: "showAlert",
    context,
  });
}

function buildTargetUrl(code, urlMode, apiNewPcUrl) {
  const cleanCode = (code || "005930").trim();
  const upper = cleanCode.toUpperCase();

  const gMeta = getGlobalMeta(upper);
  if (gMeta) {
    return gMeta.naverUrl;
  }

  if (isDomesticIndex(upper)) {
    switch (urlMode) {
      case "naverPayMobile":
        return `https://m.stock.naver.com/domestic/index/${upper}/total`;
      case "naverFinance":
        return `https://finance.naver.com/sise/sise_index.naver?code=${upper}`;
      case "naverPay":
      default:
        return `https://stock.naver.com/domestic/index/${upper}`;
    }
  }

  if (/^[0-9A-Za-z]{6}$/.test(cleanCode) && /\d/.test(cleanCode)) {
    switch (urlMode) {
      case "naverPayMobile":
        return `https://m.stock.naver.com/domestic/stock/${cleanCode}/total`;
      case "naverFinance":
        return `https://finance.naver.com/item/main.naver?code=${cleanCode}`;
      case "naverPay":
      default:
        return apiNewPcUrl || `https://stock.naver.com/domestic/stock/${cleanCode}`;
    }
  }

  return `https://finance.yahoo.com/quote/${encodeURIComponent(upper)}`;
}

function normalizeQuote(raw, code) {
  const cleanCode = (code || "").trim();
  const upper = cleanCode.toUpperCase();
  const isDomIdx = isDomesticIndex(upper);
  const gMeta = getGlobalMeta(upper);

  // 1) Yahoo Chart JSON 응답 (해외 선물/지수/환율/매크로/미국주식)
  const yMeta = raw?.chart?.result?.[0]?.meta;
  if (yMeta && yMeta.regularMarketPrice !== undefined) {
    const price = Number(yMeta.regularMarketPrice);
    const prev = Number(yMeta.chartPreviousClose ?? yMeta.previousClose ?? price);
    const diff = price - prev;
    const ratio = prev > 0 ? (diff / prev) * 100 : 0;

    let dirCode = "3";
    if (diff > 0) dirCode = "2";
    else if (diff < 0) dirCode = "5";

    const decimals = gMeta ? gMeta.decimals : 2;
    const fmt = (n) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

    const prefix = gMeta?.prefix || "";
    const suffix = gMeta?.suffix || "";

    return {
      itemCode: cleanCode,
      stockName: gMeta?.name || yMeta.shortName || upper,
      closePrice: `${prefix}${fmt(price)}${suffix}`,
      compareToPreviousClosePrice: `${fmt(Math.abs(diff))}${suffix}`,
      fluctuationsRatio: ratio.toFixed(2),
      compareToPreviousPrice: { code: dirCode },
      stockExchangeName: gMeta?.market || yMeta.exchangeName || "US",
      marketStatus: yMeta.marketState === "REGULAR" ? "OPEN" : "CLOSE",
      newPcUrl: gMeta?.naverUrl || `https://finance.yahoo.com/quote/${encodeURIComponent(upper)}`,
      isYahoo: true,
    };
  }

  // 2) Naver JSON 응답 (국내 주식/ETF/지수)
  const item = Array.isArray(raw?.datas) ? raw.datas[0] : raw;
  if (!item || item.closePrice === undefined || item.closePrice === null) return null;

  const idxMeta = isDomIdx ? DOMESTIC_INDICES[upper] : null;
  return {
    itemCode: item.itemCode || cleanCode,
    stockName: item.stockName || idxMeta?.name || "",
    closePrice: String(item.closePrice),
    compareToPreviousClosePrice: String(item.compareToPreviousClosePrice || "0"),
    fluctuationsRatio: String(item.fluctuationsRatio || "0"),
    compareToPreviousPrice: item.compareToPreviousPrice || { code: "3" },
    stockExchangeName: isDomIdx
      ? "INDEX"
      : item.stockExchangeName || item.stockExchangeType?.name || "KRX",
    marketStatus: item.marketStatus || "CLOSE",
    newPcUrl: isDomIdx
      ? `https://stock.naver.com/domestic/index/${upper}`
      : `https://stock.naver.com/domestic/stock/${item.itemCode || cleanCode}`,
    isYahoo: false,
  };
}

async function fetchDirectQuote(code) {
  const cleanCode = (code || "").trim();
  const upper = cleanCode.toUpperCase();
  const ts = Date.now();

  if (isDomesticIndex(upper)) {
    const raw = await fetchJsonWithTimeout(
      `https://polling.finance.naver.com/api/realtime/domestic/index/${encodeURIComponent(upper)}?_t=${ts}`,
      4500
    );
    const normalized = normalizeQuote(raw, cleanCode);
    if (normalized) return { data: normalized, source: "직접 API" };
    throw new Error("지수 직접 조회 응답 오류");
  }

  const gMeta = getGlobalMeta(upper);
  if (gMeta || !(/^[0-9A-Za-z]{6}$/.test(cleanCode) && /\d/.test(cleanCode))) {
    const yahooMap = {
      NQCV1: "NQ=F",
      ESCV1: "ES=F",
      YMCV1: "YM=F",
      RTYCV1: "RTY=F",
      ".INX": "^GSPC",
      ".IXIC": "^IXIC",
      ".NDX": "^NDX",
      ".DJI": "^DJI",
      ".SOX": "^SOX",
      FX_USDKRW: "KRW=X",
      USDKRW: "KRW=X",
      DXY: "DX-Y.NYB",
      USDX: "DX-Y.NYB",
      USDJPY: "JPY=X",
      EURUSD: "EURUSD=X",
      CLCV1: "CL=F",
      WTI: "CL=F",
      LCOCV1: "BZ=F",
      BRENT: "BZ=F",
      NGCV1: "NG=F",
      GCCV1: "GC=F",
      GOLD: "GC=F",
      SICV1: "SI=F",
      SILVER: "SI=F",
      HGCV1: "HG=F",
      COPPER: "HG=F",
      US10Y: "^TNX",
      TNX: "^TNX",
      US30Y: "^TYX",
      TYX: "^TYX",
      VIX: "^VIX",
      BTC: "BTC-USD",
    };
    const yahooSym = yahooMap[upper] || upper;
    const raw = await fetchJsonWithTimeout(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=1d&_t=${ts}`,
      4500
    );
    const normalized = normalizeQuote(raw, cleanCode);
    if (normalized) return { data: normalized, source: "직접 API" };
    throw new Error("해외/매크로 직접 조회 응답 오류");
  }

  const raw = await fetchJsonWithTimeout(
    `https://m.stock.naver.com/api/stock/${encodeURIComponent(cleanCode)}/basic?_t=${ts}`,
    4500
  );
  const normalized = normalizeQuote(raw, cleanCode);
  if (normalized) return { data: normalized, source: "직접 API" };
  throw new Error("국내 주식 직접 조회 응답 오류");
}

async function fetchRealtimeQuote(code, dataSource = "auto") {
  const cleanCode = (code || "").trim();
  if (!cleanCode) {
    throw new Error("종목 코드가 비어 있습니다.");
  }

  if (dataSource === "direct") {
    return await fetchDirectQuote(cleanCode);
  }

  const ts = Date.now();
  const relayUrl = `${LOCAL_RELAY_BASE}/quote?code=${encodeURIComponent(cleanCode)}&_t=${ts}`;
  try {
    const raw = await fetchJsonWithTimeout(relayUrl, dataSource === "relay" ? 5000 : 2000);
    const normalized = normalizeQuote(raw, cleanCode);
    if (normalized) {
      return { data: normalized, source: "로컬 릴레이" };
    }
    const keys = raw && typeof raw === "object" ? Object.keys(raw).slice(0, 5).join(",") : "empty";
    throw new Error(`응답 형식 불일치 (${keys})`);
  } catch (relayErr) {
    if (dataSource === "relay") {
      throw relayErr;
    }
    return await fetchDirectQuote(cleanCode);
  }
}

// --- Canvas Key Renderer (144x144) : 전일대비 & 등락률 메인 ---
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fitText(ctx, text, maxWidth, startSize, minSize, weight = "bold") {
  let size = startSize;
  while (size >= minSize) {
    ctx.font = `${weight} ${size}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 1;
  }
  return minSize;
}

function truncateText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(s + "…").width > maxWidth) {
    s = s.slice(0, -1);
  }
  return s + "…";
}

function renderStockImage(data, settings) {
  const size = 144;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const dirCode = String(data?.compareToPreviousPrice?.code || "3");
  const isUp = dirCode === "1" || dirCode === "2";
  const isDown = dirCode === "4" || dirCode === "5";

  const accentColor = isUp ? "#FF5252" : isDown ? "#4C9AFF" : "#9CA3AF";
  const subAccentColor = isUp ? "#FCA5A5" : isDown ? "#93C5FD" : "#CBD5E1";
  const boxBg = isUp
    ? "rgba(255, 77, 79, 0.15)"
    : isDown
    ? "rgba(59, 130, 246, 0.15)"
    : "rgba(156, 163, 175, 0.14)";
  const boxBorder = isUp
    ? "rgba(255, 77, 79, 0.38)"
    : isDown
    ? "rgba(59, 130, 246, 0.38)"
    : "rgba(156, 163, 175, 0.28)";
  const arrow = isUp ? "▲" : isDown ? "▼" : "-";

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, "#141B2D");
  grad.addColorStop(1, "#0B0F19");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, size, 4);

  const exchange = data.stockExchangeName || "KRX";
  const isOpen = data.marketStatus === "OPEN";
  const showEx = settings.showExchange !== false;

  if (showEx) {
    ctx.font = 'bold 11px "Malgun Gothic", sans-serif';
    ctx.fillStyle = "#94A3B8";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(exchange, 10, 16);

    ctx.beginPath();
    ctx.arc(size - 14, 16, 4, 0, Math.PI * 2);
    ctx.fillStyle = isOpen ? "#10B981" : "#64748B";
    ctx.fill();
  }

  const name = settings.stockName || data.stockName || data.itemCode;
  const nameY = showEx ? 34 : 26;
  const nameSize = fitText(ctx, name, size - 16, 19, 13, "bold");
  ctx.font = `bold ${nameSize}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
  ctx.fillStyle = "#F8FAFC";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(truncateText(ctx, name, size - 14), size / 2, nameY);

  const boxTop = showEx ? 48 : 42;
  const boxHeight = showEx ? 62 : 66;
  drawRoundedRect(ctx, 8, boxTop, size - 16, boxHeight, 10);
  ctx.fillStyle = boxBg;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = boxBorder;
  ctx.stroke();

  const ratioRaw = Number(data.fluctuationsRatio || 0);
  const sign = isUp ? "+" : isDown ? "-" : "";
  const ratioStr = isNaN(ratioRaw)
    ? `${data.fluctuationsRatio}%`
    : `${sign}${Math.abs(ratioRaw).toFixed(2)}%`;

  const ratioSize = fitText(ctx, ratioStr, size - 24, 30, 18, "bold");
  ctx.font = `bold ${ratioSize}px "Malgun Gothic", "Segoe UI", sans-serif`;
  ctx.fillStyle = accentColor;
  ctx.fillText(ratioStr, size / 2, boxTop + Math.round(boxHeight * 0.36));

  const diffRaw = String(data.compareToPreviousClosePrice || "0").replace(/^[+-]/, "");
  const diffText = `${arrow} ${diffRaw}`;
  const diffSize = fitText(ctx, diffText, size - 26, 17, 12, "bold");
  ctx.font = `bold ${diffSize}px "Malgun Gothic", "Segoe UI", sans-serif`;
  ctx.fillStyle = subAccentColor;
  ctx.fillText(truncateText(ctx, diffText, size - 24), size / 2, boxTop + Math.round(boxHeight * 0.77));

  const priceText = data.closePrice || "-";
  const priceSize = fitText(ctx, priceText, size - 18, 16, 12, "bold");
  ctx.font = `bold ${priceSize}px "Malgun Gothic", "Segoe UI", sans-serif`;
  ctx.fillStyle = "#E2E8F0";
  ctx.fillText(priceText, size / 2, 128);

  return canvas.toDataURL("image/png");
}

function renderErrorImage(code, msg) {
  const size = 144;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#18181B";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#EF4444";
  ctx.fillRect(0, 0, size, 4);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#FCA5A5";
  ctx.font = 'bold 18px "Malgun Gothic", sans-serif';
  ctx.fillText(code || "오류", size / 2, 54);

  ctx.fillStyle = "#A1A1AA";
  ctx.font = '13px "Malgun Gothic", sans-serif';
  ctx.fillText(truncateText(ctx, msg || "조회 실패", size - 20), size / 2, 88);

  return canvas.toDataURL("image/png");
}

async function updateContextStock(context, notifyPi = false, force = false) {
  const state = contexts.get(context);
  if (!state) return;
  if (state.inFlight && !force) return;

  state.inFlight = true;
  const seq = ++state.reqSeq;
  const code = state.settings.stockCode || DEFAULT_SETTINGS.stockCode;

  try {
    const { data, source } = await fetchRealtimeQuote(code, state.settings.dataSource || "auto");
    if (seq !== state.reqSeq) return;

    state.lastData = data;
    if (data.stockName && (!state.settings.stockName || !data.isYahoo)) {
      if (state.settings.stockName !== data.stockName) {
        state.settings.stockName = data.stockName;
        setSettings(context, state.settings);
      }
    }

    const img = renderStockImage(data, state.settings);
    setImage(context, img);

    if (notifyPi) {
      const displayName = state.settings.stockName || data.stockName || code;
      sendToPropertyInspector(ACTION_UUID, context, {
        type: "quoteStatus",
        ok: true,
        message: `${displayName} 실시간 조회 (${source}) · ${data.closePrice}`,
      });
    }
  } catch (err) {
    if (seq !== state.reqSeq) return;
    console.error("Failed to fetch stock:", code, err);
    if (!state.lastData) {
      const img = renderErrorImage(code, "시세 조회 실패");
      setImage(context, img);
    }
    if (notifyPi) {
      sendToPropertyInspector(ACTION_UUID, context, {
        type: "quoteStatus",
        ok: false,
        message: `조회 실패: ${err.message}`,
      });
    }
  } finally {
    if (seq === state.reqSeq) {
      state.inFlight = false;
    }
  }
}

function resetTimer(context) {
  const state = contexts.get(context);
  if (!state) return;
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
  const sec = Number(state.settings.refreshInterval);
  if (sec > 0) {
    state.timer = setInterval(() => {
      updateContextStock(context, false, false);
    }, sec * 1000);
  }
}

function applyNewSettings(context, rawSettings, notifyPi = false) {
  const state = contexts.get(context);
  const settings = Object.assign({}, DEFAULT_SETTINGS, rawSettings || {});
  if (state) {
    const codeChanged = state.settings.stockCode !== settings.stockCode;
    state.settings = settings;
    if (codeChanged) {
      state.lastData = null;
    }
  } else {
    contexts.set(context, {
      settings,
      timer: null,
      lastData: null,
      inFlight: false,
      reqSeq: 0,
    });
  }
  updateContextStock(context, notifyPi, true);
  resetTimer(context);
}

function handleWillAppear(data) {
  const { context, payload } = data;
  const settings = Object.assign({}, DEFAULT_SETTINGS, payload?.settings || {});
  contexts.set(context, {
    settings,
    timer: null,
    lastData: null,
    inFlight: false,
    reqSeq: 0,
  });

  if (!payload?.settings?.stockCode) {
    setSettings(context, settings);
  }

  updateContextStock(context, false, true);
  resetTimer(context);
}

function handleWillDisappear(data) {
  const { context } = data;
  const state = contexts.get(context);
  if (state?.timer) {
    clearInterval(state.timer);
  }
  contexts.delete(context);
}

function handleDidReceiveSettings(data) {
  const { context, payload } = data;
  applyNewSettings(context, payload?.settings, true);
}

function handleKeyUp(data) {
  const { context } = data;
  const state = contexts.get(context);
  const settings = state?.settings || DEFAULT_SETTINGS;
  const code = settings.stockCode || DEFAULT_SETTINGS.stockCode;
  if (!code) {
    showAlert(context);
    return;
  }
  const targetUrl = buildTargetUrl(
    code,
    settings.urlMode,
    state?.lastData?.newPcUrl
  );
  openUrl(targetUrl);
}

async function handleSendToPlugin(data) {
  const { context, payload } = data;
  if (!payload || !payload.type) return;

  if (payload.type === "updateSettings" && payload.settings) {
    setSettings(context, payload.settings);
    applyNewSettings(context, payload.settings, true);
  } else if (payload.type === "refreshNow") {
    await updateContextStock(context, true, true);
  } else if (payload.type === "openUrl") {
    const state = contexts.get(context);
    const settings = state?.settings || DEFAULT_SETTINGS;
    const code = payload.stockCode || settings.stockCode || DEFAULT_SETTINGS.stockCode;
    const targetUrl = buildTargetUrl(
      code,
      payload.urlMode || settings.urlMode,
      state?.lastData?.newPcUrl
    );
    openUrl(targetUrl);
  }
}

const connectSocket = connectElgatoStreamDeckSocket;

function connectElgatoStreamDeckSocket(port, uuid, event, info) {
  $websocket = new WebSocket("ws://127.0.0.1:" + port);

  $websocket.onopen = () => {
    sendEvent({ uuid, event });
  };

  $websocket.onmessage = (e) => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch {
      return;
    }

    switch (data.event) {
      case "willAppear":
        handleWillAppear(data);
        break;
      case "willDisappear":
        handleWillDisappear(data);
        break;
      case "didReceiveSettings":
        handleDidReceiveSettings(data);
        break;
      case "keyUp":
        handleKeyUp(data);
        break;
      case "sendToPlugin":
        handleSendToPlugin(data);
        break;
      default:
        break;
    }
  };
}
