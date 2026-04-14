import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadTodos() {
    try {
      setError("");
      const res = await fetch("/api/todos");
      if (!res.ok) {
        throw new Error("could not load todos");
      }
      const data = await res.json();
      setTodos(data.todos ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "could not create todo");
      }

      const body = await res.json();
      setTitle("");
      setTodos((previous) => [body.todo, ...previous]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleTodo(todo) {
    try {
      setError("");
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "could not update todo");
      }

      const body = await res.json();
      setTodos((previous) => previous.map((item) => (item.id === todo.id ? body.todo : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveTodoTitle(id) {
    const nextTitle = editingTitle.trim();
    if (!nextTitle) {
      setError("title is required");
      return;
    }

    try {
      setError("");
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "could not update todo");
      }

      const body = await res.json();
      setTodos((previous) => previous.map((item) => (item.id === id ? body.todo : item)));
      setEditingId("");
      setEditingTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(id) {
    try {
      setError("");
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "could not delete todo");
      }
      setTodos((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight">Todo App</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            hackctl template &middot; API at <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 text-xs text-zinc-900 dark:text-zinc-100">/api/todos</code>
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Write a todo..."
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-50 dark:text-zinc-900 transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </form>

          {error && (
            <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400 border-b border-zinc-200 dark:border-zinc-800 bg-red-50 dark:bg-red-950/20">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading todos...</div>
            ) : todos.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">No todos yet. Add your first item.</div>
            ) : (
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      className="h-4 w-4 rounded-sm accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                    />

                    {editingId === todo.id ? (
                      <input
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-0 border-b border-zinc-300 dark:border-zinc-600 px-0 py-0.5"
                        autoFocus
                      />
                    ) : (
                      <span className={`flex-1 text-sm truncate ${todo.completed ? "text-zinc-500 dark:text-zinc-500 line-through" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {todo.title}
                      </span>
                    )}

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {editingId === todo.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveTodoTitle(todo.id)}
                            className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId("");
                              setEditingTitle("");
                            }}
                            className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(todo.id);
                            setEditingTitle(todo.title);
                          }}
                          className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        className="rounded border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between items-center">
            <span>{remainingCount} task{remainingCount !== 1 ? "s" : ""} remaining</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
