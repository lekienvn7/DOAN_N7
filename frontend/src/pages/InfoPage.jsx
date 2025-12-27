import React from "react";
import { MapPin, Phone, Printer, Mail } from "lucide-react";
import logo from "../assets/images/logo.png";

const InfoPage = () => {
  return (
    <div className="flex justify-center mt-[50px] w-screen h-[350px] bg-[#ffffff] py-[30px]">
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-row gap-[100px]">
          <div className="flex flex-row gap-[50px]">
            <div className="flex flex-col gap-[10px] items-center">
              <img src={logo} alt="logo" className="w-[150px] h-[150px]" />
              <p className="font-qurova text-[20px] font-bold">UNETI</p>
            </div>
            <div className="flex flex-col gap-[30px]">
              <h2 className="font-bold text-[20px] text-[var(--text-primary)]">
                CƠ SỞ HÀ NỘI
              </h2>
              <ul className="flex flex-col gap-[15px] text-[var(--text-tertiary)] font-semibold">
                <li className="flex flex-row gap-[15px]">
                  <MapPin />
                  Số 454-456 Minh Khai, Phường Vĩnh Tuy, TP. Hà Nội
                </li>
                <li className="flex flex-row gap-[15px]">
                  <MapPin />
                  Số 218 Lĩnh Nam, Phường Hoàng Mai, TP. Hà Nội
                </li>
                <li className="flex flex-row justify-between">
                  <div className="flex flex-row gap-[15px]">
                    <Phone />
                    <p>024.38621504</p>
                  </div>
                  <div className="flex flex-row gap-[15px]">
                    <Printer />
                    <p>024.38623938</p>
                  </div>
                </li>
                <li className="flex flex-row gap-[15px]">
                  <Mail />
                  web@uneti.edu.vn
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-[15px]">
            <h2 className="font-bold text-[20px] text-[var(--text-primary)]">
              CƠ SỞ NAM ĐỊNH
            </h2>
            <ul className="flex flex-col gap-[15px] text-[var(--text-tertiary)] font-semibold">
              <li className="flex flex-row gap-[15px]">
                <MapPin />
                Số 353 Trần Hưng Đạo, Phường Nam Định, Tỉnh Ninh Bình
              </li>
              <li className="flex flex-row gap-[15px]">
                <MapPin />
                Khu xưởng Thực hành, Phường Thành Nam, Tỉnh Ninh Bình
              </li>
              <li className="flex flex-row justify-between">
                <div className="flex flex-row gap-[15px]">
                  <Phone />
                  <p>0228.3848706</p>
                </div>
                <div className="flex flex-row gap-[15px]">
                  <Printer />
                  <p>02283845747</p>
                </div>
              </li>
              <li className="flex flex-row gap-[15px]">
                <Mail />
                web@uneti.edu.vn
              </li>
            </ul>
          </div>
        </div>
        <p className="font-semibold text-[var(--text-quaternary)]">
          Copyright 2025 © Copyright 2025 © Trường Đại học Kinh tế - Kỹ thuật
          Công nghiệp
        </p>
      </div>
    </div>
  );
};

export default InfoPage;
