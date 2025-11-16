import React from "react";
import { useState, useEffect } from "react";
import { ReceiptText } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog";
import cadivi from "@/assets/images/cadivi225.png";

const ElectricList = () => {
  const [open, setOpen] = useState(false);
  const [selectMaterial, setSelectMaterial] = useState(null);

  const { user } = useAuth();
  const checkPermission = () => {
    const hasAccess =
      user?.yourRepo?.includes("all") || user?.yourRepo?.includes("electric");

    if (!hasAccess) {
      toast.error("Không có quyền sử dụng chức năng!");
      return false;
    }

    return true;
  };
  const [electrical, setElectrical] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchElectrical = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/repository/material/electric");
        if (res.data.success) {
          setElectrical(res.data.materials);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchElectrical();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#fdd700] bg-bgmain">
          <tr className="text-center text-[14px] font-semibold">
            <th className="relative py-[5px] w-[3%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              STT
            </th>
            <th className="relative w-[15%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Tên thiết bị/vật tư
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Số lượng
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Đơn vị
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Hạn bảo trì
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Ngày thêm
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Điện áp
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Công suất định mức
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Dòng điện định mức
            </th>
            <th colSpan={2} className=" w-[5%] ">
              Chi tiết
            </th>
          </tr>
        </thead>

        <tbody>
          {electrical.map((item, index) => (
            <tr className="border-b-1 border-gray-500 text-center text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
              <td className="border-r-1 border-textsec p-[5px]">{index + 1}</td>
              <td className="border-r-1 border-textsec p-[5px]">{item.name}</td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.quantity}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">{item.unit}</td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.maintenanceCycle}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {formatDate(item.createdAt)}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.voltageRange == null ? "—" : item.voltageRange} {""} V
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.power == null ? "—" : item.power} {""} W
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.current == null ? "—" : item.current} {""} A
              </td>
              <td className=" text-center p-[5px]">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (checkPermission()) {
                          setOpen(true);
                        }
                        setSelectMaterial(item);
                      }}
                      className="cursor-pointer p-[5px] justify-center text-[#ffd700] hover:text-[#ffb700]"
                    >
                      <ReceiptText size={15} />
                    </button>
                  </DialogTrigger>

                  <DialogContent className="bg-[#1a1a1a] !max-w-none w-auto max-w-fit h-auto max-h-fit rounded-[12px] border-none text-white p-[25px] ">
                    {selectMaterial ? (
                      <>
                        <DialogHeader>
                          <DialogTitle>
                            Chi tiết vật tư
                            <span className="text-[#ffd700]">
                              {" "}
                              {selectMaterial.name}
                            </span>
                          </DialogTitle>
                          <DialogDescription className="text-gray-400">
                            {selectMaterial.description?.length > 0
                              ? selectMaterial.description
                              : "hello"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-row gap-[25px]">
                          <img
                            src={cadivi}
                            alt="day-dien-2x2.5-cadivi"
                            className="w-[250px] h-[250px] rounded-[12px] border-[3px] border-[#fdd700]"
                          />
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 50 }}
                              transition={{ duration: 0.3 }}
                              className=""
                            >
                              <ul className="flex flex-col gap-[10px] ">
                                <li>
                                  <span className="text-[#60A5FA] font-semibold">
                                    Mã vật tư:
                                  </span>{" "}
                                  {selectMaterial.materialID}
                                </li>
                                <li>
                                  <span className="text-[#60A5FA] font-semibold">
                                    Số lượng:
                                  </span>{" "}
                                  {selectMaterial.quantity}{" "}
                                  {selectMaterial.unit}
                                </li>
                                <li>
                                  <span className="text-[#60A5FA] font-semibold">
                                    Thời gian giữa các lần bảo trì:
                                  </span>{" "}
                                  {selectMaterial.maintenanceCycle == null
                                    ? "—"
                                    : selectMaterial.maintenanceCycle}{" "}
                                  tháng
                                </li>
                                <li></li>
                                <li></li>
                              </ul>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectricList;
