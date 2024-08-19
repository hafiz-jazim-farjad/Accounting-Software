import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import Swal from "sweetalert2";
import { query, getDocs, collection } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
export default function Dashboard() {
  const [name, setName] = useState("");
  const [TotalSales, SetTotalSaled] = useState(0)
  const [TotalPurchase, SetTotalPurchase] = useState(0)
  const [TotalCustomers, SetTotalCustomers] = useState(0)
  const [TotalVenders, SetTotalVenders] = useState(0)
  const [TotalProducts, SetTotalProducts] = useState(0)

  async function TotalData() {
    // Sales data
    const q = query(collection(db, "Sales"));
    const querySnapshot = await getDocs(q);
    const salesDataArray = [];
    querySnapshot.forEach((doc) => {
      salesDataArray.push(doc.data());
    });
    const totalSalesLength = salesDataArray.length;
    SetTotalSaled(totalSalesLength)

    // Purchase data
    const q1 = query(collection(db, "Purchase"));
    const querySnapshot1 = await getDocs(q1);
    const PurchaseDataArray = [];
    querySnapshot1.forEach((doc) => {
      PurchaseDataArray.push(doc.data());
    });
    const totalPurchaseLength = PurchaseDataArray.length;
    SetTotalPurchase(totalPurchaseLength)

    // customers data
    const q2 = query(collection(db, "Customers"));
    const querySnapshot2 = await getDocs(q2);
    const customersDataArray = [];
    querySnapshot2.forEach((doc) => {
      customersDataArray.push(doc.data());
    });
    const totalcustomersLength = customersDataArray.length;
    SetTotalCustomers(totalcustomersLength)

    // customers data
    const q3 = query(collection(db, "Venders"));
    const querySnapshot3 = await getDocs(q3);
    const VendersDataArray = [];
    querySnapshot3.forEach((doc) => {
      VendersDataArray.push(doc.data());
    });
    const totalVendersLength = VendersDataArray.length;
    SetTotalVenders(totalVendersLength)

    // customers data
    const q4 = query(collection(db, "Products"));
    const querySnapshot4 = await getDocs(q4);
    const ProductsDataArray = [];
    querySnapshot4.forEach((doc) => {
      ProductsDataArray.push(doc.data());
    });
    const totalProductsLength = ProductsDataArray.length;
    SetTotalProducts(totalProductsLength)


  }
  TotalData();

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

  return (
    <main className="DashboardMain">
      <div className="DashboardleftSideBar">
        <div>
          <h2>Dashboard</h2>
        </div>
        <ul id="ul">
          <Link to="/Dashboard">
            <li> Dashboard</li>
          </Link>
          <Link to="/Vendor">
            <li>Vendor</li>
          </Link>
          {/* <Link to="/Vendor" id='Venders' style={{display:'none'}}><li>See Vendors</li></Link> */}
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
                <span style={{ backgroundColor: "red", color: "white", padding:'10px' , borderRadius: '10px'}}>Logout</span>
              </Link>
            </span>
          </div>
        </div>

        <div className="body">
          <div
            className="sale"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black'
            }}
          >
            <Link to="/SeeSales" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black',
              textDecoration: 'none'

            }}>
              <b style={{ color: "orange", fontSize: "30px" }}> Total Sale</b>
              {TotalSales ? TotalSales : 0}
            </Link>
          </div>

          <div
            className="purchase"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black'

            }}
          >
            <Link to="/SeePurchases" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black',
              textDecoration: 'none'

            }}>

              <b style={{ color: "orange", fontSize: "30px" }}> Total Purchase</b>{" "}
              {TotalPurchase ? TotalPurchase : 0}
            </Link>
          </div>
          <div
            className="Customers"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black'

            }}
          >
            <Link to="/SeeCustomers" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black',
              textDecoration: 'none'

            }}>

              <b style={{ color: "orange", fontSize: "30px" }}> Customers</b>
              {TotalCustomers ? TotalCustomers : 0}
            </Link>
          </div>
        </div>



        <div className="body">
          <div
            className="Venders"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black'


            }}
          >
            <Link to="/SeeVenders" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black',
              textDecoration: 'none'

            }}>

              <b style={{ color: "orange", fontSize: "30px" }}> Total Venders</b> {TotalVenders ? TotalVenders : 0}
            </Link>
          </div>
          <div
            className="Products"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black'


            }}
          >
            <Link to="/SeeProducts" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '35px',
              fontFamily: 'cursive',
              color: 'black',
              textDecoration: 'none'

            }}>

              <b style={{ color: "orange", fontSize: "30px" }}> Total Products</b>{" "}
              {TotalProducts ? TotalProducts : 0}
            </Link>
          </div>
          <div
            className="Employees"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: '15px',
              color: 'black'
            }}
          >
            <b style={{ color: "orange", fontSize: "30px" }}>Total Employees</b>
            Under Construction
          </div>
        </div>
      </div>
    </main>
  );
}
