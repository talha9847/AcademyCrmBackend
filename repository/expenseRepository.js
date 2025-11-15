const pool = require("../config/db");

class ExpenseRepository {
  async getAllExpense() {
    try {
      const query = await pool.query(
        "SELECT id,expense_name,amount,date_of_expense,category,detailed_notes FROM expense"
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addExpense(name, amount, date, category, notes) {
    try {
      const query = await pool.query(
        "INSERT INTO expense(expense_name,amount,date_of_expense,category,detailed_notes) VALUES($1,$2,$3,$4,$5)",
        [name, amount, date, category, notes]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


}

module.exports = new ExpenseRepository();
