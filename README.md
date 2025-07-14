# Agendador de Tarefas - Aplicação Web com Map/HashTable

## Descrição do Projeto

Esta aplicação web foi desenvolvida como parte da avaliação de Estruturas de Dados, demonstrando o uso prático de **Map (ES6)** como estrutura central de armazenamento de dados. O projeto implementa um sistema completo de agendamento de tarefas com operações CRUD (Create, Read, Update, Delete).

## Arquitetura e Estrutura de Dados

### Estrutura Principal: Map (ES6)
A aplicação utiliza a estrutura de dados **Map** do JavaScript ES6 como mecanismo principal de armazenamento. O Map oferece:

- **Chaves únicas**: Cada tarefa possui um ID único como chave
- **Acesso O(1)**: Busca, inserção e remoção em tempo constante
- **Iteração ordenada**: Mantém a ordem de inserção dos elementos
- **Flexibilidade de tipos**: Permite chaves de qualquer tipo

### Interface da Tarefa
```typescript
interface Task {
    id: string;           // Identificador único da tarefa
    description: string;  // Descrição da tarefa
    datetime: string;     // Data e horário no formato ISO
    createdAt: Date;      // Timestamp de criação
}
```

## Funcionalidades Implementadas

###  Operações CRUD Completas

1. **CREATE (Adicionar)**
   - Formulário para inserção de novas tarefas
   - Validação de campos obrigatórios
   - Verificação de IDs duplicados
   - Feedback visual de sucesso/erro

2. **READ (Buscar/Listar)**
   - Busca individual por ID da tarefa
   - Listagem completa de todas as tarefas
   - Ordenação automática por data/horário
   - Exibição formatada de dados

3. **UPDATE (Atualizar)**
   - Interface para atualização da lista
   - Sincronização automática com localStorage

4. **DELETE (Remover)**
   - Remoção individual de tarefas
   - Confirmação antes da exclusão
   - Atualização automática da interface

### Recursos Adicionais

- **Persistência Local**: Utiliza localStorage para manter dados entre sessões
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Tratamento de Erros**: Validações e mensagens de feedback
- **Formatação de Datas**: Exibição em formato brasileiro (dd/mm/aaaa hh:mm)
- **Animações CSS**: Transições suaves e feedback visual

## Estrutura de Arquivos

```
projeto/
├── index.html      # Estrutura HTML da aplicação
├── styles.css      # Estilos e layout responsivo
├── aplication_maps.ts          # Código TypeScript principal
├── aplication_maps.js          # JavaScript compilado
└── README.md       # Documentação do projeto
```

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilos modernos com Flexbox/Grid e animações
- **TypeScript**: Linguagem principal com tipagem estática
- **JavaScript ES6**: Map, Classes, Arrow Functions, Template Literals
- **LocalStorage API**: Persistência de dados no navegador

## Como Executar

1. **Pré-requisitos**:
   - Navegador web moderno (Chrome, Firefox, Safari, Edge)
   - TypeScript instalado (para desenvolvimento)

2. **Execução**:
   ```bash
   # Abrir diretamente no navegador
   open index.html
   
   # Ou servir via servidor local
   python -m http.server 8000
   # Acessar: http://localhost:8000
   ```

3. **Desenvolvimento**:
   ```bash
   # Compilar TypeScript
   tsc aplication_maps.ts --target ES6 --lib ES6,DOM
   ```

## Interface do Usuário

### Layout Responsivo
- **Desktop**: Layout em grid com duas colunas
- **Mobile**: Layout em coluna única com elementos empilhados
- **Cores**: Gradiente roxo/azul com elementos em branco
- **Tipografia**: Segoe UI para melhor legibilidade

### Componentes Principais
1. **Cabeçalho**: Título e descrição da aplicação
2. **Formulário de Adição**: Campos para ID, descrição e data/hora
3. **Seção de Busca**: Campo de busca com resultado destacado
4. **Lista de Tarefas**: Exibição de todas as tarefas com botões de ação
5. **Mensagens de Feedback**: Notificações de sucesso/erro

## Demonstração das Operações

### Adicionar Tarefa
```typescript
// Exemplo de uso interno
taskManager.addTask("TASK001", "Reunião com cliente", "2025-07-15T14:30");
```

### Buscar Tarefa
```typescript
// Busca por ID
const task = taskManager.getTask("TASK001");
```

### Listar Tarefas
```typescript
// Obter todas as tarefas ordenadas
const allTasks = taskManager.getAllTasks();
```

### Remover Tarefa
```typescript
// Remover por ID
const removed = taskManager.removeTask("TASK001");
```

## Conceitos de Estruturas de Dados Demonstrados

- **Map como HashTable**: Implementação prática de tabela hash
- **Complexidade O(1)**: Operações eficientes de busca e inserção
- **Chaves únicas**: Garantia de unicidade através do Map
- **Iteração ordenada**: Aproveitamento da ordem de inserção
- **Persistência**: Serialização/deserialização de estruturas de dados

## Conclusão

Aplicação demonstra com sucesso o uso prático de estruturas de dados Map em um contexto real de desenvolvimento web. O projeto atende a todos os requisitos propostos e inclui recursos extras que demonstram compreensão avançada tanto das estruturas de dados quanto das tecnologias web modernas.

A implementação é robusta, bem documentada e pronta para apresentação, servindo como exemplo prático de como estruturas de dados fundamentais podem ser aplicadas em soluções web funcionais e atrativas.

