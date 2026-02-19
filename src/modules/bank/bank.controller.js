const bankService = require("./bank.service");

exports.createBank = async (req, res, next) => {
  try {
    const bank = await bankService.createBankWithAdmin(req.body);

    res.status(201).json({
      success: true,
      data: bank,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllBanks = async (req, res, next) => {
  try {
    const banks = await bankService.getAllBanks();

    res.status(200).json({
      success: true,
      data: banks,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBankById = async (req, res, next) => {
  try {
    const bank = await bankService.getBankById(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBank = async (req, res, next) => {
  try {
    const bank = await bankService.updateBank(req.params.id, req.body);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBank = async (req, res, next) => {
  try {
    const bank = await bankService.deleteBank(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bank deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.getTenantInfo = async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(404).json({
        success: false,
        message: "No bank associated with this subdomain",
      });
    }

    res.json({
      success: true,
      data: {
        name: req.tenant.name,
        logo: req.tenant.logo,
        subdomain: req.tenant.subdomain,
      },
    });
  } catch (err) {
    next(err);
  }
};
