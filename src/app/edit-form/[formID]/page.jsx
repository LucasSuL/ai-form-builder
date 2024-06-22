'use client'

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import supabase from "@/configs/Database";
import { useRouter } from "next/navigation";

const extractJsonString = (input) => {
  const regex = /```json([\s\S]*?)```/;
  const match = input.match(regex);
  if (match && match[1]) {
    return match[1].trim(); // trim to remove any extra whitespace
  }
  return null;
};

const EditForm = ({ params }) => {
  const { user } = useUser();
  const id = params.formID;
  const [jsonForm, setJsonForm] = useState();
  const router = useRouter();

  useEffect(() => {
    user && getFormData();
  }, [user]);

  const getFormData = async () => {
    let { data: forms, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .eq("createBy", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      throw error;
    }

    const extracted = extractJsonString(forms[0].jsonForm);
    setJsonForm(JSON.parse(extracted));
  };

  return (
    <div className="p-10">
      <h2
        className="flex gap-2 py-3 cursor-pointer hover:font-bold"
        onClick={()=>router.back()}
      >
        <ArrowLeft /> Back
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div>Controller</div>
        <div className="md:col-span-2 border rounded-lg p-4 h-screen">Form</div>
      </div>
    </div>
  );
};

export default EditForm;
