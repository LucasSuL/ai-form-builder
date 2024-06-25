"use client";
import FormUI from "@/app/edit-form/_components/FormUI";
import supabase from "@/configs/Database";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Preview = ({ params }) => {
  const { user } = useUser();
  const id = params.formID;
  const [form, setForm] = useState();

  useEffect(() => {
    if (id) {
      getFormData();
    }
  }, [id]); // Fetch data whenever id changes

  const getFormData = async () => {
    console.log("YES");
    let { data: forms, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id);
    // .eq("createBy", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      throw error;
    }
    console.log(forms[0].jsonForm);
    setForm(forms[0]);
  };

  return (
    <div>
      {form ? (
        <div
          className="flex justify-center p-10"
          style={{ background: form.bgColor }}
        >
          <FormUI
            jsonForm={JSON.parse(form.jsonForm)}
            bgColor={form.bgColor}
            textColor={form.textColor}
            onFieldUpdate={console.log()}
            onFieldDelete={console.log()}
            isPreview={true}
            id={id}
          />
        </div>
      ) : (
        <div
          className="flex items-center gap-2"
        >
          <Loader2 className="animate-spin" />
          Please wait...
        </div>
      )}

      <Link href={'/'} className="bg-black text-white text-sm fixed bottom-5 px-3 py-1 rounded-full left-5 cursor-pointer">
        Build your own AI form!
      </Link>
    </div>
  );
};

export default Preview;
