"use client";

import React, { useState } from "react";
import ColorPicker from "./ColorPicker";
import GradientPicker from "./GradientPicker";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import supabase from "@/configs/Database";
import { toast } from "sonner";

const Controller = ({ textColor, setTextColor, bgColor, setBgColor, id }) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveConfig = async () => {
    setIsSaving(true);

    // insert to db
    const { data, error } = await supabase
      .from("forms")
      .update({ textColor: textColor, bgColor: bgColor })
      .eq("id", id)
      .select();

    if (error) {
      toast("Failed to save config. Please try again later", {
        description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
      });

      throw error;
    }

    setIsSaving(false);

    toast("Your configuration has been saved.", {
      description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
    });
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold mb-6">Color Picker</h1>
        <div className="my-4">
          <h2 className="mb-4 font-medium text-sm">Select Text Color</h2>
          <ColorPicker onColorSelect={setTextColor} selectedColor={textColor} />
        </div>
        <div className="my-4">
          <h2 className="mb-4 font-medium text-sm">Select Background Color</h2>
          <GradientPicker onColorSelect={setBgColor} selectedColor={bgColor} />
        </div>
        <Button className="mt-5" onClick={() => saveConfig()} disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Please wait
            </div>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Controller;
