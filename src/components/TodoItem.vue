<script>
import { patchTask } from '@/http-client';

    export default {
        props: {
            task: Object
        },
        data() {
            return {
                editing: false,
                newTitle: '',
                isCompleted: this.task.completed
            }
        },
        watch: {
            isCompleted(newValue) {
                patchTask({ id: this.task.id, title: this.task.title, completed: newValue })
            }
        },
        emits: {
            remove: (payload) => {
                if (payload.id) {
                    return true
                } else {
                    console.warn('Missing task id in removing events');
                    return false;
                }
            }
        },
        methods: {
            edit() {
                this.editing = true;
                this.newTitle = this.task.title;
                this.$nextTick(() => {
                    this.$refs['title-field'].focus();
                })
            },
            cancel() {
                this.editing = false;
            },
            rename() {
                patchTask({ id: this.task.id, title: this.newTitle, completed: this.task.completed })
                    .then(() => {
                        if (this.editing === false) {
                            return
                        }   
                
                        if (this.newTitle.length === 0) {
                            this.$emit('remove', { id: this.task.id });
                        }

                    this.task.title = this.newTitle;
                    this.editing = false;
                })
            }
        }
    }

</script>

<template>
   <div data-cy="Todo" class="todo" :class="{completed: isCompleted}">
        <label class="todo__status-label">
            <input v-model="isCompleted" data-cy="TodoStatus" type="checkbox" class="todo__status">
        </label>

        <form v-if="editing" @submit.prevent="rename">
            <input ref="title-field" type="text" class="todo__title-field" placeholder="Empty field will be deleted" value="To do is being edited" 
            @keyup.esc="cancel" v-model="newTitle" @blur="rename">
        </form>

        <template v-else>
            <span data-cy="TodoTitle" class="todo__title" @dblclick="edit">{{ task.title }}</span>
            <button
                @click="$emit('remove', { id: task.id })" type="button" class="todo__remove" data-cy="TodoDelete">
                ×
            </button>
        </template>


        
        <div data-cy="TodoLoader" class="modal overlay">
            <div class="modal-background has-background-white-ter"></div>
            <div class="loader"></div>
        </div>
    </div>
</template>