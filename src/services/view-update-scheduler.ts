export default class ViewUpdateScheduler<Data> {
  private scheduledUpdate = {
    animationFrameId: 0,
    timeoutId: 0,
  };

  public schedUpdate(
    updateFn: (data: Data) => void,
    data: Data,
    delay: number,
  ) {
    this.cancelCurrentScheduledUpdate();
    this.update(data, updateFn, delay);
  }

  public cancelCurrentScheduledUpdate() {
    window.cancelAnimationFrame(this.scheduledUpdate.animationFrameId);
    window.clearTimeout(this.scheduledUpdate.timeoutId);
  }

  private update(data: Data, updateFn: (data: Data) => void, delay: number) {
    this.scheduledUpdate.animationFrameId = window.requestAnimationFrame(() => {
      updateFn(data);

      this.scheduledUpdate.timeoutId = window.setTimeout(() => {
        this.update(data, updateFn, delay);
      }, delay);
    });
  }
}
