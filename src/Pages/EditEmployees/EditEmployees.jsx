import React, { useState, useEffect } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import Swal from "sweetalert2";

export default function EditEmployees() {
  const [name, setName] = useState("");

  // State variables for vendor data
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Contact, SetContact] = useState("");
  const [ContactPerson, SetContactPerson] = useState("");
  const [Cnic, SetCnic] = useState("");
  const [DateOfBirth, SetDateOfBirth] = useState("");
  const [EmployeeGender, SetEmployeeGender] = useState("");
  const [EmployeePosition, SetEmployeePosition] = useState("");
  const [Adress, SetAdress] = useState("");
  const [Salary, SetSalary] = useState("");

  // Get the current URL from the browser
  const url = window.location.href;

  // Extract the ID from the URL
  const id = url.split("/").pop();

  // Remove the leading colon if it exists
  const EmployeeId = id.startsWith(":") ? id.slice(1) : id;

  console.log(EmployeeId);

  // Check authentication status
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.email);
      } else {
        window.location = "/Login";
      }
    });
  }, []);

  // Fetch vendor details from Firestore
  useEffect(() => {
    if (EmployeeId) {
      const fetchVenderDetails = async () => {
        const docRef = doc(db, "Employees", EmployeeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          SetName(data.Name);
          SetEmail(data.Email);
          SetContact(data.Contact);
          SetContactPerson(data.ContactPerson);
          SetCnic(data.Cnic);
          SetDateOfBirth(data.DateOfBirth);
          SetEmployeeGender(data.EmployeeGender);
          SetEmployeePosition(data.EmployeePosition);
          SetAdress(data.Adress);
          SetSalary(data.Salary);
        } else {
          console.log("No such document!");
        }
      };
      fetchVenderDetails();
    }
  }, [EmployeeId]);

  // Function to handle form submission and update the vendor details
  const EditEmployee = async () => {
    const docRef = doc(db, "Employees", EmployeeId);
    try {
      await updateDoc(docRef, {
        Name,
        Email,
        Contact,
        ContactPerson,
        Cnic,
        DateOfBirth,
        EmployeeGender,
        EmployeePosition,
        Adress,
        Salary
      });
      Swal.fire({
        title: "Employee Updated Successfully",
        text: "Employee information has been updated.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location = "/SeeEmployees";
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the Employee.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating document: ", error);
    }
  };

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
            <span id="three">Account</span>
          </div>
          <div className="headerRightSection">
            <span>{name}</span>
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
                        {/* vendor means jahan sy purchased kr rahy hen */}
                        <h2>Edit Employee</h2>
                        <div class="formGroup">
                            {/* code auto generate krna hy */}
                            <input
                                className="input"
                                type="text"
                                name="Name"
                                id="Name"
                                placeholder="Full Name"
                                value={Name}
                                onChange={(e) => SetName(e.target.value)}
                            />
                            <input
                                className="input"
                                type="email"
                                name="email"
                                id="email"
                                placeholder=" Email Address"
                                value={Email}
                                onChange={(e) => SetEmail(e.target.value)}
                            />
                        </div>

                        <div class="formGroup">
                            <input
                                className="input"
                                type="tel"
                                name="contactNumber"
                                id="contactNumber"
                                placeholder=" Contact Number"
                                value={Contact}
                                onChange={(e) => SetContact(e.target.value)}
                            />
                            <input
                                className="input"
                                type="text"
                                name="contactPerson"
                                id="contactPerson"
                                placeholder="contact 2"
                                value={ContactPerson}
                                onChange={(e) => SetContactPerson(e.target.value)}
                            />
                        </div>
                        <div class="formGroup">
                            <input
                                className="input"
                                type="text"
                                name="CNICnumber"
                                id="CNICnumber"
                                placeholder="CNIC Number"
                                value={Cnic}
                                onChange={(e) => SetCnic(e.target.value)}
                            />
                            {/* stn or ntn me sy koi b ek dal dy ya dono dal dy agar ho tw */}
                            <input
                                className="input"
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Home Address"
                                value={Adress}
                                onChange={(e) => SetAdress(e.target.value)}
                            />
                        </div>
                        <div class="formGroup">
                            <input
                                className="input"
                                type="date"
                                name="Date of birth"
                                value={DateOfBirth}
                                id="Date"
                                onChange={(e) => SetDateOfBirth(e.target.value)}
                            />
                            {/* stn or ntn me sy koi b ek dal dy ya dono dal dy agar ho tw */}
                            <select name="Genders"className="input" value={EmployeeGender} id="Gender" onChange={(e) => SetEmployeeGender(e.target.value)}>
                                <option value="Select" disabled selected> Select </option>
                                <option value="male"> male </option>
                                <option value="female"> female </option>
                            </select>

                        </div>
                        
                        <div class="formGroup">
                            <select name="EmployeePosition"className="input" value={EmployeePosition} id="EmployeePosition" onChange={(e) => SetEmployeePosition(e.target.value)}>
                                <option value="Select" disabled selected> Select </option>
                                <option value="Manager"> Manager </option>
                                <option value="Supervisor"> Supervisor </option>
                                <option value="Normal Employee"> Normal Employee </option>
                            </select>
                        <input
                                className="input"
                                type="text"
                                name="Salary"
                                id="Salary"
                                placeholder="Salary"
                                value={Salary}
                                onChange={(e) => SetSalary(e.target.value)}
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
                                onClick={EditEmployee}
                                style={{
                                    backgroundColor: "orange",
                                    width: "150px",
                                    color: "white",
                                }}
                            >
                                {" "}
                                Add Employee{" "}
                            </button>
                            <p>f</p>{" "}
                            
                        </div>
                    </main>
        </div>
      </div>
    </main>
  );
}
