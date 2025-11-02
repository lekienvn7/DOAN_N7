import React from "react";
import { PencilLine, Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

const MainDetail = () => {
  return (
    <div className="w-full">
      <table className="w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#caa93e]/60 bg-bgmain">
          <tr className="text-center text-[14px] font-semibold">
            <th className="relative py-[5px] w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              STT
            </th>
            <th className="relative w-[25%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Tên thiết bị/vật tư
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Số lượng
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Đơn vị
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Hạn bảo trì
            </th>
            <th className="relative w-[15%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Ngày thêm
            </th>
            <th colSpan={2} className=" w-[15%] ">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>

          <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
            <td className="border-r-1 border-textsec p-[5px]">1</td>
            <td className="border-r-1 border-textsec p-[5px]">Dây đồng</td>
            <td className="border-r-1 border-textsec p-[5px]">20</td>
            <td className="border-r-1 border-textsec p-[5px]">Cuộn</td>
            <td className="border-r-1 border-textsec p-[5px]">2 tháng/lần</td>
            <td className="border-r-1 border-textsec p-[5px]">2025-06-08</td>
            <td className="border-r-1 border-textsec text-center p-[5px]">
              <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                <PencilLine size={15} />
              </button>
            </td>
            <td className="text-center p-[5px]">
              <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MainDetail;
