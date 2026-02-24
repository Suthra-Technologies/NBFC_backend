const express = require("express");
const router = express.Router();

router.use("/roles", require("../modules/roles/role.routes"));
router.use("/users", require("../modules/users/user.routes"));
router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/banks", require("../modules/bank/bank.routes"));
router.use("/branches", require("../modules/branches/branch.routes"));
router.use("/dashboard", require("../modules/dashboard/dashboard.routes"));
router.use("/customers", require("../modules/customers/customer.routes"));
// router.use("/loans", require("../modules/loans/loan.routes"));
router.use("/demo-requests", require("../modules/demo-requests/demo-request.routes"));

module.exports = router;