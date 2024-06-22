import React from "react";
import CreateForm from "./_components/CreateForm";
const Dashboard = () => {
  return (
    <div className="h-screen">
      <div className="p-10 flex justify-between align-middle">
        <h2 className="font-bold text-3xl">Dashboard</h2>
        <CreateForm />
      </div>
    </div>
  );
};

export default Dashboard;
