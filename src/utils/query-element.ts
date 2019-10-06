import IConfiguration from '../models/configuration';
import IHighlightOptions from '../models/highlight-options';
import defer, { IDeferredPromise } from './defer';

export default function queryElement(
  defaults: IConfiguration,
  options: IHighlightOptions,
): IDeferredPromise<HTMLElement> {
  const deferred: IDeferredPromise<HTMLElement> = defer();

  if (options.element instanceof HTMLElement) {
    deferred.resolve(options.element);
    return deferred;
  }

  const context = options.context || document;

  let element = context.querySelector<HTMLElement>(options.element as string);

  if (element) {
    deferred.resolve(element);
    return deferred;
  }

  const shouldWait =
    options.wait === undefined ? defaults.highlightOptions.wait : options.wait;

  if (!shouldWait) {
    deferred.reject("Can't find the element.");
    return deferred;
  }

  const delay =
    options.waitDelay === undefined
      ? defaults.highlightOptions.waitDelay
      : options.waitDelay;
  const maxWait =
    options.maxWait === undefined
      ? defaults.highlightOptions.maxWait
      : options.maxWait;
  const selector = options.element as string;

  let elapsedTime = 0;
  const interval = setInterval(() => {
    elapsedTime += delay;

    if (elapsedTime > maxWait) {
      deferred.reject("Max wait reached. Can't find the element.");
    }

    element = context.querySelector(selector);

    if (element) {
      deferred.resolve(element);
    }
  }, delay);

  // tslint:disable-next-line: no-floating-promises
  deferred.promise.finally(() => {
    clearInterval(interval);
  });

  return deferred;
}
