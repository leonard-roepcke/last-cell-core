class Timer {
  constructor() {
    this.seconds = 0;
    this.running = false;
    this.intervalId = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  stop() {
    if (!this.running) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.running = false;
  }

  reset() {
    this.stop();
    this.seconds = 0;
  }

  getTime() {
    return this.seconds;
  }
}
