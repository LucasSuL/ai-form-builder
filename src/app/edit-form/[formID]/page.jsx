"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import supabase from "@/configs/Database";
import { useRouter } from "next/navigation";
import FormUI from "../_components/FormUI";

// const extractJsonString = (input) => {
//   const regex = /```json([\s\S]*?)```/;
//   const match = input.match(regex);
//   if (match && match[1]) {
//     return match[1].trim(); // trim to remove any extra whitespace
//   }
//   return null;
// };

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

    setJsonForm(JSON.parse(forms[0].jsonForm));
  };

  useEffect(() => {}, [jsonForm]);


  // handle form update
  const onFieldUpdate = async (value, index) => {
    const updatedForm = { ...jsonForm };

    updatedForm.fields[index] = {
      ...updatedForm.fields[index],
      label: value.label,
      placeholder: value.placeholder,
    };

    setJsonForm(updatedForm);

    // update db
    const { data, error } = await supabase
      .from("forms")
      .update({ jsonForm: updatedForm })
      .eq("id", id)
      .select();
  };

  // handle form del
  const onFieldDelete = async(index)=>{
    const updatedForm = { ...jsonForm };

    updatedForm.fields = updatedForm.fields.filter((_, i) => i !== index);

    console.log(updatedForm.fields);
    
    setJsonForm(updatedForm);

    // update del db
    const { data, error } = await supabase
      .from("forms")
      .update({ jsonForm: updatedForm })
      .eq("id", id)
      .select();
  }

  return (
    <div className="p-10">
      <p
        className="inline-flex gap-1 py-3 cursor-pointer hover:underline items-center"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 border rounded-lg shadow-md">Controller</div>
        <div className="md:col-span-3 border rounded-lg p-4 flex justify-center">
          <FormUI
            jsonForm={jsonForm}
            onFieldUpdate={onFieldUpdate}
            onFieldDelete={(index)=>onFieldDelete(index)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditForm;
