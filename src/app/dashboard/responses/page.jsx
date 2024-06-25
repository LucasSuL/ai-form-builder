"use client";

import { Button } from "@/components/ui/button";
import supabase from "@/configs/Database";
import { useUser } from "@clerk/nextjs";
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
import { Edit, Trash2 } from "lucide-react";

const Responses = () => {
  const { user } = useUser();
  const [resList, setResList] = useState([]);

  useEffect(() => {
    user && getForms();
  }, [user]);

  const getForms = async () => {
    let { data: responses, error } = await supabase
      .from("userResponses")
      .select("*")
      // Filters
      .eq("createBy", user?.primaryEmailAddress?.emailAddress)
      .order("created_at", { ascending: false }); // 按 created_at 降序排列

    if (error) {
      throw error;
    }

    setResList(responses);
    console.log(responses);
  };

  const exportData = () => {
    
  };

  return (
    <div>
      <h2 className="p-5 font-bold text-xl">Responses</h2>
      <div className="mx-5 grid grid-cols-2 md:grid-cols-3 gap-5">
        {resList ? (
          resList.map((resJson, index) => {
            const resForm = JSON.parse(resJson.jsonResponse);
            const formID = resJson.id;
            return (
              <div
                key={index}
                className="flex flex-col gap-1 shadow-md rounded-lg border p-3" // cursor-pointer hover:bg-gray-100 hover:shadow-lg
              >
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
                <p className="font-medium">{resForm.formTitle}</p>
                <p className="text-sm text-gray-600">{resForm.formSubtitle}</p>
                <hr className="my-2"></hr>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm">
                    <strong>45</strong> Responses
                  </p>

                  <Button
                    className="text-xs flex gap-1"
                    size="sm"
                    onClick={() => exportData()}
                  >
                    <Edit className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                {/* Display other form data as needed */}
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
    </div>
  );
};

export default Responses;
