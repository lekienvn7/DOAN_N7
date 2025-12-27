export async function getAllProblems() {
  return await MaterialProblem.find()
    .populate("material", "name unit")
    .sort({ createdAt: -1 });
}

export async function deleteProblem(id) {
  const item = await MaterialProblem.findByIdAndDelete(id);

  if (!item) {
    throw new Error("Không tìm thấy vật tư hỏng");
  }

  return item;
}
