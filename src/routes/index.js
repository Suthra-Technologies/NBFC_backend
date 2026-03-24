const express = require("express");
const router = express.Router();

router.use("/roles", require("../modules/roles/role.routes"));
router.use("/users", require("../modules/users/user.routes"));
router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/banks", require("../modules/bank/bank.routes"));
router.use("/branches", require("../modules/branches/branch.routes"));
router.use("/dashboard", require("../modules/dashboard/dashboard.routes"));
router.use("/customers", require("../modules/customers/customer.routes"));
router.use("/producer-company/members", require("../modules/producer-company/member-details/routes/member.routes"));
// router.use("/loans", require("../modules/loans/loan.routes"));
router.use("/demo-requests", require("../modules/demo-requests/demo-request.routes"));
router.use("/chatbot", require("../modules/chatbot/chatbot.routes"));
router.use("/upload", require("../modules/upload/upload.routes"));

module.exports = router;