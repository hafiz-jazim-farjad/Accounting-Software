import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { addDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

function Purchase() {
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
  const [ImportOrLocal, SetImportOrLocal] = useState('')
  const [ProductNature, SetProductNature] = useState('')
  const [AdditionalInfo, SetAdditionalInfo] = useState('')
  const venderCodeRef = useRef(null); // Create a ref for the select element
  const moneyInputRef = useRef(null); // Create a ref for the money input element

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

    // Function to populate the Vender Code select element
  }, []);

  const func = async () => {
    const q = query(collection(db, "Venders"));
    const querySnapshot = await getDocs(q);
    const selectElement = venderCodeRef.current; // Use ref to get the element
    if (selectElement) {
      selectElement.innerHTML = "";

      // Store Vender data in a way that can be accessed later
      let venderData = {};

      // Add a default "Select" option with an empty value
      selectElement.innerHTML += `<option value="" disabled selected>Select Vender Code</option>`;

      querySnapshot.forEach((doc) => {
        const Vender = doc.data();
        const code = Vender.Code;
        const name = Vender.Name; // Get Vender.Name
        const Product = Vender.ProductName; // Get Vender.Name

        // Store both code and name in the venderData object
        venderData[code] = {
          name: name,
          code: code,
          Product: Product,
        };

        // Add option element directly
        selectElement.innerHTML += `<option value="${code}">${Product} : ${code}</option>`;
      });

      // Event listener for dropdown change
      selectElement.addEventListener("change", (event) => {
        const selectedCode = event.target.value;
        if (selectedCode) {
          // Check if a valid option is selected
          const selectedData = venderData[selectedCode]; // Retrieve Vender data using code
          if (selectedData) {
            detailFunction(
              selectedData.name,
              selectedData.code,
              selectedData.Product
            ); // Call the detail function with Vender.Name and Vender.Code
          }
        }
      });
    }
  };

  func();

  // Define the detail function
  const detailFunction = (name, code, Product) => {
    SetVenderName(name);
    SetVenderCode(code);
    SetVenderProduct(Product);
  };

  const PurchaseCode = Math.floor(Math.random() * 100000);
  const ProductRandomCode = Math.floor(Math.random() * 100000)

  const AddPurchase = async () => {
    if (
      PurchaseDate &&
      VenderName &&
      Payment &&
      AdvancePaymentOrNot &&
      Quantity
    ) {
      try {
        const docRef = await addDoc(collection(db, "Purchase"), {
          PurchaseCode,
          VenderCode,
          VenderProduct,
          PurchaseDate,
          VenderName,
          Payment,
          AdvancePaymentOrNot,
          AdvancePayment,
          PurchasedMoney,
          Quantity,
        });
        const docRef2 = await addDoc(collection(db, "Products"), {
          ProductRandomCode,
          "Name": VenderProduct,
          ImportOrLocal,
          ProductNature,
          "AdditionalInfo": VenderProduct + "Product",
        });

        Swal.fire({
          title: 'Product Added Successfully',
          text: 'Product Added',
          icon: 'success',
          showConfirmButton: false,
          showCancelButton: false
        })
        // document.getElementById("Name").value = '';
        // document.getElementById("ImportOrLocal").value = '';
        // document.getElementById("ProductNature").value = '';
        // document.getElementById("AdditionalInfo").value = '';

        console.log("Document written with ID: ", docRef.id);
        console.log("Document written with ID: ", docRef2.id);
        Swal.fire({
          title: "Purchase Added Successfully",
          text: "Purchase Added",
          icon: "success",
          showConfirmButton: false,
          showCancelButton: false,
        });

        // Clear form fields
        SetPurchaseDate("");
        SetVenderName("");
        SetPayment("");
        SetAdvancePaymentOrNot("");
        SetPurchasedMoney("");
        SetQuantity("");
        // Optionally redirect
        setTimeout(() => {
          window.location = "/SeePurchases";
        }, 2000);
      } catch (e) {
        console.error("Error adding document: ", e);
      }



    } else {
      alert("Please Fill All the Credentials");
    }
  };

  useEffect(() => {
    const moneyInput = document.getElementById("Money");
    if (moneyInput) {
      moneyInput.disabled = AdvancePaymentOrNot === "no";
    }
  }, [AdvancePaymentOrNot]);

  let logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "/Login";
      })
      .catch((error) => {
        // An error happened.
      });
  };
  // For date and time
  let forDayInWords = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursady",
    "Friday",
    "Saturday",
  ];
  let forMonthInWords = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octuber",
    "November",
    "December",
  ];

  let fullDate = new Date();
  let isDay = fullDate.getDay();
  let isDate = fullDate.getDate();
  let isMonth = fullDate.getMonth();
  let isYear = fullDate.getFullYear();

  let finalDay = forDayInWords[isDay];
  let finalMonth = forMonthInWords[isMonth];
  let fullFinalDate = ` ${finalDay}, ${finalMonth}-${isDate}-${isYear}`;

  // Initial time
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      setTime(new Date());
    };

    // Set interval to update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format time
  const isHours = time.getHours().toString().padStart(2, "0");
  const isMinutes = time.getMinutes().toString().padStart(2, "0");
  const isSeconds = time.getSeconds().toString().padStart(2, "0");
  let fullTime = `${isHours}:${isMinutes}: ${isSeconds}`;

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
            <span id="two">Time:{fullTime}</span>
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
            <h2>Purchase</h2>
            <div className="formGroup">
              <input
                className="input"
                type="text"
                name="Code"
                id="Code"
                placeholder="Purchase Code Will Generate Auto"
                disabled
              />
              <input
                className="input"
                type="date"
                name="date"
                id="date"
                placeholder="date"
                onChange={(e) => {
                  SetPurchaseDate(e.target.value);
                }}
              />
              <select
                name="Vendo Code"
                id="VendoCode"
                className="advancePayment"
                style={{
                  height: "50px",
                  borderRadius: "10px",
                  border: "1px solid black",
                }}
                onChange={(e) => {
                  SetAdvancePaymentOrNot(e.target.value);
                }}
                ref={venderCodeRef}
              >
                {/* Options will be dynamically added here */}
              </select>
              <input
                className="input"
                type="text"
                name="Vendo name"
                id="Vendo name"
                placeholder="Vendo name"
                value={VenderName}
              />
            </div>
            <div className="formGroup">
              <select
                className="input"
                type="text"
                name="paymentTerms"
                id="paymentTerms"
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
              <span>
                <label htmlFor="advancePayment">Advance Payment</label>
                <select
                  name="advancePayment"
                  className="advancePayment"
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
                id="Money"
                placeholder="How much money you give advance"
                onChange={(e) => {
                  SetAdvancePayment(e.target.value);
                }}
              />
            </div>
            <div className="formGroup">
              <input
                className="input"
                type="text"
                name="hmpyr"
                id="purchase"
                placeholder="In how much money you purchase"
                onChange={(e) => {
                  SetPurchasedMoney(e.target.value);
                }}
              />
            </div>
            <div className="formGroup">◘
              <select name="" id="ImportOrLocal" onChange={(e) => SetImportOrLocal(e.target.value)}>
                <option value="Select" disabled selected> Select </option>
                <option value="Local"> Local </option>
                <option value="Import"> Import </option>
              </select>

              <label for="Nature"> Product Nature</label>
              <br />
              <select name="" id="ProductNature" onChange={(e) => SetProductNature(e.target.value)}>
                <option value="Select" disabled selected> Select Product Nature </option>
                <option value="Consumeable"> Consumeable </option>
                <option value="Assests"> Assests </option>
                <option value="Etc"> Etc... </option>
              </select>
            </div>
            <div className="formGroup">
              <input
                className="input"
                type="text"
                name="additionalNote"
                id="additionalNote"
                placeholder="Product Quantity"
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
                onClick={AddPurchase}
                style={{
                  backgroundColor: "orange",
                  width: "150px",
                  color: "white",
                }}
              >
                {" "}
                Add Purchase{" "}
              </button>
              <p>f</p>
              <Link to="/SeePurchases">
                <button
                  type="submit"
                  style={{
                    backgroundColor: "orange",
                    width: "150px",
                    color: "white",
                  }}
                >
                  {" "}
                  See Purchase
                </button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}

export default Purchase;
