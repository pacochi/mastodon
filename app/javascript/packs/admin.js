document.body.addEventListener('ajax:success', (event) => {
  const [data, status, xhr] = event.detail;
  const { target } = event;

  if (target.className.split(' ').includes('trash-button')) {
    const element = document.querySelector(`[data-id="${data.id}"]`);
    if (element) {
      element.parentNode.removeChild(element);
    }
  }
});

const checkAll = document.querySelector('#batch_checkbox_all');
const checkboxes = [].slice.call(document.querySelectorAll('.batch-checkbox input[type="checkbox"]'));

function changeCheckAll() {
  if (checkAll) {
    checkAll.checked = checkboxes.every((checkbox) => checkbox.checked);
  }
}

if (checkAll) {
  checkAll.addEventListener('change', () => {
    for (const checkbox of checkboxes) {
      checkbox.checked = checkAll.checked;
    }
  });
  if (checkboxes.length) {
    for (const checkbox of checkboxes) {
      checkbox.addEventListener('change', changeCheckAll);
    }
  }
}
