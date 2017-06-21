document.body.addEventListener('ajax:success', function(event) {
  const [data, status, xhr] = event.detail;
  const { target } = event;

  if (target.className.split(' ').includes('trash-button')) {
    const element = document.querySelector(`[data-id="${data.id}"]`);
    if (element) {
      element.parentNode.removeChild(element);
    }
  }
});
