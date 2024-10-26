export function logNonCustomError(error: any): void {
  if (!(error && typeof error === "object" && "timestamp" in error && "statusCode" in error && "message" in error)) {
    console.error(error)
  }
}
