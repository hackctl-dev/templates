<script>
  import { onMount } from "svelte";

  let todos = [];
  let title = "";
  let editingId = "";
  let editingTitle = "";
  let error = "";
  let isLoading = true;
  let isSubmitting = false;

  onMount(loadTodos);

  async function loadTodos() {
    try {
      error = "";
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("could not load todos");
      }

      const body = await response.json();
      todos = body.todos ?? [];
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      return;
    }

    isSubmitting = true;
    error = "";

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "could not create todo");
      }

      const body = await response.json();
      title = "";
      todos = [body.todo, ...todos];
    } catch (err) {
      error = err.message;
    } finally {
      isSubmitting = false;
    }
  }

  async function toggleTodo(todo) {
    try {
      error = "";
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "could not update todo");
      }

      const body = await response.json();
      todos = todos.map((item) => (item.id === todo.id ? body.todo : item));
    } catch (err) {
      error = err.message;
    }
  }

  async function saveTodoTitle(id) {
    const nextTitle = editingTitle.trim();
    if (!nextTitle) {
      error = "title is required";
      return;
    }

    try {
      error = "";
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "could not update todo");
      }

      const body = await response.json();
      todos = todos.map((item) => (item.id === id ? body.todo : item));
      editingId = "";
      editingTitle = "";
    } catch (err) {
      error = err.message;
    }
  }

  async function deleteTodo(id) {
    try {
      error = "";
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "could not delete todo");
      }

      todos = todos.filter((item) => item.id !== id);
    } catch (err) {
      error = err.message;
    }
  }

  $: remainingCount = todos.filter((todo) => !todo.completed).length;
</script>

<main class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
  <div class="mx-auto w-full max-w-xl px-4 py-16">
    <div class="mb-8">
      <h1 class="text-2xl font-medium tracking-tight">Todo App</h1>
      <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        hackctl template &middot; API at <code class="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 text-xs text-zinc-900 dark:text-zinc-100">/api/todos</code>
      </p>
    </div>

    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
      <form on:submit={handleSubmit} class="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <input
          bind:value={title}
          placeholder="Write a todo..."
          class="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          class="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-50 dark:text-zinc-900 transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>

      {#if error}
        <div class="px-4 py-3 text-sm text-red-600 dark:text-red-400 border-b border-zinc-200 dark:border-zinc-800 bg-red-50 dark:bg-red-950/20">
          {error}
        </div>
      {/if}

      <div class="flex flex-col">
        {#if isLoading}
          <div class="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading todos...</div>
        {:else if todos.length === 0}
          <div class="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">No todos yet. Add your first item.</div>
        {:else}
          <ul class="divide-y divide-zinc-200 dark:divide-zinc-800">
            {#each todos as todo}
              <li class="flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  on:change={() => toggleTodo(todo)}
                  class="h-4 w-4 rounded-sm accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                />

                {#if editingId === todo.id}
                  <input
                    bind:value={editingTitle}
                    class="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-0 border-b border-zinc-300 dark:border-zinc-600 px-0 py-0.5"
                    autofocus
                  />
                {:else}
                  <span class={`flex-1 text-sm truncate ${todo.completed ? "text-zinc-500 dark:text-zinc-500 line-through" : "text-zinc-900 dark:text-zinc-100"}`}>{todo.title}</span>
                {/if}

                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  {#if editingId === todo.id}
                    <button
                      type="button"
                      on:click={() => saveTodoTitle(todo.id)}
                      class="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      on:click={() => {
                        editingId = "";
                        editingTitle = "";
                      }}
                      class="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                  {:else}
                    <button
                      type="button"
                      on:click={() => {
                        editingId = todo.id;
                        editingTitle = todo.title;
                      }}
                      class="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Edit
                    </button>
                  {/if}

                  <button
                    type="button"
                    on:click={() => deleteTodo(todo.id)}
                    class="rounded border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between items-center">
        <span>{remainingCount} task{remainingCount !== 1 ? 's' : ''} remaining</span>
      </div>
    </div>
  </div>
</main>
