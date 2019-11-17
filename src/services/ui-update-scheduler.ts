import Popper from 'popper.js';
import UI from './ui';

export interface IRequiredElements {
  highlight: { backdrop: HTMLElement; box: HTMLElement };
  popper?: Popper;
  popup?: HTMLElement;
  target: HTMLElement;
}

export type UpdateFn = (elements: IRequiredElements) => void;

export default class UIUpdateScheduler {
  private updateDelay = 0;
  private scheduledUpdate = {
    animationFrameId: 0,
    timeoutId: 0,
  };

  constructor(private ui: UI) {}

  public setUpdateDelay(delay: number) {
    this.updateDelay = delay;
  }

  public scheduleUpdate(updateFn: UpdateFn) {
    const elements = this.ui.getUpdateSchedulerRequiredElements();
    this.cancelCurrentScheduledUpdate();
    this.update(elements, updateFn);
  }

  public cancelCurrentScheduledUpdate() {
    window.cancelAnimationFrame(this.scheduledUpdate.animationFrameId);
    window.clearTimeout(this.scheduledUpdate.timeoutId);
  }

  private update(elements: IRequiredElements, updateFn: UpdateFn) {
    this.scheduledUpdate.animationFrameId = window.requestAnimationFrame(() => {
      updateFn(elements);
      this.scheduledUpdate.timeoutId = window.setTimeout(() => {
        this.update(elements, updateFn);
      }, this.updateDelay);
    });
  }
}
