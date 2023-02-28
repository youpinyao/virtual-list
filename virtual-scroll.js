class VirtualScroll {
  options;
  x = 0;
  y = 0;
  startX;
  startY;
  pageX;
  pageY;
  timestamp;
  moveTimestamp;
  distance;
  isTouchStart = false;
  requestAnimationFrame;

  constructor(options) {
    this.options = options;
    this.handleMousewheel = this.handleMousewheel.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.create();
  }

  create() {
    this.onEvent();
  }

  destroy() {
    this.offEvent();
  }

  isMobile() {
    return /iphone|android/g.test(navigator.userAgent.toLowerCase());
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
    if (this.isMobile()) {
      this.getTarget().addEventListener("touchstart", this.handleTouchStart);
      this.getTarget().addEventListener("touchmove", this.handleTouchMove);
      this.getTarget().addEventListener("touchend", this.handleTouchEnd);
      this.getTarget().addEventListener("touchcancel", this.handleTouchEnd);
    } else {
      this.getTarget().addEventListener("mousewheel", this.handleMousewheel);
    }
  }
  offEvent() {
    if (this.isMobile()) {
      this.getTarget().removeEventListener("touchstart", this.handleTouchStart);
      this.getTarget().removeEventListener("touchmove", this.handleTouchMove);
      this.getTarget().removeEventListener("touchend", this.handleTouchEnd);
      this.getTarget().removeEventListener("touchcancel", this.handleTouchEnd);
    } else {
      this.getTarget().removeEventListener("mousewheel", this.handleMousewheel);
    }
  }
  handleMousewheel(e) {
    this.setY(this.getY() - e.deltaY);
    this.getContent().style.transform = this.getTransform();
  }
  handleTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isTouchStart = true;
    this.startX = this.getX();
    this.startY = this.getY();
    this.pageX = e.touches[0].pageX;
    this.pageY = e.touches[0].pageY;
    this.timestamp = Date.now();
    cancelAnimationFrame(this.requestAnimationFrame);
  }
  handleTouchMove(e) {
    if (!this.isTouchStart) return;
    e.preventDefault();
    e.stopPropagation();
    this.setY(this.startY + e.touches[0].pageY - this.pageY);
    this.getContent().style.transform = this.getTransform();
    this.distance = e.touches[0].pageY - this.pageY;
    this.moveTimestamp = Date.now();
  }
  handleTouchEnd(e) {
    this.isTouchStart = false;
    this.slowAction();
  }
  slowAction() {
    const distance = this.distance;
    const time = Date.now() - this.timestamp;
    const moveTime = Date.now() - this.moveTimestamp;
    let step = (Math.abs(distance) / time) * 20;

    cancelAnimationFrame(this.requestAnimationFrame);

    if (moveTime > 20) return;

    const req = () => {
      this.requestAnimationFrame = requestAnimationFrame(() => {
        this.setY(this.getY() + step * (distance > 0 ? 1 : -1));
        this.getContent().style.transform = this.getTransform();

        step -= step * 0.05;
        step > 0.5 && req();
      });
    };
    req();
  }
}
