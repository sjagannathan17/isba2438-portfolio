export function logApiCall({ method, route, status, id = null }) {
  const line = `${new Date().toISOString()} [api] ${method} ${route} -> ${status}${id ? ` id=${id}` : ""}`;
  console.log(line);
}
