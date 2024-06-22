"use client";

import React, { useState } from "react";

import { useUser } from "@clerk/nextjs";
import supabase from "@/configs/Database";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { chatSession } from "@/configs/AiModal";

const PROMPT =
  ". Based on the description, please give me the form in json format with form title, form subheading, form field, form name, placeholder name, form label, required";

const CreateForm = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onCreateForm = async () => {
    setLoading(true);

    // get gemini response
    const result = await chatSession.sendMessage(
      "Description: " + userInput + PROMPT
    );

    // write db
    if (result.response.text()) {
      console.log(result.response.text());
      const { data, error } = await supabase
        .from("forms")
        .insert([
          {
            jsonForm: result.response.text(),
            createBy: user?.primaryEmailAddress?.emailAddress,
          },
        ])
        .select("id");

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Inserted row ID:", data[0].id);
        router.push(`/edit-form/${data[0].id}`);
      }

      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="">+ Create Form</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="mt-2"
                placeholder="Write description of your form"
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex gap-2 mt-5 justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    Close
                  </Button>
                </DialogClose>

                <Button onClick={onCreateForm} disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Form"
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
