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
import { Edit, Loader2, Trash2 } from "lucide-react";

const Responses = () => {
  const { user } = useUser();
  const [resList, setResList] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

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

  const onDeleteRes = async (resID) => {
    console.log(resID);
    const { error } = await supabase
      .from("userResponses")
      .delete()
      .eq("id", resID);

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

  

  const exportData = async (resID) => {
    setIsExporting(true);

    let { data: userResponses, error } = await supabase
      .from("userResponses")
      .select("jsonResponse")
      .eq("id", resID);

    if (userResponses) {
      userResponses.forEach((userRes) => {
        console.log(userRes);
      });
      setIsExporting(false);
    }
  };
  return (
    <div>
      <h2 className="p-5 font-bold text-xl">Responses</h2>
      <div className="mx-5 grid grid-cols-2 md:grid-cols-3 gap-5">
        {resList ? (
          resList.map((resJson, index) => {
            console.log(resJson);
            const resForm = JSON.parse(resJson.jsonResponse);
            const resID = resJson.id;
            const formID = resJson.formID;
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
                          delete this response and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            onDeleteRes(resID);
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
                    className="text-xs"
                    size="sm"
                    onClick={() => exportData(resID)}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        Exporting...
                      </div>
                    ) : (
                      <div className=" flex gap-1">
                        <Edit className="h-4 w-4" />
                        Export
                      </div>
                    )}
                  </Button>
                </div>
                {/* Display other form data as needed */}
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            Loading data...
          </div>
        )}
      </div>
    </div>
  );
};

export default Responses;
