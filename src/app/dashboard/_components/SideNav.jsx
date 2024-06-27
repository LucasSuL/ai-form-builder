'use client'

import { Library, LineChart, MessageCircle, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Progress } from "../../../components/ui/progress";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import supabase from "@/configs/Database";

const SideNav = () => {
  const menuList = [
    { id: 1, name: "My Forms", icon: Library, path: "/dashboard" },
    {
      id: 2,
      name: "Responses",
      icon: MessageCircle,
      path: "/dashboard/responses",
    },
    { id: 3, name: "Analytics", icon: LineChart, path: "/dashboard/analytics" },
    { id: 4, name: "Upgrade", icon: Shield, path: "/dashboard/upgrade" },
  ];

  const path = usePathname();
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

  // useEffect(() => {
  //   console.log(path);
  // }, [path]);

  return (
    <div className="h-screen shadow-md border-r">
      <div className="p-5 text-sm">
        {menuList.map((menu, index) => (
          <Link
            href={menu.path}
            key={index}
            className={`flex items-center gap-3 px-4 py-2 mb-1 hover:bg-primary hover:text-white rounded-lg cursor-pointer ${
              path == menu.path && "bg-primary text-white"
            }`}
          >
            <menu.icon />
            {menu.name}
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 w-64">
        {/* <div className="w-full ">
          <CreateForm />
        </div> */}
        <div className="mt-5">
          <Progress value={(formList?.length/3)*100}  className="border-2"/>
          <p className="text-sm mt-2 text-gray-600">
            <strong>{formList?.length} </strong>Out of <strong>3</strong> File Created
          </p>
          <p className="text-sm mt-2 text-gray-600">
            Update your plan for <strong>unlimited</strong> AI form build
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
