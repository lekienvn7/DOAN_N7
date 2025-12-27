import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { EyeOff, Eye, BanknoteArrowUp, Calculator } from "lucide-react";
import CalculatorPage from "../../components/CalculatorPage";

const Budget = () => {
  const [hidden, setHidden] = useState(false);

  return (
    <div>
      <div className="w-screen px-[100px] py-[20px]">
        <header className="font-bold text-[34px] mb-[30px]">
          Ngân sách kho
        </header>
        <main>
          <div className="flex flex-row gap-[15px]">
            <div className="flex flex-col gap-[10px] w-[300px] h-fit px-[20px] py-[15px] rounded-[12px] bg-[var(--bg-panel)]">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold text-[17px]">Tổng số dư VND</p>
                <button
                  onClick={() => setHidden(!hidden)}
                  className="text-[var(--text-quaternary)] cursor-pointer"
                >
                  {hidden ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div className="flex flex-row gap-[5px] items-baseline">
                <p className="font-bold text-[30px]">
                  {hidden ? "*** ***" : "1.000.000.000"}
                </p>
                <p className="text-[17px] font-bold">VND</p>
              </div>
            </div>
            <div className="flex flex-col gap-[5px] items-center">
              <BanknoteArrowUp className="w-[50px] h-[50px] p-[10px] rounded-[12px] bg-[var(--bg-panel)] cursor-pointer hover:scale-[1.02]" />
              <p>Nạp tiền</p>
            </div>
            <div className="flex flex-col gap-[5px] items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Calculator className="w-[50px] h-[50px] p-[10px] rounded-[12px] bg-[var(--bg-panel)] cursor-pointer hover:scale-[1.02]" />
                </DialogTrigger>

                <DialogContent className={"w-fit h-fit bg-[var(--bg-panel)]"}>
                  <DialogHeader>
                    <DialogTitle className={"text-[20px] font-bold"}>
                      Máy tính
                    </DialogTitle>
                  </DialogHeader>
                  <CalculatorPage />
                </DialogContent>
              </Dialog>
              <p>Máy tính</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Budget;
