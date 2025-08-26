import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Board } from './components/Board';
import { TaskModal } from './components/TaskModal';
import { ColumnModal } from './components/ColumnModal';
import type { Column, Task } from './types';

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-blue-500',
    order: 0,
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-amber-500',
    order: 1,
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-emerald-500',
    order: 2,
  },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design new homepage',
    description: 'Create wireframes and mockups for the new company homepage',
    dueDate: '2025-01-25',
    checklist: [
      { id: '1a', text: 'Create wireframes', completed: true },
      { id: '1b', text: 'Design mockups', completed: false },
      { id: '1c', text: 'Get client approval', completed: false },
    ],
    columnId: 'todo',
    order: 0,
  },
  {
    id: '2',
    title: 'Update user documentation',
    description: 'Review and update all user-facing documentation',
    dueDate: '2025-01-20',
    checklist: [
      { id: '2a', text: 'Review current docs', completed: true },
      { id: '2b', text: 'Update outdated sections', completed: true },
    ],
    columnId: 'in-progress',
    order: 0,
  },
];

function App() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'order'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...taskData, id: editingTask.id, order: editingTask.order }
          : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        order: tasks.filter(t => t.columnId === taskData.columnId).length,
      };
      setTasks([...tasks, newTask]);
    }
    setEditingTask(undefined);
  };

  const handleSaveColumn = (columnData: Omit<Column, 'id' | 'order'>) => {
    const newColumn: Column = {
      ...columnData,
      id: Date.now().toString(),
      order: columns.length,
    };
    setColumns([...columns, newColumn]);
  };

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string, newOrder: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, columnId: toColumnId, order: newOrder };
      }
      return task;
    }));
  };

  const handleReorderColumns = (columnId: string, newOrder: number) => {
    const columnToMove = columns.find(col => col.id === columnId);
    if (!columnToMove) return;

    const otherColumns = columns.filter(col => col.id !== columnId);
    const reorderedColumns = [
      ...otherColumns.slice(0, newOrder),
      columnToMove,
      ...otherColumns.slice(newOrder),
    ].map((col, index) => ({ ...col, order: index }));

    setColumns(reorderedColumns);
  };

  const handleReorderTasks = (taskId: string, newOrder: number) => {
    const taskToMove = tasks.find(task => task.id === taskId);
    if (!taskToMove) return;

    const columnTasks = tasks.filter(task => 
      task.columnId === taskToMove.columnId && task.id !== taskId
    );
    
    const reorderedTasks = [
      ...columnTasks.slice(0, newOrder),
      taskToMove,
      ...columnTasks.slice(newOrder),
    ].map((task, index) => ({ ...task, order: index }));

    const otherTasks = tasks.filter(task => task.columnId !== taskToMove.columnId);
    setTasks([...otherTasks, ...reorderedTasks]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
    setTasks(tasks.filter(task => task.columnId !== columnId));
  };
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your projects efficiently
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create
              <ChevronDown className="w-4 h-4" />
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsTaskModalOpen(true);
                    setShowCreateMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Task
                </button>
                <button
                  onClick={() => {
                    setIsColumnModalOpen(true);
                    setShowCreateMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Column
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Board */}
      <Board
        columns={columns}
        tasks={tasks}
        onMoveTask={handleMoveTask}
        onReorderColumns={handleReorderColumns}
        onReorderTasks={handleReorderTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onDeleteColumn={handleDeleteColumn}
      />

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSave={handleSaveTask}
        task={editingTask}
        columns={columns}
      />

      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onSave={handleSaveColumn}
      />

      {/* Click outside to close menu */}
      {showCreateMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowCreateMenu(false)}
        />
      )}
    </div>
  );
}

export default App;