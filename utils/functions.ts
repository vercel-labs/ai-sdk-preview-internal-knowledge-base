export async function fetcher(url: string) {
  return await fetch(url).then((res) => res.json());
}

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}
