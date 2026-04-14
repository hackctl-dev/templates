<script setup lang="ts">
type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const todos = ref<Todo[]>([]);
const title = ref("");
const editingId = ref("");
const editingTitle = ref("");
const error = ref("");
const isLoading = ref(true);
const isSubmitting = ref(false);

onMounted(loadTodos);

const remainingCount = computed(() => todos.value.filter((todo) => !todo.completed).length);

async function loadTodos() {
  try {
    error.value = "";
    const response = await $fetch<{ todos: Todo[] }>("/api/todos");
    todos.value = response.todos ?? [];
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || "could not load todos";
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit(event: Event) {
  event.preventDefault();
  const nextTitle = title.value.trim();
  if (!nextTitle) {
    return;
  }

  isSubmitting.value = true;
  error.value = "";

  try {
    const response = await $fetch<{ todo: Todo }>("/api/todos", {
      method: "POST",
      body: { title: nextTitle },
    });
    title.value = "";
    todos.value = [response.todo, ...todos.value];
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || "could not create todo";
  } finally {
    isSubmitting.value = false;
  }
}

async function toggleTodo(todo: Todo) {
  try {
    error.value = "";
    const response = await $fetch<{ todo: Todo }>(`/api/todos/${todo.id}`, {
      method: "PUT",
      body: { completed: !todo.completed },
    });

    todos.value = todos.value.map((item) => (item.id === todo.id ? response.todo : item));
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || "could not update todo";
  }
}

async function saveTodoTitle(id: string) {
  const nextTitle = editingTitle.value.trim();
  if (!nextTitle) {
    error.value = "title is required";
    return;
  }

  try {
    error.value = "";
    const response = await $fetch<{ todo: Todo }>(`/api/todos/${id}`, {
      method: "PUT",
      body: { title: nextTitle },
    });

    todos.value = todos.value.map((item) => (item.id === id ? response.todo : item));
    editingId.value = "";
    editingTitle.value = "";
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || "could not update todo";
  }
}

async function deleteTodo(id: string) {
  try {
    error.value = "";
    await $fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    todos.value = todos.value.filter((item) => item.id !== id);
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || "could not delete todo";
  }
}

function startEdit(todo: Todo) {
  editingId.value = todo.id;
  editingTitle.value = todo.title;
}

function cancelEdit() {
  editingId.value = "";
  editingTitle.value = "";
}
</script>

<template>
  <main class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
    <div class="mx-auto w-full max-w-xl px-4 py-16">
      <div class="mb-8">
        <h1 class="text-2xl font-medium tracking-tight">Todo App</h1>
        <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          hackctl template &middot; API at <code class="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 text-xs text-zinc-900 dark:text-zinc-100">/api/todos</code>
        </p>
      </div>

      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <form class="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50" @submit="handleSubmit">
          <input
            v-model="title"
            placeholder="Write a todo..."
            class="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-50 dark:text-zinc-900 transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isSubmitting ? "Adding..." : "Add" }}
          </button>
        </form>

        <div
          v-if="error"
          class="px-4 py-3 text-sm text-red-600 dark:text-red-400 border-b border-zinc-200 dark:border-zinc-800 bg-red-50 dark:bg-red-950/20"
        >
          {{ error }}
        </div>

        <div class="flex flex-col">
          <div v-if="isLoading" class="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading todos...</div>
          <div v-else-if="todos.length === 0" class="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">No todos yet. Add your first item.</div>
          <ul v-else class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <li
              v-for="todo in todos"
              :key="todo.id"
              class="flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <input
                type="checkbox"
                :checked="todo.completed"
                class="h-4 w-4 rounded-sm accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                @change="toggleTodo(todo)"
              />

              <input
                v-if="editingId === todo.id"
                v-model="editingTitle"
                class="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-0 border-b border-zinc-300 dark:border-zinc-600 px-0 py-0.5"
                @keyup.enter="saveTodoTitle(todo.id)"
                @keyup.escape="cancelEdit"
                autofocus
              />
              <span
                v-else
                :class="[
                  'flex-1 text-sm truncate',
                  todo.completed ? 'text-zinc-500 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'
                ]"
              >
                {{ todo.title }}
              </span>

              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <template v-if="editingId === todo.id">
                  <button
                    type="button"
                    class="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    @click="saveTodoTitle(todo.id)"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    @click="cancelEdit"
                  >
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    @click="startEdit(todo)"
                  >
                    Edit
                  </button>
                </template>

                <button
                  type="button"
                  class="rounded border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  @click="deleteTodo(todo.id)"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between items-center">
          <span>{{ remainingCount }} task{{ remainingCount !== 1 ? 's' : '' }} remaining</span>
        </div>
      </div>
    </div>
  </main>
</template>
