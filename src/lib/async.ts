import { AsyncLocalStorage } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<string>();

export function withRequestId<T>(
  requestId: string,
  handler: (getRequestId: () => string) => T,
) {
  return asyncLocalStorage.run(requestId, () => {
    return handler(getRequestId);
  });
}

export function getRequestId(): string {
  return asyncLocalStorage.getStore()!;
}
