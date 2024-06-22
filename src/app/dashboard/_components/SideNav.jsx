import { Library, LineChart, MessageCircle, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";

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

  // useEffect(() => {
  //   console.log(path);
  // }, [path]);

  return (
    <div className="h-screen shadow-md border-r">
      <div className="p-5 text-sm">
        {menuList.map((menu, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-2 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer ${
              path == menu.path && "bg-primary text-white"
            }`}
          >
            <menu.icon />
            {menu.name}
          </div>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 w-64">
        <Button className="w-full">+ Create Form</Button>
        <div className="mt-5">
          <Progress value={67} />
          <p className="text-sm mt-2 text-gray-600">
            <strong>2 </strong>Out of <strong>3</strong> File Created
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
