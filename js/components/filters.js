export default class Filters {
  constructor() {
    this.form = document.getElementById('filters');
    this.btn = document.getElementById('search');
    this.dueStatus = document.getElementById('due-status-filter');
    this.setDueStatusOptions();
  }

  setDueStatusOptions() {
    if (!this.dueStatus) {
      return;
    }

    const options = [
      { value: 'all', label: 'Todas' },
      { value: 'overdue', label: 'Vencidas' },
      { value: 'soon', label: 'Proximas a vencer' },
      { value: 'future', label: 'Futuras' },
      { value: 'none', label: 'Sin fecha' },
    ];

    this.dueStatus.innerHTML = '';
    for (const optionData of options) {
      const option = document.createElement('option');
      option.value = optionData.value;
      option.innerText = optionData.label;
      this.dueStatus.appendChild(option);
    }

    this.dueStatus.value = 'all';
  }

  onClick(callback) {
    this.btn.onclick = (e) => {
      e.preventDefault();
      const data = new FormData(this.form);
      callback({
        type: data.get('type') || 'all',
        dueStatus: data.get('dueStatus') || 'all',
        words: data.get('words'),
      });
    }
  }
}
