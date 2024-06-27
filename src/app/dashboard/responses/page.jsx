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
import * as XLSX from "xlsx";
import CreateForm from "../_components/CreateForm";

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

  const onDeleteRes = async (formID) => {
    console.log(formID);
    const { error } = await supabase
      .from("userResponses")
      .delete()
      .eq("formID", formID);

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

  const exportData = async (formID) => {
    setIsExporting(true);

    let { data: userResponses, error } = await supabase
      .from("userResponses")
      .select()
      .eq("formID", formID);

    if (userResponses && userResponses.length > 0) {
      const { formTitle } = JSON.parse(userResponses[0].jsonResponse);
      const flattenedData = userResponses.map((item) => {
        const { formTitle, formSubtitle, ...rest } = JSON.parse(
          // excludes title
          item.jsonResponse
        );
        return {
          createBy: item.createBy,
          created_at: item.created_at,
          ...rest,
        };
      });

      console.log(flattenedData);

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, formTitle);

      // Generate an Excel file and trigger download
      XLSX.writeFile(workbook, `${formTitle}.xlsx`);

      setIsExporting(false);
    }
  };

  const groupedResList = resList.reduce((acc, resJson) => {
    const formID = resJson.formID;
    if (!acc[formID]) {
      acc[formID] = [];
    }
    acc[formID].push(resJson);
    return acc;
  }, {});

  // Convert grouped object to an array
  const groupedResArray = Object.entries(groupedResList);

  return (
    <div className="p-5 ">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Responses</h2>
        <CreateForm />
      </div>{" "}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-4">
        {groupedResArray ? (
          groupedResArray.map(([formID, resGroup]) => {
            // console.log(resJson);
            const resForm = JSON.parse(resGroup[0].jsonResponse);
            // const resID = resJson.id;
            // const formID = resGroup[0].formID;
            return (
              <div
                key={formID}
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
                            delete this response and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              onDeleteRes(formID);
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className="font-medium">{resForm.formTitle}</p>
                  <p className="text-sm text-gray-600">
                    {resForm.formSubtitle}
                  </p>
                </div>
                <div>
                  <hr className="my-2"></hr>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm">
                      <strong>{resGroup.length}</strong> Responses
                    </p>

                    <Button
                      className="text-xs"
                      size="sm"
                      onClick={() => exportData(formID)}
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
                </div>
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
