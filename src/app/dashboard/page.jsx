import React from "react";
import CreateForm from "./_components/CreateForm";
import FormList from "./_components/FormList";
const Dashboard = () => {
  return (
    // <div className="h-screen">
    <div className="p-5 ">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">My Forms</h2>
        <CreateForm />
      </div>

      {/* form list */}
      <div className="">
        <FormList />
      </div>
    </div>
  );
};

export default Dashboard;
