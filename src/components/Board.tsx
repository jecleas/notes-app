import React from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type {  DragEndEvent,
    DragOverEvent,
    DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './Column';
import type { Column as ColumnType, Task as TaskType } from '../types';

interface BoardProps {
  columns: ColumnType[];
  tasks: TaskType[];
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
  onReorderColumns: (columnId: string, newOrder: number) => void;
  onReorderTasks: (taskId: string, newOrder: number) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  columns,
  tasks,
  onMoveTask,
  onReorderColumns,
  onReorderTasks,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Add visual feedback when dragging starts
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging a task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Check if we're over a column
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn && activeTask.columnId !== overId) {
      // Move task to new column
      const newOrder = tasks.filter(task => task.columnId === overId).length;
      onMoveTask(activeId, activeTask.columnId, overId, newOrder);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if we're dragging a column
    const activeColumn = columns.find(col => col.id === activeId);
    const overColumn = columns.find(col => col.id === overId);

    if (activeColumn && overColumn) {
      // Reorder columns
      onReorderColumns(activeId, overColumn.order);
      return;
    }

    // Check if we're dragging a task
    const activeTask = tasks.find(task => task.id === activeId);
    const overTask = tasks.find(task => task.id === overId);

    if (activeTask && overTask) {
      // Reorder tasks within the same column
      if (activeTask.columnId === overTask.columnId) {
        onReorderTasks(activeId, overTask.order);
      }
    }
  };

  const sortedColumns = columns.sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 overflow-x-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <SortableContext items={sortedColumns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
          {sortedColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter(task => task.columnId === column.id)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onDeleteColumn={onDeleteColumn}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};