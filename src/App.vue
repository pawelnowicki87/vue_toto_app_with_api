<script>
  import StatusFilter from './components/StatusFilter.vue'
  import TodoItem from './components/TodoItem.vue';
import { clearCompletedTasks, createTask, deleteTask, getTasks } from './http-client';

  export default {
    components: {
      StatusFilter,
      TodoItem
    },
    data() {
      // const data = localStorage.getItem('tasks');
      // const tasks = data !== null ? JSON.parse(data) : [];

      return {
        tasks: [],
        title: '',
        activeFilterName: 'all'
      }
    },
    mounted() {
      getTasks().then(data => {
        this.tasks = data;
      })
    },
    watch: {

      tasks: {
        deep: true,
        handler() {
          localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
      }
    },
    computed: {
      remaningTasks() {
        return this.tasks.filter(task => !task.completed);
      },
      completedTasks() {
        return this.tasks.filter(task => task.completed)
      },
      visibleTasks() {
        switch(this.activeFilterName) {
          case 'active':
            return this.remaningTasks;
          case 'completed':
            return this.completedTasks;
          case 'all':
            return this.tasks;
        }
      }
    },
    methods: {
      handleSubmit() {
        if (this.title.trim() === '') {
          return;
        }

        createTask(this.title.trim()).then(data => {
          this.tasks.push(data);
          this.title = '';
        })


      },
      removeTask({ id }) {
        deleteTask(id).then(() => {
          const index = this.tasks.findIndex(task => task.id === id)

          if (index === -1) {
            return
        }
        this.tasks.splice(index, 1)
        })
        
      },
      clearCompleted() {
      clearCompletedTasks()
        .then(() => {
          // Po usunięciu zakończonych zadań, odświeżamy listę
          this.tasks = this.tasks.filter(task => !task.completed);
        })
        .catch(error => {
          this.errorMessage = 'Failed to clear completed tasks: ' + error.message;
        });
      }
    }
  }
</script>

<template>
  <div id="root">
    <div class="todoapp">
      <h1 class="todoapp__title">todos</h1>
      <div class="todoapp__content">
        <header class="todoapp__header">
          <button type="button" class="todoapp__toggle-all"
            data-cy="ToggleAllButton">
          </button>
          <form @submit.prevent="handleSubmit">
            <input v-model="title" data-cy="NewTodoField" type="text" class="todoapp__new-todo" placeholder="What needs to be done?"
              value="">
          </form>
        </header>
        <section class="todoapp__main" data-cy="TodoList">
          <TransitionGroup tag="div" name="list">
            <TodoItem v-for="task in visibleTasks" :key="task.id" :task="task " @remove="removeTask"/>
          </TransitionGroup>

        </section>
        <footer class="todoapp__footer" data-cy="Footer"><span class="todo-count" data-cy="TodosCounter">{{ tasks.filter(task => !task.completed).length }} items
            left</span>
          
          <StatusFilter v-model="activeFilterName"/>

          <button @click="clearCompleted" type="button" class="todoapp__clear-completed"data-cy="ClearCompletedButton">
            Clear completed
          </button>
        </footer>
      </div>
      <div data-cy="ErrorNotification" class="notification is-danger is-light has-text-weight-normal hidden">
        <button
          data-cy="HideErrorButton" type="button" class="delete">
        </button>
      </div>
    </div>
  </div>
</template>

<style>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
    max-height: 60px;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0);
  }
</style>
