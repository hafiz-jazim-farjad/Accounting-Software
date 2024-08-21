import React, { useState, useEffect } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import Swal from "sweetalert2";

export default function EditPurchase() {
  const [name, setName] = useState("");

  const [PurchaseDate, SetPurchaseDate] = useState("");
  const [VenderName, SetVenderName] = useState("");
  const [Payment, SetPayment] = useState("");
  const [AdvancePaymentOrNot, SetAdvancePaymentOrNot] = useState("");
  const [AdvancePayment, SetAdvancePayment] = useState("");
  const [PurchasedMoney, SetPurchasedMoney] = useState("");
  const [Quantity, SetQuantity] = useState("");
  const [VenderCode, SetVenderCode] = useState("");
  const [VenderProduct, SetVenderProduct] = useState("");
  // State variables for vendor data

  // Get the current URL from the browser
  const url = window.location.href;

  // Extract the ID from the URL
  const id = url.split("/").pop();

  // Remove the leading colon if it exists
  const PurchasedId = id.startsWith(":") ? id.slice(1) : id;

  console.log(PurchasedId);

  // Check authentication status
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        var email = user.email
        const username = email.substring(0, email.indexOf("@"));
        setName(username);
      } else {
        window.location = "/Login";
      }
    });
  }, []);

  // Fetch vendor details from Firestore
  useEffect(() => {
    if (PurchasedId) {
      const fetchVenderDetails = async () => {
        const docRef = doc(db, "Purchase", PurchasedId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          SetPurchaseDate(data.PurchaseDate);
          SetVenderName(data.VenderName); //not update
          SetPayment(data.Payment);
          SetAdvancePaymentOrNot(data.AdvancePaymentOrNot);
          SetAdvancePayment(data.AdvancePayment);
          SetPurchasedMoney(data.PurchasedMoney);
          SetQuantity(data.Quantity);
          SetVenderCode(data.VenderCode); //not update
          SetVenderProduct(data.VenderProduct); //not update
        } else {
          console.log("No such document!");
        }
      };
      fetchVenderDetails();
    }
  }, [PurchasedId]);

  // Function to handle form submission and update the vendor details
  const EditPurchase = async () => {
    const docRef = doc(db, "Purchase", PurchasedId);
    try {
      await updateDoc(docRef, {
        PurchaseDate,
        VenderName,
        Payment,
        AdvancePaymentOrNot,
        AdvancePayment,
        PurchasedMoney,
        Quantity,
        VenderCode,
        VenderProduct,
      });

      Swal.fire({
        title: "Purchase Updated Successfully",
        text: "Purchase information has been updated.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        window.location = "/SeePurchases";
      }, 2000);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the Purchase.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const AdvanceInput = document.getElementById("Advance");
    if (AdvanceInput) {
      AdvanceInput.disabled = AdvancePaymentOrNot === "no";
    }
  }, [AdvancePaymentOrNot]);

  // Get current date and time
  const forDayInWords = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const forMonthInWords = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fullDate = new Date();
  const isDay = fullDate.getDay();
  const isDate = fullDate.getDate();
  const isMonth = fullDate.getMonth();
  const isYear = fullDate.getFullYear();

  const finalDay = forDayInWords[isDay];
  const finalMonth = forMonthInWords[isMonth];
  const fullFinalDate = `${finalDay}, ${finalMonth}-${isDate}-${isYear}`;

  // Manage time
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isHours = time.getHours().toString().padStart(2, "0");
  const isMinutes = time.getMinutes().toString().padStart(2, "0");
  const isSeconds = time.getSeconds().toString().padStart(2, "0");
  const fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`;

  const logout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = "/Login";
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  };

  return (
    <main className="DashboardMain">
      <div className="DashboardleftSideBar">
        <h2>Dashboard</h2>
        <ul>
          <Link to="/Dashboard">
            <li>Dashboard</li>
          </Link>
          <Link to="/Vendor">
            <li>Add Vendor</li>
          </Link>
          <Link to="/Customer">
            <li>Customer</li>
          </Link>
          <Link to="/Sale">
            <li>Sale</li>
          </Link>
          <Link to="/Purchase">
            <li>Purchase</li>
          </Link>
          <Link to="/Product">
            <li>Product</li>
          </Link>
          <Link to="/Invoice">
            <li>Invoice</li>
          </Link>
          <Link to="/UOM">
            <li>UOM</li>
          </Link>
          <Link to="/Attendance">
            <li>Attendance</li>
          </Link>
          <Link to="/Employee">
            <li>Employee</li>
          </Link>
          <Link to="/Salary">
            <li>Salary</li>
          </Link>
        </ul>
        <div className="login_signup">
          <ul>
            <Link to="/login">
              <li>Login</li>
            </Link>
            <Link to="/signup">
              <li>Signup</li>
            </Link>
            <Link onClick={logout}>
              <li style={{ backgroundColor: "red", color: "white" }}>Logout</li>
            </Link>
          </ul>
        </div>
      </div>
      <div className="DashboardrightSideBar">
        <div className="header">
          <div className="headerLeftSection">
            <span id="one" style={{ fontSize: "15px" }}>
              {fullFinalDate}
            </span>
            <span id="two">Time: {fullTime}</span>
            <span id="three">{name}</span>
          </div>
          <div className="headerRightSection">
            <span>
              <Link onClick={logout}>
                <span style={{ backgroundColor: "red", color: "white", padding: '10px', borderRadius: '10px' }}>Logout</span>
              </Link>
            </span>

          </div>
        </div>
        <div
          className="Productbody"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <main class="main">
            <h2>Purchase</h2>
            <div class="formGroup">
              <input
                className="input"
                value={PurchaseDate}
                type="date"
                name="date"
                id="date"
                placeholder="date"
                onChange={(e) => {
                  SetPurchaseDate(e.target.value);
                }}
              />
              <input
                className="input"
                value={VenderName}
                type="text"
                name="date"
                id="date"
                placeholder="date"
                disabled
              />
              <input
                className="input"
                value={VenderCode}
                type="text"
                name="date"
                id="date"
                placeholder="date"
                disabled
              />
            </div>

            <div class="formGroup">
              <select
                className="input"
                type="text"
                name="paymentTerms"
                id="paymentTerms"
                value={Payment}
                onChange={(e) => {
                  SetPayment(e.target.value);
                }}
              >
                <option value="Select Payment Mathod" disabled selected>
                  Select Payment Mathod
                </option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="AccountTransfer">AccountTransfer</option>
              </select>
              <input
                className="input"
                value={VenderProduct}
                type="text"
                name="date"
                id="date"
                placeholder="date"
                disabled
              />
            </div>
            <div class="formGroup">
              <span>
                <label for="advancePayment">Advance Payment</label>
                <select
                  name="advancePayment"
                  value={AdvancePaymentOrNot}
                  class="advancePayment"
                  id="advancePayment"
                  onChange={(e) => {
                    SetAdvancePaymentOrNot(e.target.value);
                  }}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </span>
              <input
                className="input"
                type="text"
                name="hmpyr"
                id="Advance"
                value={AdvancePayment}
                placeholder="How much money you give advance"
                onChange={(e) => {
                  SetAdvancePayment(e.target.value);
                }}
              />
              <input
                className="input"
                type="text"
                name="hmpyr"
                id="hmpyr"
                value={PurchasedMoney}
                placeholder="In How Much Money you Purchase"
                onChange={(e) => {
                  SetPurchasedMoney(e.target.value);
                }}
              />
            </div>
            <div class="formGroup">
              <input
                className="input"
                type="text"
                name="additionalNote"
                id="additionalNote"
                value={Quantity}
                placeholder="Quantity"
                onChange={(e) => {
                  SetQuantity(e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex:",
                justifyContent: "center",
                alignItems: "center",
                width: "100% important",
              }}
            >
              <button
                type="submit"
                id="submit"
                onClick={EditPurchase}
                style={{
                  backgroundColor: "orange",
                  width: "150px",
                  color: "white",
                }}
              >
                {" "}
                Edit Purchase{" "}
              </button>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
