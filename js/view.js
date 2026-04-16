import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';

export default class View {
  constructor() {
    this.model = null;
    this.table = document.getElementById('table');
    this.addTodoForm = new AddTodo();
    this.modal = new Modal();
    this.filters = new Filters();
    

    this.addTodoForm.onClick((title, description, dueDateIso) => this.addTodo(title, description, dueDateIso));
    this.modal.onClick((id, values) => this.editTodo(id, values));
    this.filters.onClick((filters) => this.filter(filters));
  }

  setModel(model) {
    this.model = model;
  }

  render() {
    const todos = this.model.getTodos();
    todos.forEach((todo) => this.createRow(todo));
  }

  getDueDateMeta(dueDateIso) {
    if (!dueDateIso) {
      return {
        status: 'none',
        text: 'Sin fecha',
        badgeClass: 'badge-secondary',
        badgeLabel: 'Sin fecha',
      };
    }

    const dueDate = new Date(dueDateIso);
    if (Number.isNaN(dueDate.getTime())) {
      return {
        status: 'none',
        text: 'Sin fecha',
        badgeClass: 'badge-secondary',
        badgeLabel: 'Sin fecha',
      };
    }

    const formattedDate = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(dueDate);

    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const next24hMs = 24 * 60 * 60 * 1000;

    if (diffMs < 0) {
      return {
        status: 'overdue',
        text: formattedDate,
        badgeClass: 'badge-danger',
        badgeLabel: 'Vencida',
      };
    }

    if (diffMs <= next24hMs) {
      return {
        status: 'soon',
        text: formattedDate,
        badgeClass: 'badge-warning',
        badgeLabel: 'Proxima a vencer',
      };
    }

    return {
      status: 'future',
      text: formattedDate,
      badgeClass: 'badge-success',
      badgeLabel: 'Futura',
    };
  }

  createDueDateCellContent(dueDateIso) {
    const { text, badgeClass, badgeLabel } = this.getDueDateMeta(dueDateIso);
    return `
      <div>${text}</div>
      <span class="badge ${badgeClass} mt-1">${badgeLabel}</span>
    `;
  }

  filter(filters) {
    const { type, dueStatus, words } = filters;
    const [, ...rows] = this.table.getElementsByTagName('tr');
    for (const row of rows) {
      const [title, description, dueDate, completed] = row.children;
      let shouldHide = false;

      if (words) {
        shouldHide = !title.innerText.includes(words)
          && !description.innerText.includes(words)
          && !dueDate.innerText.includes(words);
      }

      const shouldBeCompleted = type === 'completed';
      const isCompleted = completed.children[0].checked;

      if (type !== 'all' && shouldBeCompleted !== isCompleted) {
        shouldHide = true;
      }

      const rowDueStatus = this.getDueDateMeta(row.dataset.dueDateIso || null).status;
      if (dueStatus !== 'all' && rowDueStatus !== dueStatus) {
        shouldHide = true;
      }

      if (shouldHide) {
        row.classList.add('d-none');
      } else {
        row.classList.remove('d-none');
      }
    }
  }

  addTodo(title, description, dueDateIso = null) {
    const todo = this.model.addTodo(title, description, dueDateIso);
    this.createRow(todo);
  }

  toggleCompleted(id) {
    this.model.toggleCompleted(id);
  }

  editTodo(id, values) {
    this.model.editTodo(id, values);
    const row = document.getElementById(id);
    row.dataset.dueDateIso = values.due_date || '';
    row.children[0].innerText = values.title;
    row.children[1].innerText = values.description;
    row.children[2].innerHTML = this.createDueDateCellContent(values.due_date);
    row.children[3].children[0].checked = values.completed;
  }

  removeTodo(id) {
    this.model.removeTodo(id);
    document.getElementById(id).remove();
  }

  createRow(todo) {
    const row = this.table.insertRow();
    row.setAttribute('id', todo.id);
    row.dataset.dueDateIso = todo.due_date || '';
    row.innerHTML = `
      <td>${todo.title}</td>
      <td>${todo.description}</td>
      <td>${this.createDueDateCellContent(todo.due_date)}</td>
      <td class="text-center">

      </td>
      <td class="text-right">

      </td>
    `;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onclick = () => this.toggleCompleted(todo.id);
    row.children[3].appendChild(checkbox);

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-primary', 'mb-1');
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
    editBtn.setAttribute('data-toggle', 'modal');
    editBtn.setAttribute('data-target', '#modal');
    editBtn.onclick = () => {
      const currentTodo = this.model.getTodos().find((modelTodo) => modelTodo.id === todo.id);
      this.modal.setValues({
        id: todo.id,
        title: row.children[0].innerText,
        description: row.children[1].innerText,
        completed: row.children[3].children[0].checked,
        due_date: currentTodo ? currentTodo.due_date : null,
      });
    };
    row.children[4].appendChild(editBtn);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.onclick = () => this.removeTodo(todo.id);
    row.children[4].appendChild(removeBtn);
  }
}
