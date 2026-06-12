import React from "react";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import "./analytics.css";
import "./home.css";

const categories = ["Groceries", "Rent", "Salary", "Tip", "Food", "Medical", "Utilities", "Entertainment", "Transportation", "Other"];

const categoryColors = {
  Groceries: "#f59e0b",
  Rent: "#3b82f6",
  Salary: "#10b981",
  Tip: "#06b6d4",
  Food: "#8b5cf6",
  Medical: "#ef4444",
  Utilities: "#84cc16",
  Entertainment: "#ec4899",
  Transportation: "#f97316",
  Other: "#6366f1",
};

const Analytics = ({ transactions }) => {
  const total = transactions.length;
  const incomeList = transactions.filter((t) => t.transactionType === "credit");
  const expenseList = transactions.filter((t) => t.transactionType === "expense");

  const incomePercent = total > 0 ? ((incomeList.length / total) * 100).toFixed(0) : 0;
  const expensePercent = total > 0 ? ((expenseList.length / total) * 100).toFixed(0) : 0;

  const totalTurnover = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomeList.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenseList.reduce((acc, t) => acc + t.amount, 0);

  const turnoverIncomePercent = totalTurnover > 0 ? ((totalIncome / totalTurnover) * 100).toFixed(0) : 0;
  const turnoverExpensePercent = totalTurnover > 0 ? ((totalExpense / totalTurnover) * 100).toFixed(0) : 0;

  return (
    <div className="analytics-wrapper">
      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card summary-total">
          <div className="summary-icon"><SwapHorizIcon sx={{ fontSize: 22 }} /></div>
          <div className="summary-info">
            <div className="summary-label">Total Transactions</div>
            <div className="summary-value">{total}</div>
          </div>
        </div>
        <div className="summary-card summary-income">
          <div className="summary-icon"><TrendingUpIcon sx={{ fontSize: 22 }} /></div>
          <div className="summary-info">
            <div className="summary-label">Total Income</div>
            <div className="summary-value">₹{totalIncome.toLocaleString()}</div>
          </div>
        </div>
        <div className="summary-card summary-expense">
          <div className="summary-icon"><TrendingDownIcon sx={{ fontSize: 22 }} /></div>
          <div className="summary-info">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value">₹{totalExpense.toLocaleString()}</div>
          </div>
        </div>
        <div className="summary-card summary-net">
          <div className="summary-icon">
            {totalIncome >= totalExpense ? (
              <TrendingUpIcon sx={{ fontSize: 22 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 22 }} />
            )}
          </div>
          <div className="summary-info">
            <div className="summary-label">Net Balance</div>
            <div className={`summary-value ${totalIncome >= totalExpense ? "positive" : "negative"}`}>
              ₹{Math.abs(totalIncome - totalExpense).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-row">
        {/* Transaction Count */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3 className="analytics-card-title">Transaction Split</h3>
            <span className="analytics-card-count">{total} total</span>
          </div>
          <div className="analytics-progress-group">
            <div className="progress-row">
              <CircularProgressBar percentage={incomePercent} color="#10b981" />
              <div className="progress-meta">
                <div className="progress-meta-label income-label">Income</div>
                <div className="progress-meta-count">{incomeList.length} transactions</div>
              </div>
            </div>
            <div className="progress-row">
              <CircularProgressBar percentage={expensePercent} color="#ef4444" />
              <div className="progress-meta">
                <div className="progress-meta-label expense-label">Expenses</div>
                <div className="progress-meta-count">{expenseList.length} transactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Turnover */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3 className="analytics-card-title">Turnover Split</h3>
            <span className="analytics-card-count">₹{totalTurnover.toLocaleString()}</span>
          </div>
          <div className="analytics-progress-group">
            <div className="progress-row">
              <CircularProgressBar percentage={turnoverIncomePercent} color="#10b981" />
              <div className="progress-meta">
                <div className="progress-meta-label income-label">Income</div>
                <div className="progress-meta-count">₹{totalIncome.toLocaleString()}</div>
              </div>
            </div>
            <div className="progress-row">
              <CircularProgressBar percentage={turnoverExpensePercent} color="#ef4444" />
              <div className="progress-meta">
                <div className="progress-meta-label expense-label">Expenses</div>
                <div className="progress-meta-count">₹{totalExpense.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Income */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3 className="analytics-card-title">Income by Category</h3>
          </div>
          <div className="category-bars">
            {categories.map((cat) => {
              const amount = incomeList.filter((t) => t.category === cat).reduce((acc, t) => acc + t.amount, 0);
              const pct = totalTurnover > 0 ? ((amount / totalTurnover) * 100).toFixed(0) : 0;
              return amount > 0 ? (
                <LineProgressBar key={cat} label={cat} percentage={pct} lineColor={categoryColors[cat]} amount={amount} />
              ) : null;
            })}
            {categories.every((cat) => incomeList.filter((t) => t.category === cat).reduce((a, t) => a + t.amount, 0) === 0) && (
              <div className="no-data">No income data</div>
            )}
          </div>
        </div>

        {/* Category Expense */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3 className="analytics-card-title">Expenses by Category</h3>
          </div>
          <div className="category-bars">
            {categories.map((cat) => {
              const amount = expenseList.filter((t) => t.category === cat).reduce((acc, t) => acc + t.amount, 0);
              const pct = totalTurnover > 0 ? ((amount / totalTurnover) * 100).toFixed(0) : 0;
              return amount > 0 ? (
                <LineProgressBar key={cat} label={cat} percentage={pct} lineColor={categoryColors[cat]} amount={amount} />
              ) : null;
            })}
            {categories.every((cat) => expenseList.filter((t) => t.category === cat).reduce((a, t) => a + t.amount, 0) === 0) && (
              <div className="no-data">No expense data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
