"use client";

import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { Button } from "@/components/ui/button";
import supabase from "@/configs/Database";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const FormUI = ({
  jsonForm,
  onFieldUpdate,
  onFieldDelete,
  bgColor,
  textColor,
  isPreview,
  id,
}) => {
  const { user } = useUser();
  const formRef = useRef(null);
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readyForUpload, setReadyForUpload] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name, itemName, value) => {
    // if type is checkbox
    if (!itemName) {
      setFormData({ ...formData, [name]: value });
    } else {
      // if type is checkbox-group
      const currentItems = formData[name] || [];

      // 如果复选框被选中，则添加项目到列表中；否则，从列表中移除项目
      if (value) {
        // 添加项目到列表中
        const updatedItems = [...currentItems, itemName];
        setFormData({ ...formData, [name]: updatedItems });
      } else {
        // 从列表中移除项目
        const updatedItems = currentItems.filter((item) => item !== itemName);
        setFormData({ ...formData, [name]: updatedItems });
      }
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    console.log("formID: " + id);
    setIsSubmitting(true);

    console.log(jsonForm?.formTitle);
    console.log(111);

    //write suppliment info
    setFormData((prevData) => ({
      ...prevData,
      formTitle: jsonForm?.formTitle,
      formSubtitle: jsonForm?.formSubtitle,
    }));
    console.log(formData);

    // update db
    const { data, error } = await supabase
      .from("userResponses")
      .insert([
        {
          jsonResponse: formData,
          createBy: user?.primaryEmailAddress?.emailAddress,
          formID: id,
        },
      ])
      .select();
    if (error) {
      throw error;
    }

    setIsSubmitting(false);

    if (data) {
      toast("Your response has been submitted.", {
        description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
      });
    } else {
      toast(
        "There is an error while submitting your response, please try again later.",
        {
          description: `${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}`,
        }
      );
    }
  };

  return (
    <form
      className={`border p-5 md:max-w-lg rounded-lg text-${textColor} h-fit` }
      style={{ background: "rgba(255, 255, 255, 0.5)" }}
      onSubmit={onFormSubmit}
      ref={formRef}

    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-400 text-center mt-2">
        {jsonForm?.formSubtitle}
      </h2>

      {jsonForm?.fields?.map((field, index) => (
        <div key={index} className="flex gap-5 items-center">
          {field.type == "select" ? (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field?.label}</label>
              <Select
                required={field?.required}
                name={field?.name}
                onValueChange={(v) => handleSelectChange(field.name, v)}
              >
                <SelectTrigger className="w-full text-gray-500">
                  <SelectValue placeholder="Select your preferred option" />
                </SelectTrigger>
                <SelectContent>
                  {field?.options?.map((option, index) => (
                    <SelectItem value={option.value} key={index}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.type == "radio" ? (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field?.label}</label>

              <RadioGroup
                className="mt-2"
                required={field?.required}
                name={field?.name}
              >
                {field?.options?.map((option, index) => (
                  <div className="flex items-center space-x-2 ms-1" key={index}>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      onClick={() =>
                        handleSelectChange(field.name, option.value)
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}{" "}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.type == "textarea" ? (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field?.label}</label>
              <Textarea placeholder={field?.placeholder} name={field?.name} />
            </div>
          ) : field.type == "checkbox-group" ? (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field?.label}</label>

              {field?.options?.map((option, index) => (
                <div className="items-top flex space-x-2 ms-1 mt-2" key={index}>
                  <Checkbox
                    id={option.value}
                    required={field?.required}
                    name={option.value}
                    onCheckedChange={(v) =>
                      handleCheckboxChange(field?.label, option.label, v)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : field.type == "checkbox" ? (
            <div className="my-3 w-full">
              <div className="flex items-center space-x-2 ms-1 mt-2">
                <Checkbox
                  id={field?.name}
                  name={field?.name}
                  onCheckedChange={(v) =>
                    handleCheckboxChange(field?.label, "", v)
                  }
                />
                <label
                  htmlFor={field?.name}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field?.label}{" "}
                </label>
              </div>
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field?.label}</label>
              <Input
                type={field?.type}
                name={field?.name}
                placeholder={field?.placeholder}
                onChange={(e) => handleInputChange(e)}
                required={field?.required}
              />
            </div>
          )}
          {!isPreview && (
            <div className="my-3">
              <FieldEdit
                defaultValue={field}
                onUpdate={(value) => onFieldUpdate(value, index)}
                onDelete={() => onFieldDelete(index)}
              />
            </div>
          )}
        </div>
      ))}

      {/* terms and conditions */}
      <div className="items-top flex space-x-2 mt-6 ms-1">
        <Checkbox id="terms1" required />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms1"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
          <p className="text-xs text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* button */}
      <Button
        type="submit"
        className={`my-8 hover:bg-black bg-black`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            Please wait...
          </div>
        ) : (
          "Submit Form"
        )}
      </Button>
    </form>
  );
};

export default FormUI;
