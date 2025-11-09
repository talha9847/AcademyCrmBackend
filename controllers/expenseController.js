const expenseRepository = require("../repository/expenseRepository");
async function getAllExpense(req, res) {
  try {
    const result = await expenseRepository.getAllExpense();
    if (!result) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addExpense(req, res) {
  try {
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
}

module.exports = { getAllExpense, addExpense };
