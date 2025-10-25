export const detectRepoType = (repoName = "") => {
  const name = repoName.toLowerCase();
  if (name.includes("điện")) return "Điện";
  if (name.includes("hóa") || name.includes("hoá")) return "Hóa chất";
  if (name.includes("cơ khí")) return "Cơ khí";
  return "Khác";
};
