"use client";

import { Trash, Edit } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FieldEdit = ({ defaultValue, onUpdate }) => {
  const [label, setLabel] = useState();
  const [placeholder, setPlaceholder] = useState();
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
          className= "mt-3"
            size="sm"
            onClick={() =>
              onUpdate({
                label: label,
                placeholder: placeholder,
              })
            }
          >Update</Button>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          {" "}
          <Trash className="h-4 w-4 text-red-500" />
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </div>
  );
};

export default FieldEdit;
