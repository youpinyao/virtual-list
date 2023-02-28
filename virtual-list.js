class VirtualList {
  constructor(options) {
    this.options = options;
    this.handleScroll = this.handleScroll.bind(this);
    this.create();
  }

  getTarget() {
    return this.options.virtualScroll.getTarget().firstElementChild;
  }

  getRoot() {
    return this.options.virtualScroll.getTarget();
  }

  getScrollTop() {
    return Math.abs(this.options.virtualScroll.getY());
  }

  create() {
    this.onIntersectionObserver();
    this.render();
  }

  destroy() {
    this.offIntersectionObserver();
    this.getTarget().innerHTML = "";
  }

  addPlaceholderHeight(height) {
    const placeholder = this.getPlaceholder();
    placeholder.style.height = placeholder.clientHeight + height + "px";
    this.locked = true;
  }

  removePlaceholderHeight(height) {
    const placeholder = this.getPlaceholder();
    placeholder.style.height = placeholder.clientHeight - height + "px";
    this.locked = true;
  }

  getPlaceholder() {
    if (!this.placeholder) {
      this.placeholder = document.createElement("div");
      this.getTarget().insertBefore(
        this.placeholder,
        this.getTarget().firstElementChild
      );
    }
    return this.placeholder;
  }

  render() {
    const { options } = this;
    const { max = 10, items } = options;
    const container = this.getContainer();

    [...items].splice(0, max * 2).forEach((item, index) => {
      item.setAttribute("data-index", index);
      container.appendChild(item);
      this.intersectionObserver.observe(item);
    });
  }

  getContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.getTarget().appendChild(this.container);
    }
    return this.container;
  }

  onIntersectionObserver() {
    const intersectionObserver = new IntersectionObserver(this.handleScroll, {
      root: this.getRoot(),
    });

    this.intersectionObserver = intersectionObserver;
  }
  removeFirstChild(length) {
    const container = this.getContainer();
    let height = 0;

    for (let index = 0; index <= length; index++) {
      height += container.firstElementChild.clientHeight;
      this.intersectionObserver.unobserve(container.firstElementChild);
      container.removeChild(container.firstElementChild);
    }

    this.addPlaceholderHeight(height);
  }

  addFirstChild(length) {
    const { options } = this;
    const { items } = options;
    const container = this.getContainer();
    const originalIndex = parseInt(
      container.firstElementChild.getAttribute("data-index")
    );
    let height = 0;

    for (
      let index = originalIndex - 1;
      index >= originalIndex - length;
      index--
    ) {
      if (index < 0) break;
      container.insertBefore(items[index], container.firstElementChild);
      this.intersectionObserver.observe(container.firstElementChild);
      height += container.firstElementChild.clientHeight;
    }

    this.removePlaceholderHeight(height);
  }
  removeLastChild(length) {
    const container = this.getContainer();

    for (let index = 0; index <= length; index++) {
      this.intersectionObserver.unobserve(container.lastElementChild);
      container.removeChild(container.lastElementChild);
    }
  }
  addLastChild(length) {
    const { options } = this;
    const { items } = options;
    const container = this.getContainer();
    const originalIndex = parseInt(
      container.lastElementChild.getAttribute("data-index")
    );

    for (
      let index = originalIndex + 1;
      index <= originalIndex + length;
      index++
    ) {
      if (index >= items.length) break;
      const item = items[index];

      item.setAttribute("data-index", index);
      container.appendChild(item);
      this.intersectionObserver.observe(container.lastElementChild);
    }
  }

  handleScroll(e) {
    const { options } = this;
    const { max } = options;
    const container = this.getContainer();
    const children = [...container.children];
    let preVisible;

    if (this.locked) {
      this.locked = false;
      return;
    }

    if (e && e.length === 1 && e[0].target === children[0]) {
      return;
    }
    if (e && e.length === 1 && e[0].target === children[children.length - 1]) {
      return;
    }

    children.forEach((entry, index) => {
      const scrollTop = this.getScrollTop();
      const offsetTop = entry.offsetTop;

      const visible =
        offsetTop + entry.clientHeight > scrollTop &&
        offsetTop < scrollTop + this.getRoot().clientHeight;

      if (preVisible === false && visible === true) {
        if (index >= max) {
          this.removeFirstChild(index - max);
        } else {
          this.addFirstChild(max - index);
        }
      }

      if (preVisible === true && visible === false) {
        const distance = container.children.length - 1 - index;

        if (distance >= max) {
          this.removeLastChild(distance - max);
        } else {
          this.addLastChild(max - distance);
        }
      }
      preVisible = visible;
    });
  }

  offIntersectionObserver() {
    this.intersectionObserver?.disconnect();
  }
}
