import React from "react";
import Budget from "./Budget";
import { useAuth } from "@/context/authContext";
import InfoPage from "../InfoPage";
import Monthly from "./Monthly";

const BudgetPage = () => {
  const { user } = useAuth();

  const isAdmin = user?.userID === "ADMIN";
  return (
    <div>
      <div className="flex flex-col gap-[50px]">
        {isAdmin && <Budget />}
        <Monthly />
      </div>
      <InfoPage />
    </div>
  );
};

export default BudgetPage;
