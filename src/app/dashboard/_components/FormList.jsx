"use client";

import { Button } from "@/components/ui/button";
import supabase from "@/configs/Database";
import { useUser } from "@clerk/nextjs";
import { Copy, Edit, Loader2, Share, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormList = () => {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    user && getForms();
  }, [user]);

  const getForms = async () => {
    let { data: forms, error } = await supabase
      .from("forms")
      .select("*")
      // Filters
      .eq("createBy", user?.primaryEmailAddress?.emailAddress)
      .order("created_at", { ascending: false }); // 按 created_at 降序排列

    if (error) {
      throw error;
    }

    setFormList(forms);
    console.log(forms);
  };

  const onDeleteForm = async (formID) => {
    const { error } = await supabase.from("forms").delete().eq("id", formID);
    if (error) {
      toast("There is an error, please try again later.", {
        description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
      });

      throw error;
    }
    toast("Your form has been deleted.", {
      description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
    });
    getForms();
  };

  const handleCopyClick = (formID) => {
    navigator.clipboard.writeText(`lucassu-ai-form-builder.vercel.app/preview/${formID}`);
    toast("Live link copied.", {
      // description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-4">
      {formList ? (
        formList.map((formJson, index) => {
          const form = JSON.parse(formJson.jsonForm);
          const formID = formJson.id;
          return (
            <div
              key={index}
              className="flex flex-col gap-1 shadow-md rounded-lg border p-3 justify-between" // cursor-pointer hover:bg-gray-100 hover:shadow-lg
            >
              <div>
                <div className="flex justify-between align-middle">
                  <div></div>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      {" "}
                      <Trash2 className="h-4 w-4 text-red-600 cursor-pointer hover:scale-105" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your form and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            onDeleteForm(formID);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="font-medium">{form.formTitle}</p>
                <p className="text-sm text-gray-600">{form.formSubtitle}</p>
              </div>

              <div>
                <hr className="my-2"></hr>
                <div className="flex gap-2">
                <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-xs flex gap-1"
                    size="sm"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input
                        id="link"
                        defaultValue={`lucassu-ai-form-builder.vercel.app/preview/${formID}`}
                        readOnly
                      />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={()=>handleCopyClick(formID)}>
                      <span className="sr-only">Copy</span>
                      <Copy className="h-4 w-4" />
                    </Button>

                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

                  <Link href={`/edit-form/${formID}`}>
                    <Button className="text-xs flex gap-1" size="sm">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <Loader2 />
          Please wait...
        </div>
      )}
    </div>
  );
};

export default FormList;
