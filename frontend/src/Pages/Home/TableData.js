import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getErrorMessage } from "../../utils/errorHandler";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [values, setValues] = useState({
    title: "", amount: "", description: "", category: "", date: "", transactionType: "",
  });

  useEffect(() => {
    setTransactions(props.data);
  }, [props.data, props.user]);

  const handleEditClick = (itemKey) => {
    if (transactions.length > 0) {
      const editTran = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      setShow(true);
    }
  };

  const toastOptions = {
    position: "bottom-right", autoClose: 3000, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: false, draggable: true, theme: "dark",
  };

  const handleEditSubmit = async () => {
    try {
      const { data } = await axios.put(`${editTransactions}/${currId}`, { ...values });
      if (data.success) {
        setShow(false);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to update transaction.", toastOptions);
      }
    } catch (err) {
      toast.error(getErrorMessage(err), toastOptions);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
        userId: props.user._id,
      });
      if (data.success) {
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to delete transaction.", toastOptions);
      }
    } catch (err) {
      toast.error(getErrorMessage(err), toastOptions);
    }
  };

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  if (!props.data || props.data.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">No transactions found for this period</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.data.map((item, index) => (
                <tr key={index}>
                  <td>{moment(item.date).format("MMM D, YYYY")}</td>
                  <td className="tx-title">{item.title}</td>
                  <td>
                    <span className={`tx-amount ${item.transactionType}`}>
                      {item.transactionType === "credit" ? "+" : "-"}₹{item.amount}
                    </span>
                  </td>
                  <td>
                    <span className={`tx-type-badge ${item.transactionType}`}>
                      {item.transactionType === "credit" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td>
                    <div className="icons-handle">
                      <button className="action-icon-btn edit" onClick={() => handleEditClick(item._id)} title="Edit">
                        <EditNoteIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button className="action-icon-btn delete" onClick={() => handleDeleteClick(item._id)} title="Delete">
                        <DeleteForeverIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTransaction && (
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" type="text" placeholder={editingTransaction[0]?.title} value={values.title} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control name="amount" type="number" placeholder={editingTransaction[0]?.amount} value={values.amount} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={values.category} onChange={handleChange}>
                  <option value="">{editingTransaction[0]?.category}</option>
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
                <Form.Control type="text" name="description" placeholder={editingTransaction[0]?.description} value={values.description} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select name="transactionType" value={values.transactionType} onChange={handleChange}>
                  <option value={editingTransaction[0]?.transactionType}>{editingTransaction[0]?.transactionType}</option>
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
            <button className="add-btn" onClick={handleEditSubmit}>Update</button>
          </Modal.Footer>
        </Modal>
      )}
      <ToastContainer />
    </>
  );
};

export default TableData;