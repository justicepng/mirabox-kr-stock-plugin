/**
 * Property Inspector for KR & Global Stock/Index/Futures/Macro (Local Realtime) v1.3.0
 */

const LOCAL_RELAY_BASE = "http://127.0.0.1:18765";

const DEFAULT_SETTINGS = {
  stockCode: "005930",
  stockName: "삼성전자",
  refreshInterval: 10,
  urlMode: "naverPay",
  dataSource: "auto",
  showExchange: true,
};

const QUICK_PRESETS = [
  // 국내 지수 및 선물
  { code: "KOSPI",     name: "코스피",          market: "INDEX",   keywords: ["코스피", "kospi", "지수"] },
  { code: "KOSDAQ",    name: "코스닥",          market: "INDEX",   keywords: ["코스닥", "kosdaq", "지수"] },
  { code: "KPI200",    name: "코스피200",       market: "INDEX",   keywords: ["코스피200", "kospi200", "kpi200", "지수"] },
  { code: "KQI150",    name: "코스닥150",       market: "INDEX",   keywords: ["코스닥150", "kqi150", "코스닥선물", "지수"] },
  { code: "FUT",       name: "코스피200 선물",  market: "FUTURES", keywords: ["코스피선물", "코스피200선물", "선물", "fut", "kp200"] },
  // 해외 지수 선물
  { code: "NQcv1",     name: "나스닥100 선물",  market: "FUTURES", keywords: ["나스닥", "나스닥100", "나스닥선물", "선물", "nq", "nqcv1", "nq=f", "nasdaq"] },
  { code: "EScv1",     name: "S&P500 선물",     market: "FUTURES", keywords: ["s&p", "s&p500", "에스앤피", "선물", "es", "escv1", "es=f"] },
  { code: "YMcv1",     name: "다우 선물",       market: "FUTURES", keywords: ["다우", "다우선물", "선물", "ym", "ymcv1", "ym=f", "dow"] },
  { code: "RTYcv1",    name: "러셀2000 선물",   market: "FUTURES", keywords: ["러셀", "러셀2000", "선물", "rty", "rtycv1", "rty=f"] },
  // 해외 주요 지수
  { code: ".IXIC",     name: "나스닥 종합",     market: "US IDX",  keywords: ["나스닥", "나스닥종합", "ixic", "nasdaq", "지수"] },
  { code: ".NDX",      name: "나스닥 100",      market: "US IDX",  keywords: ["나스닥", "나스닥100", "ndx", "nasdaq", "지수"] },
  { code: ".INX",      name: "S&P 500",         market: "US IDX",  keywords: ["s&p", "s&p500", "에스앤피", "inx", "gspc", "지수"] },
  { code: ".DJI",      name: "다우존스",        market: "US IDX",  keywords: ["다우", "다우존스", "dji", "dow", "지수"] },
  { code: ".SOX",      name: "필라델피아반도체", market: "US IDX",  keywords: ["반도체", "필라델피아", "sox", "지수"] },
  // 매크로 - 에너지 (원유/가스)
  { code: "CL=F",      name: "WTI 원유",        market: "OIL",     keywords: ["wti", "원유", "유가", "오일", "oil", "cl=f", "clcv1", "원자재", "에너지", "매크로"] },
  { code: "BZ=F",      name: "브렌트유",        market: "OIL",     keywords: ["브렌트", "브렌트유", "원유", "유가", "오일", "oil", "bz=f", "brent", "원자재", "에너지", "매크로"] },
  { code: "NG=F",      name: "천연가스",        market: "ENERGY",  keywords: ["천연가스", "가스", "ng=f", "원자재", "에너지", "매크로"] },
  // 매크로 - 귀금속/비철 (금/은/구리)
  { code: "GC=F",      name: "국제 금(Gold)",   market: "METALS",  keywords: ["금", "금값", "금가격", "골드", "gold", "gc=f", "gccv1", "원자재", "귀금속", "매크로"] },
  { code: "SI=F",      name: "국제 은(Silver)", market: "METALS",  keywords: ["은", "은값", "은가격", "실버", "silver", "si=f", "sicv1", "원자재", "귀금속", "매크로"] },
  { code: "HG=F",      name: "구리 선물",       market: "METALS",  keywords: ["구리", "코퍼", "copper", "hg=f", "hgcv1", "원자재", "매크로"] },
  // 매크로 - 채권 금리 / 달러 / 환율 / 변동성 / 크립토
  { code: "^TNX",      name: "미 10년 국채",    market: "BOND",    keywords: ["국채", "미10년", "10년물", "금리", "채권", "tnx", "us10y", "매크로"] },
  { code: "^TYX",      name: "미 30년 국채",    market: "BOND",    keywords: ["국채", "미30년", "30년물", "금리", "채권", "tyx", "us30y", "매크로"] },
  { code: "DX-Y.NYB",  name: "달러인덱스",      market: "DXY",     keywords: ["달러인덱스", "달러", "dxy", "usdx", "환율", "매크로"] },
  { code: "FX_USDKRW", name: "원/달러 환율",    market: "FX",      keywords: ["환율", "달러", "원달러", "usdkrw", "fx", "krw", "매크로"] },
  { code: "JPY=X",     name: "달러/엔 환율",    market: "FX",      keywords: ["환율", "엔화", "달러엔", "usdjpy", "jpy", "매크로"] },
  { code: "EURUSD=X",  name: "유로/달러",       market: "FX",      keywords: ["환율", "유로", "유로달러", "eurusd", "eur", "매크로"] },
  { code: "^VIX",      name: "VIX 공포지수",    market: "VIX",     keywords: ["vix", "공포", "공포지수", "변동성", "지수", "매크로"] },
  { code: "BTC-USD",   name: "비트코인(USD)",   market: "CRYPTO",  keywords: ["비트코인", "btc", "코인", "암호화폐", "매크로"] },
];

const ALLOWED_INDEX_CODES = new Set(["KOSPI", "KOSDAQ", "KPI200", "KQI150", "FUT"]);

let $websocket = null;
let $uuid = "";
let $action = "com.antigravity.krstock.ticker";
let $settings = Object.assign({}, DEFAULT_SETTINGS);
let cachedEtfList = null;

const els = {
  main: document.getElementById("main"),
  searchInput: document.getElementById("searchInput"),
  searchBtn: document.getElementById("searchBtn"),
  searchResults: document.getElementById("searchResults"),
  stockCode: document.getElementById("stockCode"),
  applyCodeBtn: document.getElementById("applyCodeBtn"),
  dataSource: document.getElementById("dataSource"),
  refreshInterval: document.getElementById("refreshInterval"),
  urlMode: document.getElementById("urlMode"),
  showExchange: document.getElementById("showExchange"),
  refreshBtn: document.getElementById("refreshBtn"),
  openUrlBtn: document.getElementById("openUrlBtn"),
  statusText: document.getElementById("statusText"),
};

async function fetchJsonWithTimeout(url, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchByDataSource(relayPath, directUrl) {
  const mode = $settings.dataSource || "auto";
  if (mode === "direct") {
    return { data: await fetchJsonWithTimeout(directUrl, 4500), viaMode: "직접 API" };
  }
  if (mode === "relay") {
    return { data: await fetchJsonWithTimeout(`${LOCAL_RELAY_BASE}${relayPath}`, 4500), viaMode: "로컬 릴레이" };
  }
  try {
    return { data: await fetchJsonWithTimeout(`${LOCAL_RELAY_BASE}${relayPath}`, 1800), viaMode: "로컬 릴레이" };
  } catch {
    return { data: await fetchJsonWithTimeout(directUrl, 4500), viaMode: "직접 API" };
  }
}

async function loadEtfList() {
  if (Array.isArray(cachedEtfList) && cachedEtfList.length > 0) {
    return cachedEtfList;
  }
  try {
    const { data } = await fetchByDataSource(
      "/etf",
      "https://finance.naver.com/api/sise/etfItemList.nhn"
    );
    const raw = data?.result?.etfItemList;
    if (Array.isArray(raw) && raw.length > 0) {
      cachedEtfList = raw
        .filter((it) => it && it.itemcode && it.itemname)
        .map((it) => ({
          code: String(it.itemcode).trim(),
          name: String(it.itemname).trim(),
          marketCap: Number(it.marketSum || 0),
        }));
      return cachedEtfList;
    }
  } catch {
    // ignore
  }
  return [];
}

function setStatus(msg, type = "") {
  els.statusText.textContent = msg;
  els.statusText.className = "status-text" + (type ? " " + type : "");
}

function sendEvent(payload) {
  if ($websocket && $websocket.readyState === WebSocket.OPEN) {
    $websocket.send(JSON.stringify(payload));
  }
}

function sendToPlugin(payload) {
  sendEvent({
    event: "sendToPlugin",
    action: $action,
    context: $uuid,
    payload,
  });
}

function saveSettings(partial) {
  $settings = Object.assign({}, $settings, partial);
  sendEvent({
    event: "setSettings",
    context: $uuid,
    payload: $settings,
  });
  sendToPlugin({
    type: "updateSettings",
    settings: $settings,
  });
}

function openNaverPayUrl() {
  sendToPlugin({
    type: "openUrl",
    stockCode: $settings.stockCode,
    urlMode: $settings.urlMode,
  });
}

function addUniqueItem(results, seen, code, name, market) {
  const cleanCode = String(code || "").trim();
  const cleanName = String(name || "").trim();
  if (!cleanCode || !cleanName) return;
  const key = cleanCode.toUpperCase();
  if (seen.has(key)) return;
  seen.add(key);
  results.push({
    code: cleanCode,
    name: cleanName,
    market: market || "KRX",
  });
}

async function searchStocksDirect(query) {
  const q = (query || "").trim();
  if (!q) return { items: [], via: "" };

  const results = [];
  const seen = new Set();
  const qLower = q.toLowerCase();
  const qNoSpace = qLower.replace(/\s+/g, "");

  // 1) 국내 지수 & 해외 선물/지수/매크로 프리셋 우선 매칭
  for (const preset of QUICK_PRESETS) {
    const matched = preset.keywords.some(
      (kw) => kw === qNoSpace || (qNoSpace.length >= 2 && (kw.includes(qNoSpace) || qNoSpace.includes(kw)))
    );
    if (matched) {
      addUniqueItem(results, seen, preset.code, preset.name, preset.market);
    }
  }

  // 2) 선택된 데이터 소스로 국내 주식 자동완성 + 전체 ETF 목록 병렬 조회
  const [acRes, etfRes] = await Promise.allSettled([
    fetchByDataSource(
      `/search?q=${encodeURIComponent(q)}`,
      `https://ac.stock.naver.com/ac?q=${encodeURIComponent(q)}&target=stock,etf,index`
    ).then((r) => r.data),
    loadEtfList(),
  ]);

  const usedSources = [];
  if (results.length > 0) usedSources.push("매크로/지수");

  if (acRes.status === "fulfilled") {
    const rawItems = acRes.value?.result?.items || acRes.value?.items || [];
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      usedSources.push("주식");
      for (const item of rawItems) {
        if (!item || !item.code) continue;
        const code = String(item.code).trim();
        const upper = code.toUpperCase();

        if (ALLOWED_INDEX_CODES.has(upper)) {
          addUniqueItem(results, seen, upper, item.name || upper, "INDEX");
          continue;
        }

        if (!/^[0-9A-Za-z]{6}$/.test(code) || !/\d/.test(code)) continue;
        const isKor =
          item.nationCode === "KOR" ||
          item.nationName === "대한민국" ||
          (typeof item.url === "string" && item.url.includes("/domestic/")) ||
          ["KOSPI", "KOSDAQ", "KONEX", "ETF", "ETN"].includes(
            String(item.typeCode || "").toUpperCase()
          );
        if (!isKor) continue;

        addUniqueItem(
          results,
          seen,
          code,
          item.name || code,
          item.typeCode || item.typeName || "KRX"
        );
      }
    }
  }

  if (etfRes.status === "fulfilled" && Array.isArray(etfRes.value)) {
    const matchedEtfs = etfRes.value
      .filter((etf) => {
        const nameLower = etf.name.toLowerCase();
        const nameNoSpace = nameLower.replace(/\s+/g, "");
        return (
          nameLower.includes(qLower) ||
          nameNoSpace.includes(qNoSpace) ||
          etf.code.toLowerCase() === qLower
        );
      })
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 30);

    if (matchedEtfs.length > 0) {
      usedSources.push("ETF");
      for (const etf of matchedEtfs) {
        addUniqueItem(results, seen, etf.code, etf.name, "ETF");
      }
    }
  }

  // 3) 영문 티커(예: QQQM, SCHD, NVDA) 또는 6자리 코드 직접 조회
  if (results.length === 0 && /^[A-Za-z0-9.=^-]{1,12}$/.test(q)) {
    try {
      const raw = await fetchJsonWithTimeout(`${LOCAL_RELAY_BASE}/quote?code=${encodeURIComponent(q)}`, 4500);
      const yMeta = raw?.chart?.result?.[0]?.meta;
      if (yMeta && yMeta.regularMarketPrice !== undefined) {
        addUniqueItem(
          results,
          seen,
          q.toUpperCase(),
          yMeta.shortName || q.toUpperCase(),
          yMeta.exchangeName || "US"
        );
        usedSources.push("해외티커");
      } else {
        const item = Array.isArray(raw?.datas) ? raw.datas[0] : raw;
        if (item && (item.itemCode || item.closePrice)) {
          addUniqueItem(
            results,
            seen,
            item.itemCode || q,
            item.stockName || q,
            item.stockExchangeName || "KRX"
          );
          usedSources.push("코드");
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    items: results,
    via: usedSources.length > 0 ? `로컬·${usedSources.join("+")}` : "",
  };
}

function renderSearchResults(items, errorMsg, via) {
  if (errorMsg) {
    setStatus(`검색 오류: ${errorMsg}`, "error");
    return;
  }

  els.searchResults.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "검색 결과가 없습니다";
    els.searchResults.appendChild(opt);
    setStatus("일치하는 종목/지수/매크로 지표를 찾지 못했습니다.", "error");
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = `검색 결과 ${items.length}건 중 선택...`;
  els.searchResults.appendChild(placeholder);

  items.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.code;
    opt.dataset.name = item.name;
    const market = item.market || "KRX";
    opt.textContent = `${item.name} (${item.code}) · ${market}`;
    els.searchResults.appendChild(opt);
  });

  const viaText = via ? ` (${via})` : "";
  setStatus(`${items.length}개의 항목을 찾았습니다${viaText}. 목록에서 선택하세요.`, "ok");
}

async function performSearch() {
  const query = els.searchInput.value.trim();
  if (!query) {
    setStatus("검색할 종목명이나 매크로 키워드를 입력하세요.", "error");
    return;
  }

  setStatus("종목 검색 중...");
  try {
    const { items, via } = await searchStocksDirect(query);
    renderSearchResults(items, "", via);
  } catch (err) {
    renderSearchResults([], err.message, "");
  }
}

function syncUiFromSettings() {
  els.stockCode.value = $settings.stockCode || "005930";
  els.dataSource.value = $settings.dataSource || "auto";
  els.refreshInterval.value = String(
    $settings.refreshInterval !== undefined ? $settings.refreshInterval : 10
  );
  els.urlMode.value = $settings.urlMode || "naverPay";
  els.showExchange.checked = $settings.showExchange !== false;
}

els.searchBtn.addEventListener("click", performSearch);
els.searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") performSearch();
});

els.searchResults.addEventListener("change", () => {
  const code = els.searchResults.value;
  if (!code) return;
  const selectedOpt = els.searchResults.options[els.searchResults.selectedIndex];
  const name = selectedOpt?.dataset?.name || "";
  els.stockCode.value = code;
  saveSettings({ stockCode: code, stockName: name });
  setStatus(`선택됨: ${name} (${code}) · 실시간 시세 불러오는 중...`, "ok");
});

els.applyCodeBtn.addEventListener("click", () => {
  const code = els.stockCode.value.trim();
  if (!code) {
    setStatus("종목 코드나 티커를 입력하세요.", "error");
    return;
  }
  saveSettings({ stockCode: code, stockName: "" });
  setStatus(`코드 ${code} 적용됨 · 실시간 시세 불러오는 중...`, "ok");
});

els.stockCode.addEventListener("keydown", (e) => {
  if (e.key === "Enter") els.applyCodeBtn.click();
});

els.dataSource.addEventListener("change", () => {
  saveSettings({ dataSource: els.dataSource.value });
  const label = els.dataSource.options[els.dataSource.selectedIndex]?.text || els.dataSource.value;
  setStatus(`데이터 소스 변경: ${label}`, "ok");
});

els.refreshInterval.addEventListener("change", () => {
  saveSettings({ refreshInterval: Number(els.refreshInterval.value) });
  setStatus("새로고침 주기가 저장되었습니다.", "ok");
});

els.urlMode.addEventListener("change", () => {
  saveSettings({ urlMode: els.urlMode.value });
  setStatus("클릭 시 이동 화면이 저장되었습니다.", "ok");
});

els.showExchange.addEventListener("change", () => {
  saveSettings({ showExchange: els.showExchange.checked });
});

els.refreshBtn.addEventListener("click", () => {
  setStatus("로컬 실시간 시세 조회 중...");
  sendToPlugin({ type: "refreshNow" });
});

els.openUrlBtn.addEventListener("click", () => {
  openNaverPayUrl();
});

const connectSocket = connectElgatoStreamDeckSocket;

function connectElgatoStreamDeckSocket(port, uuid, event, info) {
  let parsedInfo = {};
  try {
    parsedInfo = typeof info === "string" ? JSON.parse(info) : info || {};
  } catch {
    parsedInfo = {};
  }

  $uuid = uuid;
  $action = parsedInfo?.action || "com.antigravity.krstock.ticker";

  if (parsedInfo?.payload?.settings) {
    $settings = Object.assign({}, DEFAULT_SETTINGS, parsedInfo.payload.settings);
    syncUiFromSettings();
  }

  $websocket = new WebSocket("ws://127.0.0.1:" + port);

  $websocket.onopen = () => {
    sendEvent({ event, uuid });
    sendEvent({ event: "getSettings", context: $uuid });
  };

  $websocket.onmessage = (e) => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch {
      return;
    }

    if (data.event === "didReceiveSettings") {
      $settings = Object.assign({}, DEFAULT_SETTINGS, data.payload?.settings || {});
      syncUiFromSettings();
    } else if (data.event === "sendToPropertyInspector") {
      const payload = data.payload || {};
      if (payload.type === "quoteStatus") {
        setStatus(payload.message, payload.ok ? "ok" : "error");
      }
    }
  };
}
