export function assetPath(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return encodeURI(path)
}
