"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logNonCustomError = logNonCustomError;
function logNonCustomError(error) {
    if (!(error && typeof error === "object" && "timestamp" in error && "statusCode" in error && "message" in error)) {
        console.error(error);
    }
}
