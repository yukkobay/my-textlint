export function makeWorker(path: string) {
  if (typeof window !== 'undefined') {
    return new Worker(path)
  }

  return undefined
}
