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
  ". As per the description, please provide the form in pure json format without comment. The form must includes 'formTitle', 'formSubtitle', fields, names, placeholders, labels, and required. You can provide 'checkbox', but be careful not to include 'accept terms and conditions' and 'submit'";

const extractJsonString = (input) => {
  const regex = /```json([\s\S]*?)```/;
  const match = input.match(regex);
  if (match && match[1]) {
    return match[1].trim(); // trim to remove any extra whitespace
  }
  return null;
};

const CreateForm = ({ isFromHero }) => {
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

    if (result.response.text()) {
      // parse response
      const extracted = extractJsonString(result.response.text());

      console.log("extracted = " + extracted);

      // insert to db
      const { data, error } = await supabase
        .from("forms")
        .insert([
          {
            jsonForm: extracted,
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
          {isFromHero ? (
            <a
              className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 cursor-pointer"
            >
              Create Yours
              <span
                aria-hidden="true"
                className="block transition-all group-hover:ms-1 rtl:rotate-180"
              >
                &rarr;
              </span>
            </a>
          ) : (
            <Button variant="">+ Create Form</Button>
          )}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="mt-2"
                placeholder="Write description of your form"
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex gap-2 mt-5 justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={loading}
                  >
                    Close
                  </Button>
                </DialogClose>

                <Button onClick={onCreateForm} disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Generating your form...
                    </div>
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
