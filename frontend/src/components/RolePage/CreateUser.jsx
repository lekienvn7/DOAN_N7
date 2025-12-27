import React from "react";
import CreateForm from "./CreateForm";

const CreateUser = () => {
  return (
    <div
      className="w-[25vw] h-[80vh] rounded-[20px] flex items-center justify-center"
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <CreateForm />
    </div>
  );
};

export default CreateUser;
