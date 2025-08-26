import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Column } from '../types';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: Omit<Column, 'id' | 'order'>) => void;
  column?: Column;
}

const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue', preview: 'bg-blue-500' },
  { value: 'bg-emerald-500', label: 'Emerald', preview: 'bg-emerald-500' },
  { value: 'bg-purple-500', label: 'Purple', preview: 'bg-purple-500' },
  { value: 'bg-amber-500', label: 'Amber', preview: 'bg-amber-500' },
  { value: 'bg-rose-500', label: 'Rose', preview: 'bg-rose-500' },
  { value: 'bg-gray-500', label: 'Gray', preview: 'bg-gray-500' },
];

export const ColumnModal: React.FC<ColumnModalProps> = ({
  isOpen,
  onClose,
  onSave,
  column,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    color: 'bg-blue-500',
  });

  useEffect(() => {
    if (column) {
      setFormData({
        title: column.title,
        color: column.color,
      });
    } else {
      setFormData({
        title: '',
        color: 'bg-blue-500',
      });
    }
  }, [column, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      title: formData.title.trim(),
      color: formData.color,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {column ? 'Edit Column' : 'Create New Column'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Column Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter column title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: option.value })}
                  className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${
                    formData.color === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${option.preview}`} />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {column ? 'Update Column' : 'Create Column'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};