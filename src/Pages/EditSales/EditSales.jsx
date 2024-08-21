import React, { useState, useEffect } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, query, collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import Swal from "sweetalert2";

export default function EditSales() {
  const [name, setName] = useState("");

  const [Name, SetName] = useState("");
  const [Contact, SetContact] = useState("");
  const [Email, SetEmail] = useState("");
  const [ProductName, SetProductName] = useState("");
  const [Quantity, SetQuantity] = useState("");
  const [SaledPrice, SetSaledPrice] = useState("");
  const [DeliveryDate, SetDeliveryDate] = useState("");
  const [Payment, SetPayment] = useState("");
  const [AdditionalNote, SetAdditionalNote] = useState("");
  // State variables for vendor data

  // Get the current URL from the browser
  const url = window.location.href;

  // Extract the ID from the URL
  const id = url.split("/").pop();

  // Remove the leading colon if it exists
  const SalesId = id.startsWith(":") ? id.slice(1) : id;

  console.log(SalesId);

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
    if (SalesId) {
      const fetchVenderDetails = async () => {
        const docRef = doc(db, "Sales", SalesId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          SetName(data.Name);
          SetContact(data.Contact);
          SetEmail(data.Email);
          SetProductName(data.ProductName);
          SetQuantity(data.Quantity);
          SetSaledPrice(data.SaledPrice);
          SetDeliveryDate(data.DeliveryDate);
          SetPayment(data.Payment);
          SetAdditionalNote(data.AdditionalNote);
          console.log(data);
        } else {
          console.log("No such document!");
        }
      };
      fetchVenderDetails();
    }
  }, [SalesId]);

  // Function to handle form submission and update the vendor details
  const EditSales = async () => {
    const docRef = doc(db, "Sales", SalesId);
    try {
      await updateDoc(docRef, {
        Name,
        Contact,
        Email,
        ProductName,
        Quantity,
        SaledPrice,
        DeliveryDate,
        Payment,
        AdditionalNote,
      });

      Swal.fire({
        title: "Sale Updated Successfully",
        text: "Sale information has been updated.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        window.location = "/SeeSales";
      }, 2000);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the Sales.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating document: ", error);
    }
  };



  const func = async () => {
    const q = query(collection(db, "Products"));
    const querySnapshot = await getDocs(q);
    const selectElement = document.getElementById("DesiredProduct"); // Use ref to get the element
    if (selectElement) {
      selectElement.innerHTML = "";
      selectElement.innerHTML += `<option value="" disabled selected>Select Product</option>`;
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        const name = product.Name; // Get Vender.Name
        selectElement.innerHTML += `<option value="${name}">${name}</option>`;
      });
    }
  };

  func();


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
          <main className="main">
            <h2>Edit Sales Info</h2>
            <div className="formGroup">
              <input
                className="input"
                type="text"
                name="customerName"
                id="Name"
                placeholder="Customer Name"
                value={Name}
                onChange={(e) => SetName(e.target.value)}
              />
              <input
                className="input"
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Contact Number"
                value={Contact}
                onChange={(e) => SetContact(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <input
                className="input"
                type="email"
                name="email"
                id="email"
                placeholder="Customer Email Address"
                value={Email}
                onChange={(e) => SetEmail(e.target.value)}
              />
              <input
                className="input"
                type="text"
                name="ProductName"
                id="ProductName"
                placeholder="ProductName"
                value={ProductName}
                onChange={(e) => SetProductName(e.target.value)}
                disabled
              />
              <select
                className="input"
                type="text"
                name="ProductName"
                onChange={(e) => SetProductName(e.target.value)}
                id="DesiredProduct"
              ></select>
            </div>
            <div className="formGroup">
              <input
                className="input"
                type="text"
                name="quantity"
                id="Quantity"
                placeholder="Quantity"
                value={Quantity}
                onChange={(e) => SetQuantity(e.target.value)}
              />
              <input
                className="input"
                type="text"
                name="SaledPrice"
                id="SaledPrice"
                placeholder="Saled Price"
                value={SaledPrice}
                onChange={(e) => SetSaledPrice(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <input
                className="input"
                type="date"
                name="saleDate"
                id="Delivery"
                placeholder="Sale Date"
                value={DeliveryDate}
                onChange={(e) => SetDeliveryDate(e.target.value)}
              />
              <select
                className="input"
                name="paymentMethod"
                id="address"
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
            </div>
            <div className="formGroup">
              <input
                className="input"
                type="text"
                name="additionalNote"
                id="additionalNote"
                placeholder="Additional Note About the Customer"
                value={AdditionalNote}
                onChange={(e) => SetAdditionalNote(e.target.value)}
              />
            </div>
            <button type="submit" id="submit" onClick={EditSales}>
              Updated Sale
            </button>
          </main>
        </div>
      </div>
    </main>
  );
}
