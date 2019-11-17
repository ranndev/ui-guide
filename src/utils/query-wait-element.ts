import IHighlightOptions from '../models/highlight-options';
import Config from '../services/config';
import defer, { IDeferredPromise } from './defer';

export default function queryWaitElement(
  config: Config['data'],
  options: IHighlightOptions,
): IDeferredPromise<HTMLElement> {
  const deferred: IDeferredPromise<HTMLElement> = defer();

  if (options.element instanceof Element) {
    deferred.resolve(options.element as HTMLElement);
    return deferred;
  }

  const context = options.context || document;
  let element = context.querySelector<HTMLElement>(options.element);

  if (element) {
    deferred.resolve(element);
    return deferred;
  }

  const waitOptions = options.wait ?? config.highlightOptions.wait;

  if (!waitOptions) {
    deferred.reject("Can't find the target element.");
    return deferred;
  }

  const delay =
    typeof waitOptions === 'boolean'
      ? config.highlightOptions.wait.delay
      : waitOptions.delay ?? config.highlightOptions.wait.delay;
  const max =
    typeof waitOptions === 'boolean'
      ? config.highlightOptions.wait.max
      : waitOptions.max ?? config.highlightOptions.wait.max;
  const selector = options.element;

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
