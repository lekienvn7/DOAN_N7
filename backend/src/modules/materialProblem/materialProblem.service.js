import MaterialProblem from "./MaterialProblem.model.js";

export async function getAllProblems() {
  return await MaterialProblem.find()
    .populate("material", "name unit")
    .sort({ createdAt: -1 });
}

export async function deleteProblem(id) {
  const item = await MaterialProblem.findById(id);
  if (!item) throw new Error("Không tìm thấy vật tư hỏng");

  item.status = "discarded";
  await item.save();

  return item;
}
