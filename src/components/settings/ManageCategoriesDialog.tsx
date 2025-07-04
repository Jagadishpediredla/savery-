
'use client';

import { useState } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import type { BucketType } from '@/lib/types';

interface ManageCategoriesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bucketType: BucketType;
}

export function ManageCategoriesDialog({ isOpen, onOpenChange, bucketType }: ManageCategoriesDialogProps) {
  const { allCategories, addCategory, editCategory, deleteCategory } = useFirebase();
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ old: string; new: string } | null>(null);

  const categories = allCategories[bucketType] || [];

  const handleAdd = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      await addCategory(bucketType, newCategory.trim());
      setNewCategory('');
    }
  };

  const handleSaveEdit = async () => {
    if (editingCategory && editingCategory.new.trim()) {
      await editCategory(bucketType, editingCategory.old, editingCategory.new.trim());
      setEditingCategory(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {bucketType} Categories</DialogTitle>
          <DialogDescription>Add, edit, or delete categories for this bucket.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
            />
            <Button onClick={handleAdd} disabled={!newCategory.trim()}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                {editingCategory?.old === cat ? (
                  <Input
                    value={editingCategory.new}
                    onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                    className="h-8"
                  />
                ) : (
                  <span>{cat}</span>
                )}
                <div className="flex gap-1">
                  {editingCategory?.old === cat ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingCategory(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingCategory({ old: cat, new: cat })}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the "{cat}" category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCategory(bucketType, cat)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
         <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
