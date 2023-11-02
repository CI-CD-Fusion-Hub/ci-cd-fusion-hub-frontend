app.config.globalProperties.$showConfirmation = (message, title) => {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    const component = app.component('ConfirmationDialog');
    const instance = app.mount(div);
    const close = () => {
      instance.$destroy();
      div.remove();
      reject();
    };
    instance.$once('close', close);
    instance.$once('confirm', () => {
      instance.$destroy();
      div.remove();
      resolve();
    });
    document.body.appendChild(div);
  });
};