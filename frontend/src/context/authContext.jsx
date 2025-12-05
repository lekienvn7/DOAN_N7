import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedMustChange = localStorage.getItem("mustChangePassword");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedMustChange) setMustChangePassword(JSON.parse(savedMustChange));
  }, []);

  const login = (userData) => {
    setUser(userData.userInfo);
    setMustChangePassword(userData.mustChangePassword);

    localStorage.setItem("user", JSON.stringify(userData.userInfo));
    localStorage.setItem(
      "mustChangePassword",
      JSON.stringify(userData.mustChangePassword)
    );
  };

  const logout = () => {
    setUser(null);
    setMustChangePassword(false);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("mustChangePassword");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        mustChangePassword,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
