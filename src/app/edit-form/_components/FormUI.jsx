import { Input } from "@/components/ui/input";
import React from "react";
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

const FormUI = ({
  jsonForm,
  onFieldUpdate,
  onFieldDelete,
  bgColor,
  textColor,
  isPreview,
}) => {
  return (
    <div
      className={`border p-5 md:max-w-lg rounded-lg text-${textColor}`}
      style={{ background: "rgba(255, 255, 255, 0.5)" }}
    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-400 text-center mt-2">
        {jsonForm?.formSubheading}
      </h2>

      {jsonForm?.fields?.map((field, index) => (
        <div key={index} className="flex gap-5 items-center">
          {field.type == "select" ? (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field.label}</label>
              <Select>
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
              <label className="text-xs ms-1">{field.label}</label>

              <RadioGroup className="mt-2">
                {field?.options?.map((option, index) => (
                  <div className="flex items-center space-x-2 ms-1" key={index}>
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}{" "}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.type == "textarea" ? (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field.label}</label>
              <Textarea placeholder={field.placeholder} />
            </div>
          ) : field.type == "checkbox" ? (
            <div className="my-3 w-full">
              {field?.options?.map((option, index) => (
                <div className="items-top flex space-x-2" key={index}>
                  <Checkbox id={option.value} />
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

              <div className="flex items-center space-x-2">
                <Checkbox id={field.name} />
                <label
                  htmlFor={field.name}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}{" "}
                </label>
              </div>
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-xs ms-1">{field.label}</label>
              <Input type={field.type} placeholder={field.placeholder} />
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
      <div className="items-top flex space-x-2 mt-6">
        <Checkbox id="terms1" />
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
      <Button className={`my-8 hover:bg-black bg-${textColor}`}>
        Submit Form
      </Button>
    </div>
  );
};

export default FormUI;
