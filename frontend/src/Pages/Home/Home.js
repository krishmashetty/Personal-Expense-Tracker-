import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getErrorMessage } from "../../utils/errorHandler";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const [values, setValues] = useState({
    title: "", amount: "", description: "", category: "", date: "", transactionType: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    // Only redirect to setAvatar if explicitly false AND no image at all
    if (parsedUser.isAvatarImageSet === false && !parsedUser.avatarImage) {
      navigate("/setAvatar");
      return;
    }
    setcUser(parsedUser);
    setRefresh(true);
  }, [navigate]);

  useEffect(() => {
    if (!cUser) return;
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id, frequency, startDate, endDate, type,
        });
        setTransactions(data.transactions);
      } catch (err) {
        toast.error(getErrorMessage(err), toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } = values;
    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please fill in all fields", toastOptions);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(addTransaction, {
        title, amount, description, category, date, transactionType, userId: cUser._id,
      });
      if (data.success) {
        toast.success(data.message, toastOptions);
        setShow(false);
        setRefresh(!refresh);
        setValues({ title: "", amount: "", description: "", category: "", date: "", transactionType: "" });
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (err) {
      toast.error(getErrorMessage(err), toastOptions);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  return (
    <>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        <div className="home-wrapper">
          {/* Controls Bar */}
          <div className="controls-bar">
            <div className="control-group">
              <span className="control-label">Period</span>
              <select className="control-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="7">Last Week</option>
                <option value="30">Last Month</option>
                <option value="365">Last Year</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="control-group">
              <span className="control-label">Type</span>
              <select className="control-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All</option>
                <option value="expense">Expense</option>
                <option value="credit">Income</option>
              </select>
            </div>

            <div className="controls-spacer" />

            <div className="view-toggle">
              <button
                className={`view-btn${view === "table" ? " active" : ""}`}
                onClick={() => setView("table")}
                title="Table view"
              >
                <FormatListBulletedIcon sx={{ fontSize: 18 }} />
              </button>
              <button
                className={`view-btn${view === "chart" ? " active" : ""}`}
                onClick={() => setView("chart")}
                title="Analytics view"
              >
                <BarChartIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <button className="add-btn" onClick={() => setShow(true)}>
              <AddIcon sx={{ fontSize: 18 }} />
              Add Transaction
            </button>
            <button className="add-btn-mobile" onClick={() => setShow(true)} aria-label="Add transaction">
              <AddIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* Date Range */}
          {frequency === "custom" && (
            <div className="date-range-row">
              <div className="date-range-group">
                <span className="date-range-label">Start Date</span>
                <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} placeholderText="Select start" />
              </div>
              <div className="date-range-group">
                <span className="date-range-label">End Date</span>
                <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} placeholderText="Select end" />
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
            <button className="reset-btn" onClick={handleReset}>
              <RefreshIcon sx={{ fontSize: 16 }} />
              Reset Filters
            </button>
          </div>

          {/* Content */}
          {view === "table" ? (
            <TableData data={transactions} user={cUser} />
          ) : (
            <Analytics transactions={transactions} user={cUser} />
          )}
        </div>
      )}

      {/* Add Transaction Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" type="text" placeholder="e.g. Grocery shopping" value={values.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control name="amount" type="number" placeholder="0.00" value={values.amount} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={values.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Tip">Tip</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" placeholder="Optional note" value={values.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select name="transactionType" value={values.transactionType} onChange={handleChange}>
                <option value="">Select type</option>
                <option value="credit">Income / Credit</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={values.date} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="reset-btn" style={{ marginBottom: 0 }} onClick={() => setShow(false)}>Cancel</button>
          <button className="add-btn" onClick={handleSubmit}>Save Transaction</button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Home;
