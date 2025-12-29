import React from "react";
import { useAuth } from "@/context/authContext";
import InfoPage from "../InfoPage";
import Monthly from "./Monthly";

const BudgetPage = () => {
  const { user } = useAuth();

  const isAdmin = user?.userID === "ADMIN";
  return (
    <div>
      <Monthly />

      <InfoPage />
    </div>
  );
};

export default BudgetPage;
