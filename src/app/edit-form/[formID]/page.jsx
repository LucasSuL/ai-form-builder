"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Share2, SquareArrowUpRight } from "lucide-react";
import supabase from "@/configs/Database";
import { useRouter } from "next/navigation";
import FormUI from "../_components/FormUI";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EditForm = ({ params }) => {
  const { user } = useUser();
  const id = params.formID;
  const [jsonForm, setJsonForm] = useState();
  const [textColor, setTextColor] = useState("black");
  const [bgColor, setBgColor] = useState("white");
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
    setTextColor(forms[0].textColor);
    setBgColor(forms[0].bgColor);
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
    toast("Update has been done.", {
      description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
    });

    // update db
    const { data, error } = await supabase
      .from("forms")
      .update({ jsonForm: updatedForm })
      .eq("id", id)
      .select();
  };

  // handle form del
  const onFieldDelete = async (index) => {
    const updatedForm = { ...jsonForm };

    updatedForm.fields = updatedForm.fields.filter((_, i) => i !== index);

    console.log(updatedForm.fields);

    setJsonForm(updatedForm);
    toast("Delete successfully.", {
      description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
    });

    // update del db
    const { data, error } = await supabase
      .from("forms")
      .update({ jsonForm: updatedForm })
      .eq("id", id)
      .select();
  };

  return (
    <div className="px-5 mt-5">
      <div className="flex justify-between">
        <p
          className="inline-flex gap-1 py-3 cursor-pointer hover:underline items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </p>
        <div className="flex gap-2">
          <Link href={`/preview/${id}`} target="_blank">
            <Button className="flex gap-2">
              <SquareArrowUpRight className="h-5 w-5" /> Live Preview
            </Button>
          </Link>
          <Button className="flex gap-2 bg-green-600 hover:bg-green-500">
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            textColor={textColor}
            setTextColor={setTextColor}
            bgColor={bgColor}
            setBgColor={setBgColor}
            // jsonForm={jsonForm}
            // setJsonForm={setJsonForm}
            id={id}
          />
        </div>
        <div
          className="md:col-span-2 border rounded-lg p-4 flex justify-center"
          style={{ background: bgColor }}
        >
          <FormUI
            jsonForm={jsonForm}
            bgColor={bgColor}
            textColor={textColor}
            onFieldUpdate={onFieldUpdate}
            onFieldDelete={(index) => onFieldDelete(index)}
            id = {id}
          />
        </div>
      </div>
    </div>
  );
};

export default EditForm;
