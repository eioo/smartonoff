export function tabHandler() {
  const menuItems = Array.from(document.querySelectorAll('.menu .item'));

  for (const item of menuItems) {
    item.addEventListener('click', e => {
      const target = e.target as HTMLAnchorElement;
      const tabID = target.getAttribute('data-tab') as string;

      switchTab(tabID);
    });
  }
}

function switchTab(id: string): void {
  const targetItem = document.querySelector(`.menu .item[data-tab="${id}"]`);
  const targetPane = document.querySelector(`.tab[data-tab="${id}"]`);

  if (!targetItem || !targetPane || targetItem.classList.contains('disabled')) {
    return;
  }

  const activeElements = Array.from(
    document.querySelectorAll('.menu .item.active, .tab.active')
  );

  activeElements.map(item => item.classList.remove('active'));

  targetItem.classList.add('active');
  targetPane.classList.add('active');
}
