import IGlobalConfiguration from '../models/global-configuration';
import IHighlightOptions from '../models/highlight-options';
import defer, { IDeferredPromise } from './defer';

export default function queryWaitElement(
  defaults: IGlobalConfiguration,
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

  const waitOptions =
    options.wait === undefined ? defaults.highlightOptions.wait : options.wait;

  if (!waitOptions) {
    deferred.reject("Can't find the target element.");
    return deferred;
  }

  const delay =
    typeof waitOptions === 'boolean'
      ? defaults.highlightOptions.wait.delay
      : waitOptions.delay === undefined
      ? defaults.highlightOptions.wait.delay
      : waitOptions.delay;
  const max =
    typeof waitOptions === 'boolean'
      ? defaults.highlightOptions.wait.max
      : waitOptions.max === undefined
      ? defaults.highlightOptions.wait.max
      : waitOptions.max;
  const selector = options.element;

  let elapsedTime = 0;
  const interval = setInterval(() => {
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
    clearInterval(interval);
  });

  return deferred;
}
