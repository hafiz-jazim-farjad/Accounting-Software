import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Invoice.css";
import Logo from "./Logo/Logo.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

const Invoice = () => {
  const [SpecificSalesData, SetSpecificSalesData] = useState();

  const [Name, SetName] = useState("");
  const [date, SetDate] = useState("");
  const [email, Setemail] = useState("");
  const [Number, SetNumber] = useState("");
  const [PaymentMethod, SetPaymentMethod] = useState("");
  const [Product, SetProduct] = useState("");
  const [Quantity, SetQuantity] = useState("");
  const [Price, SetPrice] = useState("");
  const [AdditionalInfo, SetAdditionalInfo] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState({
    companyLogo: Logo,
    companyName: "TechMancy Co.",
    companyAddress:
      "R-25, Suit # 409, Asia Pacific trade Center, Pakistan, Karachi ",
    clientName: "XYZ Client ",
    clientAddress: "123 Anywhere St., Any City",
    clientPhone: "+123-456-7890",
    invoiceNumber: "01234",
    invoiceDate: "2024-03-22",
    items: [
      { description: "Laptop", quantity: 2, price: 1500 },
      { description: "Working Desk", quantity: 2, price: 250 },
      { description: "Metal Armchair", quantity: 4, price: 120 },
      { description: "Monitor", quantity: 1, price: 200 },
      { description: "Keyboard", quantity: 3, price: 40 },
    ],
    paymentInfo:
      "XYZ Bank\nAccount Name: TechMancy Co.\nAccount Number: 0123 4567 8901\nPayment Date: 22 March, 2024",
  });

  const handleInputChange = (field, value) => {
    setInvoiceDetails({ ...invoiceDetails, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceDetails.items];
    newItems[index][field] = value;
    setInvoiceDetails({ ...invoiceDetails, items: newItems });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceDetails({ ...invoiceDetails, companyLogo: reader.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeItem = (index) => {
    const newItems = invoiceDetails.items.filter((item, i) => i !== index);
    setInvoiceDetails({ ...invoiceDetails, items: newItems });
  };

  const captureInvoice = () => {
    // Hide the Add Item and Remove buttons
    const buttons = document.querySelectorAll(".hide-on-capture");
    buttons.forEach((button) => button.classList.add("d-none"));

    const invoiceElement = document.getElementById("invoice");
    html2canvas(invoiceElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `invoice_${invoiceDetails.invoiceNumber}.png`;
      link.click();

      // Show the buttons again after capturing
      buttons.forEach((button) => button.classList.remove("d-none"));
    });
  };

  const totalAmount = invoiceDetails.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  const [name, setName] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        var email = user.email
        const username = email.substring(0, email.indexOf("@"));
        setName(username);
      } else {
      }
      if (!user) {
        window.location = "/Login";
      }
    });
  });

  // for date
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

  let finalDay;
  let finalMonth;
  for (let i = 0; i < forMonthInWords.length; i++) {
    if (isDay === i) {
      finalDay = forDayInWords[i];
    }
    if (isMonth === i) {
      finalMonth = forMonthInWords[i];
    }
  }
  let fullFinalDate = `${finalDay}, ${finalMonth}-${isDate}-${isYear}`;

  // for timing

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
  let fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`;

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

  // This is the Dynamic Invoice Generation Code

  const SalesData = async () => {
    // Query the "Sales" collection from the database
    const q = query(collection(db, "Sales"));
    const querySnapshot = await getDocs(q);

    // Get the dropdown element by its ID
    const selectElement = document.getElementById("sales");

    if (selectElement) {
      // Clear any existing options in the dropdown
      selectElement.innerHTML = "";

      // Add a default "Select Vender Code" option
      selectElement.innerHTML += `<option value="" disabled selected>Select Vender Code</option>`;

      // Create an object to store vendor data
      let venderData = {};

      // Loop through each document in the query result
      querySnapshot.forEach((doc) => {
        const Vender = doc.data(); // Get the data from the document

        // Extract vendor details
        const {
          Name,
          DeliveryDate,
          Email,
          Contact,
          Payment,
          ProductName,
          Quantity,
          SaledPrice,
          AdditionalNote,
        } = Vender;

        // Store the vendor data in the venderData object, using Name as the key
        venderData[Name] = {
          Name,
          DeliveryDate,
          Email,
          Contact,
          Payment,
          ProductName,
          Quantity,
          SaledPrice,
          AdditionalNote,
        };

        // Add an option to the dropdown for each vendor
        selectElement.innerHTML += `<option value="${Name}">${Name} - ${DeliveryDate}</option>`;
      });

      // Add an event listener to handle dropdown selection changes
      selectElement.addEventListener("change", (event) => {
        const selectedName = event.target.value; // Get the selected value
        if (selectedName && venderData[selectedName]) {
          // Call the detail function with the selected vendor's data
          detailFunction(venderData[selectedName]);
        }
      });
    }
  };

  // Call the SalesData function to load the dropdown
  SalesData();

  // Function to handle the selected vendor's details
  const detailFunction = (vender) => {
    const {
      Name,
      DeliveryDate,
      Email,
      Contact,
      Payment,
      ProductName,
      Quantity,
      SaledPrice,
      AdditionalNote,
    } = vender;

    // Update the state with the selected vendor's details
    SetSpecificSalesData([
      Name,
      DeliveryDate,
      Email,
      Contact,
      Payment,
      ProductName,
      Quantity,
      SaledPrice,
      AdditionalNote,
    ]);
  };

  // Assuming you're using React, this logs the updated SpecificSalesData whenever it changes
  useEffect(() => {
    if (SpecificSalesData && SpecificSalesData.length > 0) {
      const Name = SpecificSalesData[0];
      const Date = SpecificSalesData[1];
      const email = SpecificSalesData[2];
      const Number = SpecificSalesData[3];
      const PaymentMethod = SpecificSalesData[4];
      const Product = SpecificSalesData[5];
      const Quantity = SpecificSalesData[6];
      const Price = SpecificSalesData[7];
      const AdditionalInfo = SpecificSalesData[8];

      SetName(Name);
      SetDate(Date);
      Setemail(email);
      SetNumber(Number);
      SetPaymentMethod(PaymentMethod);
      SetProduct(Product);
      SetQuantity(Quantity);
      SetPrice(Price);
      SetAdditionalInfo(AdditionalInfo);
    }
  }, [SpecificSalesData]); // Runs whenever SpecificSalesData is updated
  //   console.log("====================================");
  //   console.log(SalesAllData);
  //   console.log("====================================");
  var count = 0;

  var TotalPrice = Price * Quantity;

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
              {fullFinalDate}{" "}
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="forInvoice">
              <div className="container mt-5 mb-5">
                <div
                  className=" d-flex align-items-center justify-content-around mb-3 p-2"
                  style={{
                    backgroundColor: "#FFB938",
                    color: "black",
                    borderRadius: "10px",
                  }}
                >
                  <input
                    className="text-black"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />

                  <select name="Sales" id="sales"></select>

                  <button className="btn btn-light" onClick={captureInvoice}>
                    {" "}
                    Download Invoice as Image
                  </button>
                </div>
                <div
                  id="invoice"
                  className="p-5"
                  style={{
                    backgroundColor: "#FFE4BB",
                    color: "black",
                    borderRadius: "10px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <img
                        src={invoiceDetails.companyLogo}
                        alt="Company Logo"
                        style={{ height: "80px" }}
                      />
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={invoiceDetails.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                      />
                      <textarea
                        className="form-control mt-2"
                        value={invoiceDetails.companyAddress}
                        onChange={(e) =>
                          handleInputChange("companyAddress", e.target.value)
                        }
                      />
                    </div>
                    <div className="text-right">
                      <h1>INVOICE</h1>
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={email ? email : "Email here"}
                        onChange={(e) =>
                          handleInputChange("invoiceNumber", e.target.value)
                        }
                      />
                      <input
                        type="date"
                        className="form-control mt-2"
                        value={date ? date : "Sale Date Here"}
                        onChange={(e) =>
                          handleInputChange("invoiceDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4>Billed To:</h4>
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={Name ? Name : ""}
                      onChange={(e) =>
                        handleInputChange("clientName", e.target.value)
                      }
                    />
                    <textarea
                      className="form-control mt-2"
                      value={AdditionalInfo ? AdditionalInfo : ""}
                      onChange={(e) =>
                        handleInputChange("clientAddress", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={Number ? Number : ""}
                      onChange={(e) =>
                        handleInputChange("clientPhone", e.target.value)
                      }
                    />
                  </div>
                  <div className="Customtable">
                    <table
                      className="table"
                      style={{ backgroundColor: " #FFB938 !important" }}
                    >
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Items</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                          {/* <th className="hide-on-capture">Actions</th>{" "} */}
                          {/* Hide this column during capture */}
                        </tr>
                      </thead>
                      <tbody id="additems">
                        {/* {invoiceDetails.items.map((item, index) => ( */}
                        <tr>
                          <td>{count + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={Product}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={Quantity}
                              onChange={(e) => SetQuantity(e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={Price}
                              onChange={(e) => SetPrice(e.target.value)}
                            />
                          </td>
                          <td>${TotalPrice}</td>
                          {/* <td className="hide-on-capture">
                            <button
                              className="btn btn-danger"
                              onClick={() => removeItem()}
                            >
                              Remove
                            </button>
                          </td> */}
                        </tr>
                        {/* ))} */}
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="text-center mt-3 hide-on-capture">
                    <button
                      className="btn btn-light text-dark"
                      onClick={addItem}
                    >
                      Add Item
                    </button>
                  </div> */}
                  <div className="d-flex justify-content-end mt-4">
                    <h3>Subtotal: ${TotalPrice}</h3>
                  </div>
                  <div className="mt-5">
                    <h5>Payment Information:</h5>
                    <textarea
                      className="form-control"
                      value={PaymentMethod ? PaymentMethod : "Payment Info"}
                      onChange={(e) =>
                        handleInputChange("paymentInfo", e.target.value)
                      }
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-5">
                    <div className="text-left">
                      <span>
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {invoiceDetails.companyAddress}
                      </span>{" "}
                      <br />
                      <span>
                        <i className="fas fa-phone"></i>{" "}
                        {invoiceDetails.clientPhone}
                      </span>{" "}
                      <br />
                      <span>
                        <i className="fas fa-envelope"></i> info@XYZ.com
                      </span>{" "}
                      <br />
                      <span>
                        <i className="fas fa-globe"></i> www.XYZ.com
                      </span>{" "}
                      <br />
                    </div>
                    <div className="text-right">
                      <span>
                        <strong>Signature</strong>
                      </span>{" "}
                      <br />
                      <span>Jazim</span> <br />
                      <span>TechMancy co.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Invoice;
