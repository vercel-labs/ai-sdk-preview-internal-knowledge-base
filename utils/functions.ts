export async function fetcher(url: string) {
  return await fetch(url).then((res) => res.json());
}
