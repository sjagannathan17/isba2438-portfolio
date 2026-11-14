import DottedMap from "dotted-map";

const map = new DottedMap({ height: 110, grid: "diagonal" });

const baseSvg = map.getSVG({ shape: "circle", color: "#c2af87", radius: 0.19 });
const [, , , width, height] = baseSvg
  .match(/viewBox="([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)"/)
  .map(Number);

const cropTop = map.getPin({ lat: 55, lng: 0 }).y;
const cropBottom = map.getPin({ lat: -45, lng: 0 }).y;

export const mapViewBox = `0 ${cropTop.toFixed(2)} ${width} ${(cropBottom - cropTop).toFixed(2)}`;

export const dottedMapSvg = baseSvg.replace(
  /viewBox="[^"]*"/,
  `viewBox="${mapViewBox}"`
);

function clampedPin(lat, lng) {
  const pin = map.getPin({ lat, lng });
  return {
    x: Math.min(Math.max(pin.x, 1), width - 1),
    y: Math.min(Math.max(pin.y, cropTop + 1), cropBottom - 1),
  };
}

export function getPinPosition(lat, lng) {
  const pin = clampedPin(lat, lng);
  return {
    xPercent: (pin.x / width) * 100,
    yPercent: ((pin.y - cropTop) / (cropBottom - cropTop)) * 100,
  };
}

export function getJourneyPathD(latlngs) {
  if (latlngs.length === 0) {
    return "";
  }
  const pts = latlngs.map(({ lat, lng }) => clampedPin(lat, lng));
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const x1 = pts[i - 1].x;
    const y1 = pts[i - 1].y;
    const x2 = pts[i].x;
    const y2 = pts[i].y;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.min(dist * 0.25, 16);
    d += ` Q ${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  return d;
}

function quadLength(p0, p1, p2) {
  let length = 0;
  let prev = p0;
  for (let i = 1; i <= 24; i++) {
    const t = i / 24;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
    length += Math.hypot(x - prev.x, y - prev.y);
    prev = { x, y };
  }
  return length;
}

export function getJourneyFractions(latlngs) {
  if (latlngs.length === 0) {
    return [];
  }
  const pts = latlngs.map(({ lat, lng }) => clampedPin(lat, lng));
  const totals = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const x1 = pts[i - 1].x;
    const y1 = pts[i - 1].y;
    const x2 = pts[i].x;
    const y2 = pts[i].y;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.min(dist * 0.25, 16);
    total += quadLength(pts[i - 1], { x: mx, y: my }, pts[i]);
    totals.push(total);
  }
  return totals.map((value) => (total === 0 ? 0 : value / total));
}
