import React from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { useEffect, useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const AUTOMOTIVE_REPO_ID = "691553eafd7805ceea7a95b6";
  const [pendingRequests, setPendingRequests] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/borrow-requests/pending");

      setPendingRequests(res.data || []);
      onBellChange(res.data?.length || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Nhận tín hiệu realtime khi giảng viên (lecture) gửi phiếu
    window.socket.on("new-borrow-request", () => {
      loadData();
      toast.info("Có phiếu mượn mới!");
    });

    return () => {
      window.socket.off("new-borrow-request");
    };
  }, []);

  const repoList = [
    {
      type: "691553eafd7805ceea7a95b6",
      color: "text-[#fdd700]",
      link: "/repository/electric",
      name: "Kho điện",
    },
    {
      type: "690981405de9a612110089dd",
      color: "text-[#fb923c]",
      link: "/repository/automotive",
      name: "Kho công nghệ ô tô",
    },
    {
      type: "69230a5e163002521d0aa697",
      color: "text-[#c7a7ff]",
      link: "/repository/chemical",
      name: "Kho hóa chất",
    },
  ];

  const getRepoConfig = (repoId) => repoList.find((r) => r.type === repoId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-[#fb923c] border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-[25px] p-[25px]">
      <div className="w-[50vw] h-[85vh] bg-bgmain rounded-[12px] border-1 border-gray-600 p-[20px]">
        <div className="flex flex-col gap-[20px] text-center">
          <p className="text-textpri font-bold text-[25px]">DANH SÁCH KHO</p>
          <div className="flex flex-col gap-[15px]">
            <button
              onClick={() => navigate("/repository/electric")}
              className="w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px] hover:bg-[#262626] transition cursor-pointer"
            >
              <p className="text-[#fdd700] font-semibold">Kho điện</p>
              <p className="text-textpri">
                Còn <span className="text-[#fdd700] font-semibold">34</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/automotive")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#fb923c] font-semibold">Kho công nghệ ô tô</p>
              <p className="text-textpri">
                Còn <span className="text-[#fb923c] font-semibold">15</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/mechanical")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#E5E7EB] font-semibold">Kho cơ khí</p>
              <p className="text-textpri">
                Còn <span className="text-[#E5E7EB] font-semibold">40</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/iot")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#5eead4] font-semibold">Kho nhúng và iot</p>
              <p className="text-textpri">
                Còn <span className="text-[#5eead4] font-semibold">62</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/technology")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#60a5fa] font-semibold">
                Kho công nghệ thông tin
              </p>
              <p className="text-textpri">
                Còn <span className="text-[#60a5fa] font-semibold">77</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/fashion")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#f472b6] font-semibold">Kho thời trang</p>
              <p className="text-textpri">
                Còn <span className="text-[#f472b6] font-semibold">36</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/telecom")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#ff3434] font-semibold">
                Kho điện tử viễn thông
              </p>
              <p className="text-textpri">
                Còn <span className="text-[#ff3434] font-semibold">11</span>{" "}
                loại vật tư
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/chemical")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-bgmain rounded-[12px] border-1 border-gray-600 flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#c7a7ff] font-semibold">Kho hóa chất</p>
              <p className="text-textpri">
                Còn <span className="text-[#c7a7ff] font-semibold">28</span>{" "}
                loại vật tư
              </p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[25px]">
        <div className="w-[45vw] bg-main rounded-[12px] border border-gray-600 p-[20px] flex flex-col">
          {/* Header */}
          <p className="text-textpri font-bold text-[25px] text-center mb-[15px]">
            THÔNG BÁO
          </p>

          {/* Body scroll */}
          <div className="flex flex-col gap-[12px] max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#fb923c]/50 hover:scrollbar-thumb-[#fca86b]/60">
            {pendingRequests.map((r) => {
              const repoConfig = getRepoConfig(r.repository);

              return (
                <div
                  key={r._id}
                  onClick={() => repoConfig && navigate(repoConfig.link)}
                  className="bg-bgmain border border-gray-700 rounded-[10px] p-[12px]
                 hover:bg-[#262626] transition cursor-pointer"
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-[5px]">
                      <p
                        className={`${
                          repoConfig?.color || "text-white"
                        } font-semibold`}
                      >
                        {r.teacher?.fullName || "Giảng viên"}
                      </p>

                      <p className="text-textpri text-sm">
                        Yêu cầu mượn <b>{r.items.length}</b> vật tư
                      </p>
                    </div>

                    <p
                      className={`text-xs ${
                        repoConfig?.color || "text-textpri"
                      }`}
                    >
                      {repoConfig?.name || "Kho"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
