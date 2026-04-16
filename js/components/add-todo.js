import Alert from './alert.js';

export default class AddTodo {
  constructor() {
    this.btn = document.getElementById('add');
    this.form = this.btn.closest('form');
    this.title = document.getElementById('title');
    this.description = document.getElementById('description');
    this.dueDate = document.getElementById('due-date');

    this.alert = new Alert('alert');
  }

  onClick(callback) {
    const submit = (e) => {
      if (e) {
        e.preventDefault();
      }

      const titleValue = this.title.value.trim();
      const descriptionValue = this.description.value.trim();

      if (!titleValue || !descriptionValue) {
        this.alert.show('Title and description are required');
        return;
      }

      const dueDateValue = this.dueDate.value;
      if (dueDateValue) {
        const selectedDate = new Date(dueDateValue);
        if (Number.isNaN(selectedDate.getTime())) {
          this.alert.show('Due date is invalid');
          return;
        }

        const now = new Date();
        now.setSeconds(0, 0);

        if (selectedDate < now) {
          this.alert.show('Due date cannot be earlier than the current date and time');
          return;
        }
      }

      this.alert.hide();

      const dueDateIso = dueDateValue ? new Date(dueDateValue).toISOString() : null;
      callback(titleValue, descriptionValue, dueDateIso);

      this.title.value = '';
      this.description.value = '';
      this.dueDate.value = '';
      this.title.focus();
    };

    this.btn.onclick = submit;
    if (this.form) {
      this.form.onsubmit = submit;
    }
  }
}
