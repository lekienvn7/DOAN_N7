import repositoryService from "./repository.service.js";

export const getAllRepository = async (req, res) => {
  try {
    const repo = await repositoryService.getAllRepository();

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin kho thành công!",
      data: repo,
    });
  } catch (error) {
    console.error("Lỗi getAllRepository:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRepoMaterials = async (req, res) => {
  try {
    const result = await repositoryService.getRepoMaterials(req.params.repoID);

    return res.status(200).json({
      success: true,
      repoName: result.repoName,
      materials: result.materials,
    });
  } catch (error) {
    console.error("Lỗi getRepoMaterials:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRepository = async (req, res) => {
  try {
    const result = await repositoryService.getRepository(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin kho thành công!",
      data: result.repo,
      totalMaterials: result.totalMaterials,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addRepository = async (req, res) => {
  try {
    const result = await repositoryService.addRepository(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.repo,
    });
  } catch (error) {
    console.error("Lỗi addRepository:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const updateRepository = async (req, res) => {
  try {
    const result = await repositoryService.updateRepository(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.repo,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeMaterialFromRepo = async (req, res) => {
  try {
    const result = await repositoryService.removeMaterialFromRepo(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRepository = async (req, res) => {
  try {
    const result = await repositoryService.deleteRepository(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
