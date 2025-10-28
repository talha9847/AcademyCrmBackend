const expenseRepository = require("../repository/expenseRepository");
async function getAllExpense(req, res) {
  const result = await expenseRepository.getAllExpense();
  if (!result) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json({ success: true, data: result });
}

async function addExpense(req, res) {
  const { name, amount, date, category, notes } = req.body;
  console.log(name, amount, date, category, notes);
  const result = await expenseRepository.addExpense(
    name,
    amount,
    date,
    category,
    notes
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
  return res
    .status(200)
    .json({ success: true, message: "Inserted Successfully" });
}

module.exports = { getAllExpense, addExpense };
