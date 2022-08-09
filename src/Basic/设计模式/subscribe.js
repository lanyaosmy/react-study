class Event {
  constructor() {
    this.events = {};
  }

  subscribe(event, cb) {
    if (this.events[event]) {
      this.events.push(cb);
    } else {
      this.events = [cb];
    }
  }

  unsubscribe(event, cb) {
    if (this.events[event]) {
      const index = this.events[event].findIndex((v) => v === cb);
      if (index !== -1) this.events[event].splice(index, 1);
    }
  }

  publish(event, ...args) {
    const arr = this.events[event];
    if (arr) {
      arr.forEach((cb) => {
        cb.call(this, ...args);
      });
    }
  }
}
