import Alert from './alert.js';

export default class Modal {
  constructor() {
    this.title = document.getElementById('modal-title');
    this.description = document.getElementById('modal-description');
    this.btn = document.getElementById('modal-btn');
    this.completed = document.getElementById('modal-completed');
    this.dueDate = document.getElementById('modal-due-date');
    this.alert = new Alert('modal-alert');

    this.todo = null;
    this.originalDueDate = null;
  }

  formatDueDateForInput(dueDateIso) {
    if (!dueDateIso) {
      return '';
    }

    const date = new Date(dueDateIso);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  }

  setValues(todo) {
    this.todo = todo;
    this.title.value = todo.title;
    this.description.value = todo.description;
    this.completed.checked = todo.completed;
    this.originalDueDate = todo.due_date || null;
    this.dueDate.value = this.formatDueDateForInput(this.originalDueDate);
    this.alert.hide();
  }

  onClick(callback) {
    this.btn.onclick = () => {
      if (!this.title.value || !this.description.value) {
        this.alert.show('Title and description are required');
        return;
      }

      const dueDateValue = this.dueDate.value;
      if (dueDateValue) {
        const selectedDate = new Date(dueDateValue);
        const selectedDateIso = selectedDate.toISOString();
        const isPreviousExpiredDate = this.originalDueDate === selectedDateIso;

        if (selectedDate < new Date() && !isPreviousExpiredDate) {
          this.alert.show('Due date cannot be earlier than the current date and time');
          return;
        }
      }

      this.alert.hide();

      $('#modal').modal('toggle');

      callback(this.todo.id, {
        title: this.title.value,
        description: this.description.value,
        completed: this.completed.checked,
        due_date: dueDateValue ? new Date(dueDateValue).toISOString() : null,
      });
    }
  }
}
