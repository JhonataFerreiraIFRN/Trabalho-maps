// Classe principal para gerenciar tarefas usando Map
class TaskManager {
    constructor() {
        this.STORAGE_KEY = 'taskManager_tasks';
        this.tasks = new Map();
        this.loadFromLocalStorage();
    }
    // Adicionar uma nova tarefa
    addTask(id, description, datetime) {
        // Verificar se a tarefa já existe
        if (this.tasks.has(id)) {
            throw new Error(`Tarefa com ID "${id}" já existe!`);
        }
        // Validar se os campos não estão vazios
        if (!id.trim() || !description.trim() || !datetime.trim()) {
            throw new Error('Todos os campos são obrigatórios!');
        }
        // Criar nova tarefa
        const newTask = {
            id: id.trim(),
            description: description.trim(),
            datetime: datetime,
            createdAt: new Date()
        };
        // Adicionar ao Map
        this.tasks.set(id, newTask);
        // Salvar no localStorage
        this.saveToLocalStorage();
        return true;
    }
    // Buscar tarefa por ID
    getTask(id) {
        return this.tasks.get(id);
    }
    // Listar todas as tarefas
    getAllTasks() {
        return Array.from(this.tasks.values()).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    }
    // Remover tarefa por ID
    removeTask(id) {
        const deleted = this.tasks.delete(id);
        if (deleted) {
            this.saveToLocalStorage();
        }
        return deleted;
    }
    // Verificar se existe tarefa com o ID
    hasTask(id) {
        return this.tasks.has(id);
    }
    // Obter número total de tarefas
    getTaskCount() {
        return this.tasks.size;
    }
    // Limpar todas as tarefas
    clearAllTasks() {
        this.tasks.clear();
        this.saveToLocalStorage();
    }
    // Salvar no localStorage
    saveToLocalStorage() {
        try {
            const tasksArray = Array.from(this.tasks.entries());
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasksArray));
        }
        catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }
    // Carregar do localStorage
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const tasksArray = JSON.parse(stored);
                this.tasks = new Map(tasksArray);
            }
        }
        catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            this.tasks = new Map();
        }
    }
}
// Classe para gerenciar a interface do usuário
class TaskUI {
    constructor() {
        this.taskManager = new TaskManager();
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
    }
    // Inicializar elementos do DOM
    initializeElements() {
        this.taskForm = document.getElementById('task-form');
        this.tasksList = document.getElementById('tasks-list');
        this.searchInput = document.getElementById('search-input');
        this.searchResult = document.getElementById('search-result');
        this.messageDiv = document.getElementById('message');
        if (!this.taskForm || !this.tasksList || !this.searchInput || !this.searchResult || !this.messageDiv) {
            throw new Error('Elementos essenciais do DOM não foram encontrados!');
        }
    }
    // Vincular eventos
    bindEvents() {
        // Evento de submissão do formulário
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });
        // Evento de busca
        const searchBtn = document.getElementById('search-btn');
        searchBtn.addEventListener('click', () => this.handleSearch());
        // Busca ao pressionar Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        // Evento de atualizar lista
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn.addEventListener('click', () => this.renderTasks());
    }
    // Manipular adição de tarefa
    handleAddTask() {
        try {
            const idInput = document.getElementById('task-id');
            const descriptionInput = document.getElementById('task-description');
            const datetimeInput = document.getElementById('task-datetime');
            const id = idInput.value;
            const description = descriptionInput.value;
            const datetime = datetimeInput.value;
            this.taskManager.addTask(id, description, datetime);
            // Limpar formulário
            this.taskForm.reset();
            // Atualizar lista
            this.renderTasks();
            // Mostrar mensagem de sucesso
            this.showMessage(`Tarefa "${id}" adicionada com sucesso!`, 'success');
        }
        catch (error) {
            this.showMessage(error instanceof Error ? error.message : 'Erro ao adicionar tarefa', 'error');
        }
    }
    // Manipular busca
    handleSearch() {
        const searchId = this.searchInput.value.trim();
        if (!searchId) {
            this.searchResult.innerHTML = '<p>Digite um ID para buscar.</p>';
            return;
        }
        const task = this.taskManager.getTask(searchId);
        if (task) {
            const formattedDate = this.formatDateTime(task.datetime);
            this.searchResult.innerHTML = `
                <div class="task-item">
                    <div class="task-info">
                        <h3>ID: ${task.id}</h3>
                        <p><strong>Descrição:</strong> ${task.description}</p>
                        <p><strong>Data/Hora:</strong> ${formattedDate}</p>
                    </div>
                </div>
            `;
        }
        else {
            this.searchResult.innerHTML = `<p>Tarefa com ID "${searchId}" não encontrada.</p>`;
        }
    }
    // Renderizar lista de tarefas
    renderTasks() {
        const tasks = this.taskManager.getAllTasks();
        if (tasks.length === 0) {
            this.tasksList.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhuma tarefa cadastrada</h3>
                    <p>Adicione sua primeira tarefa usando o formulário acima.</p>
                </div>
            `;
            return;
        }
        this.tasksList.innerHTML = tasks.map(task => `
            <div class="task-item">
                <div class="task-info">
                    <h3>${task.id}</h3>
                    <p>${task.description}</p>
                    <div class="task-datetime">${this.formatDateTime(task.datetime)}</div>
                </div>
                <button class="delete-btn" onclick="taskUI.removeTask('${task.id}')">
                    Remover
                </button>
            </div>
        `).join('');
    }
    // Remover tarefa (método público para ser chamado pelo onclick)
    removeTask(id) {
        if (confirm(`Tem certeza que deseja remover a tarefa "${id}"?`)) {
            const removed = this.taskManager.removeTask(id);
            if (removed) {
                this.renderTasks();
                this.showMessage(`Tarefa "${id}" removida com sucesso!`, 'success');
                // Limpar resultado da busca se for a tarefa removida
                if (this.searchInput.value === id) {
                    this.searchResult.innerHTML = '';
                    this.searchInput.value = '';
                }
            }
            else {
                this.showMessage(`Erro ao remover tarefa "${id}"`, 'error');
            }
        }
    }
    // Mostrar mensagem de feedback
    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.className = `message ${type}`;
        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            this.messageDiv.className = 'message hidden';
        }, 3000);
    }
    // Formatar data e hora para exibição
    formatDateTime(datetime) {
        const date = new Date(datetime);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
// Variável global para acessar a instância da UI
let taskUI;
// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    try {
        taskUI = new TaskUI();
        console.log('Aplicação TaskManager inicializada com sucesso!');
        console.log('Estrutura de dados utilizada: Map (ES6)');
    }
    catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        alert('Erro ao inicializar a aplicação. Verifique o console para mais detalhes.');
    }
});
