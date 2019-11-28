import IHighlightOptions from '../models/highlight-options';
import Config from '../services/config';
import defer, { IDeferredPromise } from './defer';

export default function queryWaitElement(
  config: Config['data'],
  options: IHighlightOptions,
): IDeferredPromise<HTMLElement> {
  const deferred: IDeferredPromise<HTMLElement> = defer();

  if (options.target instanceof Element) {
    deferred.resolve(options.target as HTMLElement);
    return deferred;
  }

  const context = options.context || document;
  let element = context.querySelector<HTMLElement>(options.target);

  if (element) {
    deferred.resolve(element);
    return deferred;
  }

  const waitOptions = options.wait ?? config.highlightOptions.wait;

  if (!waitOptions) {
    deferred.reject("Can't find the target element.");
    return deferred;
  }

  const delay = typeof waitOptions === 'boolean' ? 0 : waitOptions.delay ?? 0;
  const max =
    typeof waitOptions === 'boolean' ? Infinity : waitOptions.max ?? Infinity;
  const selector = options.target;

  let elapsedTime = 0;
  const interval = window.setInterval(() => {
    elapsedTime += delay;

    if (elapsedTime >= max) {
      deferred.reject("Max wait reached. Can't find the element.");
    }

    element = context.querySelector(selector);

    if (element) {
      deferred.resolve(element);
    }
  }, delay);

  // tslint:disable-next-line: no-floating-promises
  deferred.promise.finally(() => {
    window.clearInterval(interval);
  });

  return deferred;
}
