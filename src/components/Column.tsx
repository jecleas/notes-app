import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Task } from './Task';
import type { Column as ColumnType, Task as TaskType } from '../types';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ column, tasks, onEditTask, onDeleteTask, onDeleteColumn }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sortedTasks = tasks.sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setSortableNodeRef}
      style={style}
      className={`bg-gray-50 rounded-lg p-4 min-w-[280px] max-w-[280px] h-fit ${
        isDragging ? 'opacity-50 rotate-1' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4" {...attributes} {...listeners}>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-3 ${column.color}`}
          />
          <h2 className="font-semibold text-gray-900 cursor-grab">
            {column.title}
          </h2>
          <span className="ml-2 bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (tasks.length === 0 || confirm(`Are you sure you want to delete "${column.title}" column? This will also delete all ${tasks.length} tasks in this column.`)) {
              onDeleteColumn(column.id);
            }
          }}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div ref={setDroppableNodeRef} className="min-h-[200px]">
        <SortableContext items={sortedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};