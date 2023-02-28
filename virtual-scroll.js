class VirtualScroll {
  x = 0;
  y = 0;
  constructor(options) {
    this.options = options;
    this.handleMousewheel = this.handleMousewheel.bind(this);

    this.create();
  }

  create() {
    this.onEvent();
  }

  destroy() {
    this.offEvent();
  }

  getTarget() {
    return this.options.target;
  }
  getContent() {
    return this.options.target.firstElementChild;
  }
  getMaxScroll() {
    return {
      y: this.getContent().clientHeight - this.getTarget().clientHeight,
      x: this.getContent().clientWidth - this.getTarget().clientWidth,
    };
  }
  getY() {
    return this.y;
  }
  getX() {
    return this.x;
  }
  setY(y) {
    if (y > 0) {
      this.y = 0;
      return;
    }
    if (y < -this.getMaxScroll().y) {
      this.y = -this.getMaxScroll().y;
      return;
    }
    this.y = y ?? this.y;
  }
  setX(x) {
    if (x > 0) {
      this.x = 0;
      return;
    }
    if (x < -this.getMaxScroll().x) {
      this.x = -this.getMaxScroll().x;
      return;
    }
    this.x = x ?? this.x;
  }
  getTransform() {
    return `translate3d(${this.x}px, ${this.y}px, 0px)`;
  }

  onEvent() {
    this.getTarget().addEventListener("mousewheel", this.handleMousewheel);
  }
  offEvent() {
    this.getTarget().removeEventListener("mousewheel", this.handleMousewheel);
  }
  handleMousewheel(e) {
    this.setY(this.getY() - e.deltaY);
    this.getContent().style.transform = this.getTransform();
  }
}
