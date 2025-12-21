import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import axiosClient from "@/api/axiosClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AnimatedStat from "@/components/AnimatedStat";
import NoticePage from "./NoticePage";
import WeatherToday from "@/components/WeatherToday";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [totalElectric, setTotalElectric] = useState("");
  const [totalChemical, setTotalChemical] = useState("");
  const [totalMechanical, setTotalMechanical] = useState("");
  const [totalFashion, setTotalFashion] = useState("");
  const [totalIot, setTotalIot] = useState("");
  const [totalAuto, setTotalAuto] = useState("");
  const [totalTelecom, setTotalTelecom] = useState("");
  const [totalTech, setTotalTech] = useState("");
  const [date, setDate] = React.useState(new Date());

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchElectric = async () => {
        try {
          const res = await axiosClient.get(`/repository/electric`);
          if (res.data.success) {
            setTotalElectric(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchElectric();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchMechanical = async () => {
        try {
          const res = await axiosClient.get(`/repository/mechanical`);
          if (res.data.success) {
            setTotalMechanical(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchMechanical();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchChemical = async () => {
        try {
          const res = await axiosClient.get(`/repository/chemical`);
          if (res.data.success) {
            setTotalChemical(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchChemical();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchIot = async () => {
        try {
          const res = await axiosClient.get(`/repository/iot`);
          if (res.data.success) {
            setTotalIot(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchIot();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchFashion = async () => {
        try {
          const res = await axiosClient.get(`/repository/fashion`);
          if (res.data.success) {
            setTotalFashion(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchFashion();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchAuto = async () => {
        try {
          const res = await axiosClient.get(`/repository/automotive`);
          if (res.data.success) {
            setTotalAuto(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchAuto();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchTelecom = async () => {
        try {
          const res = await axiosClient.get(`/repository/telecom`);
          if (res.data.success) {
            setTotalTelecom(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchTelecom();
    }, 300);
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fetchTech = async () => {
        try {
          const res = await axiosClient.get(`/repository/technology`);
          if (res.data.success) {
            setTotalTech(res.data.totalMaterials);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        }
      };
      fetchTech();
    }, 300);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/borrow-requests/pending");

      setPendingRequests(res.data || []);
      toast.success("Tải dữ liệu thành công!");
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

  const repoName = [
    { type: "automotive", name: "kho Công nghệ ô tô" },
    { type: "chemical", name: "kho Hóa chất" },
    { type: "mechanical", name: "kho Cơ khí" },
    { type: "iot", name: "kho Nhúng và Iot" },
    { type: "electric", name: "kho Điện" },
    { type: "telecom", name: "kho Điện tử viên thông" },
    { type: "fashion", name: "kho Thời trang" },
    { type: "technology", name: "kho Công nghệ thông tin" },
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
      <div className="flex flex-col gap-[25px]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-[350px] h-[250px] gap-[20px]">
            <p className="text-textpri font-vegan text-center text-[30px]">
              <span className="text-highlightcl">X</span>in{" "}
              <span className="text-highlightcl">C</span>hào
            </p>
            <ul className="flex flex-col gap-[15px] text-center">
              <li className="text-textpri">
                <span className="text-[#60A5FA]">Họ tên:</span> {user?.fullName}
              </li>
              <li className="text-textpri">
                <span className="text-[#60A5FA]">Chức vụ:</span>{" "}
                {user?.roleName}
              </li>
              <li className="text-textpri">
                <span className="text-[#60A5FA]">Phân kho (nếu có):</span>{" "}
                {user?.yourRepo
                  ? repoName.find((r) => r.type === user.yourRepo)?.name
                  : "Không có"}
              </li>

              <li className="text-textpri">
                <span className="text-[#60A5FA]">Email:</span>{" "}
                {user?.email ? user.email : "Không có"}
              </li>
              <li className="text-textpri">
                <span className="text-[#60A5FA]">Số điện thoại:</span>{" "}
                {user?.phone ? user.phone : "Không có"}
              </li>
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 90, damping: 12 }}
          >
            <WeatherToday />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 90, damping: 12 }}
          className="w-[700px] bg-[#121212] rounded-[12px]  p-[20px] flex flex-col"
        >
          <p className="text-[#60A5FA] text-[20px] text-left mb-[15px]">
            Thông báo
          </p>

          <NoticePage />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
        className="w-[50vw] h-[85vh] bg-[#121212] rounded-[12px] p-[20px]"
      >
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-row justify-between items-center px-[10px]">
            <p className="text-[#60A5FA] text-[20px]">Danh sách kho</p>
            <p className="text-textpri text-[17px]">Tổng loại vật tư</p>
          </div>

          <div className="flex flex-col gap-[15px]">
            <button
              onClick={() => navigate("/repository/electric")}
              className="w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px] hover:bg-[#262626] transition cursor-pointer"
            >
              <p className="text-[#fdd700] font-semibold">Kho điện</p>
              <p className="text-textpri">
                <AnimatedStat value={totalElectric} color="#ffffff" />
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/automotive")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#fb923c] font-semibold">Kho công nghệ ô tô</p>
              <p className="text-textpri">
                <AnimatedStat value={totalAuto} color="#ffffff" />
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/mechanical")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#E5E7EB] font-semibold">Kho cơ khí</p>
              <p className="text-textpri">
                <AnimatedStat value={totalMechanical} color="#ffffff" />
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/iot")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#5eead4] font-semibold">Kho nhúng và iot</p>
              <AnimatedStat value={totalIot} color="#ffffff" />
            </button>

            <button
              onClick={() => navigate("/repository/technology")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#60a5fa] font-semibold">
                Kho công nghệ thông tin
              </p>
              <p className="text-textpri">
                <AnimatedStat value={totalTech} color="#ffffff" />
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/fashion")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#f472b6] font-semibold">Kho thời trang</p>
              <p className="text-textpri">
                <AnimatedStat value={totalFashion} color="#ffffff" />
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/telecom")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#ff3434] font-semibold">
                Kho điện tử viễn thông
              </p>
              <p className="text-textpri">
                <AnimatedStat value={totalTelecom} color="#ffffff" />
              </p>
            </button>

            <button
              onClick={() => navigate("/repository/chemical")}
              className="hover:bg-[#262626] transition cursor-pointer w-[720px] h-[50px] bg-[#121212]  flex flex-row items-center justify-between p-[10px]"
            >
              <p className="text-[#c7a7ff] font-semibold">Kho hóa chất</p>
              <p className="text-textpri">
                <AnimatedStat value={totalChemical} color="#ffffff" />
              </p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
