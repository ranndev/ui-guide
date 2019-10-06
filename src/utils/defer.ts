'use strict';

export interface IDeferredPromise<ResolveValue = any> {
  promise: Promise<ResolveValue>;
  resolve(value: ResolveValue): void;
  reject(reason: any): void;
}

export default function defer<ResolveValue>(): IDeferredPromise<ResolveValue> {
  const deferred: any = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}
