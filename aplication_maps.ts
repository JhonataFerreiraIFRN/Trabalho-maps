// Interface para definir a estrutura de uma tarefa
interface Task {
    id: string;
    description: string;
    datetime: string;
    createdAt: Date;
}

// Classe principal para gerenciar tarefas usando Map
class TaskManager {
    private tasks: Map<string, Task>;
    private readonly STORAGE_KEY = 'taskManager_tasks';

    constructor() {
        this.tasks = new Map<string, Task>();
        this.loadFromLocalStorage();
    }

    // Adicionar uma nova tarefa
    addTask(id: string, description: string, datetime: string): boolean {
        // Verificar se a tarefa já existe
        if (this.tasks.has(id)) {
            throw new Error(`Tarefa com ID "${id}" já existe!`);
        }

        // Validar se os campos não estão vazios
        if (!id.trim() || !description.trim() || !datetime.trim()) {
            throw new Error('Todos os campos são obrigatórios!');
        }

        // Criar nova tarefa
        const newTask: Task = {
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
    getTask(id: string): Task | undefined {
        return this.tasks.get(id);
    }

    // Listar todas as tarefas
    getAllTasks(): Task[] {
        return Array.from(this.tasks.values()).sort((a, b) => 
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );
    }

    // Remover tarefa por ID
    removeTask(id: string): boolean {
        const deleted = this.tasks.delete(id);
        if (deleted) {
            this.saveToLocalStorage();
        }
        return deleted;
    }

    // Verificar se existe tarefa com o ID
    hasTask(id: string): boolean {
        return this.tasks.has(id);
    }

    // Obter número total de tarefas
    getTaskCount(): number {
        return this.tasks.size;
    }

    // Limpar todas as tarefas
    clearAllTasks(): void {
        this.tasks.clear();
        this.saveToLocalStorage();
    }

    // Salvar no localStorage
    private saveToLocalStorage(): void {
        try {
            const tasksArray = Array.from(this.tasks.entries());
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasksArray));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }

    // Carregar do localStorage
    private loadFromLocalStorage(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const tasksArray: [string, Task][] = JSON.parse(stored);
                this.tasks = new Map(tasksArray);
            }
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            this.tasks = new Map();
        }
    }
}

// Classe para gerenciar a interface do usuário
class TaskUI {
    private taskManager: TaskManager;
    private taskForm: HTMLFormElement;
    private tasksList: HTMLElement;
    private searchInput: HTMLInputElement;
    private searchResult: HTMLElement;
    private messageDiv: HTMLElement;

    constructor() {
        this.taskManager = new TaskManager();
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
    }

    // Inicializar elementos do DOM
    private initializeElements(): void {
        this.taskForm = document.getElementById('task-form') as HTMLFormElement;
        this.tasksList = document.getElementById('tasks-list') as HTMLElement;
        this.searchInput = document.getElementById('search-input') as HTMLInputElement;
        this.searchResult = document.getElementById('search-result') as HTMLElement;
        this.messageDiv = document.getElementById('message') as HTMLElement;

        if (!this.taskForm || !this.tasksList || !this.searchInput || !this.searchResult || !this.messageDiv) {
            throw new Error('Elementos essenciais do DOM não foram encontrados!');
        }
    }

    // Vincular eventos
    private bindEvents(): void {
        // Evento de submissão do formulário
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Evento de busca
        const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
        searchBtn.addEventListener('click', () => this.handleSearch());

        // Busca ao pressionar Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Evento de atualizar lista
        const refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement;
        refreshBtn.addEventListener('click', () => this.renderTasks());
    }

    // Manipular adição de tarefa
    private handleAddTask(): void {
        try {
            const idInput = document.getElementById('task-id') as HTMLInputElement;
            const descriptionInput = document.getElementById('task-description') as HTMLInputElement;
            const datetimeInput = document.getElementById('task-datetime') as HTMLInputElement;

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

        } catch (error) {
            this.showMessage(error instanceof Error ? error.message : 'Erro ao adicionar tarefa', 'error');
        }
    }

    // Manipular busca
    private handleSearch(): void {
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
        } else {
            this.searchResult.innerHTML = `<p>Tarefa com ID "${searchId}" não encontrada.</p>`;
        }
    }

    // Renderizar lista de tarefas
    private renderTasks(): void {
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
    public removeTask(id: string): void {
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
            } else {
                this.showMessage(`Erro ao remover tarefa "${id}"`, 'error');
            }
        }
    }

    // Mostrar mensagem de feedback
    private showMessage(text: string, type: 'success' | 'error'): void {
        this.messageDiv.textContent = text;
        this.messageDiv.className = `message ${type}`;
        
        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            this.messageDiv.className = 'message hidden';
        }, 3000);
    }

    // Formatar data e hora para exibição
    private formatDateTime(datetime: string): string {
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
let taskUI: TaskUI;

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    try {
        taskUI = new TaskUI();
        console.log('Aplicação TaskManager inicializada com sucesso!');
        console.log('Estrutura de dados utilizada: Map (ES6)');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        alert('Erro ao inicializar a aplicação. Verifique o console para mais detalhes.');
    }
});
