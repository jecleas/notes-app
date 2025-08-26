export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string | null;
    checklist: ChecklistItem[];
    columnId: string;
    order: number;
  }
  
  export interface Column {
    id: string;
    title: string;
    color: string;
    order: number;
  }