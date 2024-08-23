import { useState } from "react";
import "./App.css";

function App() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [checkedValue, setCheckedValue] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    let newErrors = {};
    let isValid = true;

    if (!data.amount.trim()) {
      newErrors.amount = "This field is required";
      isValid = false;
    }

    if (!data.term.trim()) {
      newErrors.term = "This field is required";
      isValid = false;
    }

    if (!data.rate.trim()) {
      newErrors.rate = "This field is required";
      isValid = false;
    }

    if (!data.type) {
      newErrors.type = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateMortgage = (amount, term, rate, type) => {
    const n = term * 12; // Vade süresi (ay cinsinden)
    const monthlyRate = rate / 12 / 100; // Aylık faiz oranı

    let EMI, totalPayment;

    if (type === "repayment") {
      // Aylık Taksit (EMI) hesaplama formülü
      EMI = Number((amount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
      totalPayment = EMI * n; // Toplam geri ödeme
    } else if (type === "interest") {
      // Sadece Faiz (Interest Only) Hesaplama
      EMI = amount * monthlyRate;
      totalPayment = EMI * n + amount; // Toplam geri ödeme (anapara + faiz)
    }
    return {
      monthlyPayment: EMI.toFixed(2), // Aylık Taksit
      totalPayment: totalPayment.toFixed(2), // Toplam Geri Ödeme
    };
  };

  const submit = (e) => {
    e.preventDefault();
    const keys = new FormData(e.target);
    const data = Object.fromEntries(keys);

    if (validate(data)) {
      const { monthlyPayment, totalPayment } = calculateMortgage(
        Number(data.amount),
        Number(data.term),
        Number(data.rate),
        data.type
      );

      setMonthly(monthlyPayment);
      setTotalAmount(totalPayment);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <form onSubmit={submit} className="form">
          <div className="lc-header">
            <h4 className="title">Mortgage Calculator</h4>
            <button onClick={() => setCheckedValue(null)} type="reset" className="clear-btn">
              Clear All
            </button>
          </div>
          <div className="input">
            <label>Mortgage Amount</label>
            <input name="amount" type="number" style={{ borderColor: errors.amount ? "red" : "" }} />
            {errors.amount && <p className="error">{errors.amount}</p>}
          </div>
          <div className="inputs">
            <div>
              <label>Mortgage Term</label>
              <input name="term" type="text" style={{ borderColor: errors.term ? "red" : "" }} />
              {errors.term && <p className="error">{errors.term}</p>}
            </div>
            <div>
              <label>Interest Rate</label>
              <input name="rate" type="text" style={{ borderColor: errors.rate ? "red" : "" }} />
              {errors.rate && <p className="error">{errors.rate}</p>}
            </div>
          </div>
          <div className="input">
            <label>Mortgage Type</label>
            <div className={checkedValue === "repayment" ? "radio-div yellow-bg" : "radio-div"}>
              <input
                onChange={(e) => setCheckedValue(e.target.value)}
                id="repayment"
                type="radio"
                value="repayment"
                name="type"
              />
              <label htmlFor="repayment" className="bold-label">
                Repayment
              </label>
            </div>
            <div className={checkedValue === "interest" ? "radio-div yellow-bg" : "radio-div"}>
              <input onChange={(e) => setCheckedValue(e.target.value)} id="interest" type="radio" value="interest" name="type" />
              <label htmlFor="interest" className="bold-label">
                Interest Only
              </label>
            </div>
            {errors.type && <p className="error">{errors.type}</p>}
          </div>
          <div>
            <button type="submit" className="calc-btn">
              <i className="fa-solid fa-calculator"></i>
              <p>Calculate Repayments</p>
            </button>
          </div>
        </form>
      </div>
      <div className="right-container">
        {monthly > 0 || totalAmount > 0 ? (
          <div>
            <div>
              <h1>Your results</h1>
              <p>
                Your results are shown below based on the information you provided. To adjust the results, edit the form and click
                “calculate repayments” again.
              </p>
            </div>
            <div className="calc-box">
              <div className="monthly">
                <p>Your monthly repayments</p>
                <h1>£{monthly}</h1>
              </div>
              <div className="total-amount">
                <p>Total you'll repay over the term</p>
                <h2>£{totalAmount}</h2>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-container">
            <img src="/empty-img.svg" alt="calc-img" />
            <h4>Results shown here</h4>
            <h5>Complete the form and click “calculate repayments” to see what your monthly repayments would be.</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
