import IEvents from '../models/events';
import IStates from '../models/states';

export default function createElementsUpdater(states: IStates) {
  function update(ref: number, updateFn: IEvents['onElementsUpdate']) {
    if (ref !== states.currentUpdateSession.ref) return;

    requestAnimationFrame(() => {
      if (ref !== states.currentUpdateSession.ref) return;

      updateFn(states.elements, states.popper);

      setTimeout(() => {
        update(ref, updateFn);
      }, states.currentUpdateSession.delay);
    });
  }

  return function preupdate(updateFn: IEvents['onElementsUpdate']) {
    states.currentUpdateSession.ref += 1;
    update(states.currentUpdateSession.ref, updateFn);
  };
}
