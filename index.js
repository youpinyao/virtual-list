const items = [];

for (let index = 0; index < 100000; index++) {
  const item = document.createElement("div");

  item.innerHTML = index;

  item.className = "item";
  item.style.height = parseInt(Math.random() * 100) + 50 + "px";
  item.style.display = 'flex';
  item.style.color = '#fff';
  item.style.fontSize = '20px';
  item.style.alignItems = 'center';
  item.style.justifyContent = 'center';
  item.style.backgroundColor = `rgba(${parseInt(
    Math.random() * 255
  )}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, 1)`;

  items.push(item);
}

const virtualScroll = new VirtualScroll({
  target: document.querySelector(".list"),
});

new VirtualList({
  virtualScroll,
  items,
  max: 10,
});
