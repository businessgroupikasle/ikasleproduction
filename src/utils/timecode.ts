/** Formats seconds as a 24 fps timecode, e.g. 00:00:12:08. */
export function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const frames = Math.floor((seconds % 1) * 24)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`
}
