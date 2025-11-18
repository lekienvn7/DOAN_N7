import React from "react";
import { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Pen, Pencil } from "lucide-react";
import { motion } from "framer-motion";
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

const ElectricEdit = ({ item }) => {
  const [description, setDescription] = useState("");
  const [voltageRange, setVoltageRange] = useState("");
  const [power, setPower] = useState("");
  const [materialInsulation, setMaterialInsulation] = useState("");
  const [current, setCurrent] = useState("");
  const [frequency, setFrequency] = useState("");
  const [resistance, setResistance] = useState("");
  const [phaseType, setPhaseType] = useState("");
  const [conductorMaterial, setConductorMaterial] = useState("");
  const [insulationMaterial, setInsulationMaterial] = useState("");
  const [fireResistance, setFireResistance] = useState("");
  const [cableDiameter, setCableDiameter] = useState("");
  const [waterproofLevel, setWaterproofLevel] = useState("");
  const [operatingTemp, setOperatingTemp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") setDescription(value);
    if (name === "voltageRange") setVoltageRange(value);
    if (name === "power") setPower(value);
    if (name === "materialInsulation") setMaterialInsulation(value);
    if (name === "current") setCurrent(value);
    if (name === "frequency") setFrequency(value);
    if (name === "resistance") setResistance(value);
    if (name === "phaseType") setPhaseType(value);
    if (name === "conductorMaterial") setConductorMaterial(value);
    if (name === "insulationMaterial") setInsulationMaterial(value);
    if (name === "fireResistance") setFireResistance(value);
    if (name === "cableDiameter") setCableDiameter(value);
    if (name === "waterproofLevel") setWaterproofLevel(value);
    if (name === "operatingTemp") setOperatingTemp(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-red-500 hover:text-red-400">
          <Pencil size={15} />{" "}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#1a1a1a] !max-w-none w-auto max-w-fit  h-auto max-h-fit rounded-[12px] border-none whitespace-nowrap text-white p-[25px] ">
        <DialogHeader>
          <DialogTitle>
            Chỉnh sửa vật tư <span className="text-[#fdd700]">{item.name}</span>{" "}
            {"-"}{" "}
            {item.updatedBy
              ? `Đã chỉnh sửa bởi ${item.updatedBy.fullName}`
              : "Chưa chỉnh sửa"}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ElectricEdit;
