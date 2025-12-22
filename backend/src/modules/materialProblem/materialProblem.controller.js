import * as service from "./materialProblem.service.js";

export async function getMaterialProblems(req, res) {
  try {
    const data = await service.getAllProblems();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function discardMaterialProblem(req, res) {
  try {
    const { id } = req.params;
    const data = await service.deleteProblem(id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
