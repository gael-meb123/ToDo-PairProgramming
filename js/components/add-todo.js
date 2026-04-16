import Alert from './alert.js';

export default class AddTodo {
  constructor() {
    this.btn = document.getElementById('add');
    this.title = document.getElementById('title');
    this.description = document.getElementById('description');
    this.dueDate = document.getElementById('due-date');

    this.alert = new Alert('alert');
  }

  onClick(callback) {
    this.btn.onclick = () => {
      if (this.title.value === '' || this.description.value === '') {
        this.alert.show('Title and description are required');
        return;
      }

      const dueDateValue = this.dueDate.value;
      if (dueDateValue) {
        const selectedDate = new Date(dueDateValue);
        if (selectedDate < new Date()) {
          this.alert.show('Due date cannot be earlier than the current date and time');
          return;
        }
      }

      this.alert.hide();

      const dueDateIso = dueDateValue ? new Date(dueDateValue).toISOString() : null;
      callback(this.title.value, this.description.value, dueDateIso);
    }
  }
}
