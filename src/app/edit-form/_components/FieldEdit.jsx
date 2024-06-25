"use client";

import { Trash2, Edit } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

const FieldEdit = ({ defaultValue, onUpdate, onDelete }) => {
  const [label, setLabel] = useState(defaultValue?.label);
  const [placeholder, setPlaceholder] = useState(defaultValue?.placeholder);
  return (
    <div className="flex gap-1">
      <Popover>
        <PopoverTrigger>
          {" "}
          <Edit className="h-4 w-4 text-gray-500" />
        </PopoverTrigger>
        <PopoverContent>
          <h2>Edit Fields</h2>
          <div>
            <label className="text-xs">Label Name</label>
            <Input
              className="mt-1"
              type="text"
              defaultValue={defaultValue.label}
              onChange={(e) => setLabel(e.target.value)}
            ></Input>
          </div>
          <div className="mt-2">
            <label className="text-xs">Placeholder Name</label>
            <Input
              className="mt-1"
              type="text"
              defaultValue={defaultValue.placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            ></Input>
          </div>
          <Button
            className="mt-3"
            size="sm"
            onClick={() =>
              onUpdate({
                label: label,
                placeholder: placeholder,
              })
            }
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger>
          {" "}
          <Trash2 className="h-4 w-4 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick = {()=>onDelete()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FieldEdit;
