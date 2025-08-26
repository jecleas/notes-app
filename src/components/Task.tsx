import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, CheckSquare, Square, Edit3, Trash2 } from 'lucide-react';
import { format, isAfter, isToday } from 'date-fns';
import type { Task as TaskType } from '../types';

interface TaskProps {
  task: TaskType;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onEditTask, onDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;

  const getDueDateColor = () => {
    if (!task.dueDate) return '';
    const dueDate = new Date(task.dueDate);
    if (isToday(dueDate)) return 'text-amber-600 bg-amber-50';
    if (isAfter(new Date(), dueDate)) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-grab hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-snug flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getDueDateColor()}`}>
          <Calendar className="w-3 h-3 mr-1" />
          {format(new Date(task.dueDate), 'MMM d')}
        </div>
      )}

      {totalItems > 0 && (
        <div className="flex items-center text-xs text-gray-500">
          <div className="flex items-center mr-3">
            {completedItems === totalItems ? (
              <CheckSquare className="w-3 h-3 text-emerald-500 mr-1" />
            ) : (
              <Square className="w-3 h-3 mr-1" />
            )}
            <span className={completedItems === totalItems ? 'text-emerald-600 font-medium' : ''}>
              {completedItems}/{totalItems}
            </span>
          </div>
          {completedItems === totalItems && (
            <span className="text-emerald-600 font-medium text-xs">Complete</span>
          )}
        </div>
      )}
    </div>
  );
};