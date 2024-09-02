import "../../App.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../Firebase/Firebase";
import React from 'react'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import Swal from "sweetalert2";

export default function Employee() {
    // authorized wala name hy yeh
    const [name, setName] = useState("");

    // data wala name hy yeh
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

    const EmployeeId = Math.floor(Math.random() * 100000);


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                var email = user.email
                const username = email.substring(0, email.indexOf("@"));
                setName(username);
            } else {
            }
            if (!user) {
                window.location = "/Login"
            }
        });
    });

    async function AddEmployee() {
        if (
            Name &&
            Email &&
            Contact &&
            ContactPerson &&
            Cnic &&
            DateOfBirth &&
            EmployeeGender &&
            EmployeePosition &&
            Adress &&
            EmployeeGender &&
            Salary
        ) {
            try {
                const docRef = await addDoc(collection(db, "Employees"), {
                    EmployeeId: EmployeeId,
                    Name: Name,
                    Email: Email,
                    Contact: Contact,
                    ContactPerson: ContactPerson,
                    Cnic: Cnic,
                    DateOfBirth: DateOfBirth,
                    EmployeeGender: EmployeeGender,
                    EmployeePosition: EmployeePosition,
                    Adress: Adress,
                    Salary: Salary,
                });

                console.log("Document written with ID: ", docRef.id);
                Swal.fire({
                    title: "Employee Added Successfully",
                    text: "Employee Added",
                    icon: "success",
                    showConfirmButton: false,
                    showCancelButton: false,
                });
                // document.getElementById("Name").value = "";
                // document.getElementById("email").value = "";
                // document.getElementById("contactNumber").value = "";
                // document.getElementById("contactPerson").value = "";
                // document.getElementById("CNICnumber").value = "";
                // document.getElementById("NTNnumber").value = "";
                // document.getElementById("STNnumber").value = "";
                // document.getElementById("address").value = "";
                // document.getElementById("additionalNote").value = "";
                setTimeout(() => {
                    window.location = "/SeeEmployees";
                }, 2000);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            Swal.fire({
                title: "Please Fill All The Credentials",
                text: "Without Filling All The Creedentials You Will Not Be Able To Add Employee Data",
                icon: "error",
                showConfirmButton: false,
                showCancelButton: false,
            });
        }
    }

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
                    <main class="main">
                        {/* vendor means jahan sy purchased kr rahy hen */}
                        <h2>Add Employee</h2>
                        <div class="formGroup">
                            {/* code auto generate krna hy */}
                            <input
                                className="input"
                                type="text"
                                name="Name"
                                id="Name"
                                placeholder="Full Name"
                                onChange={(e) => SetName(e.target.value)}
                            />
                            <input
                                className="input"
                                type="email"
                                name="email"
                                id="email"
                                placeholder=" Email Address"
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
                                onChange={(e) => SetContact(e.target.value)}
                            />
                            <input
                                className="input"
                                type="text"
                                name="contactPerson"
                                id="contactPerson"
                                placeholder="contact 2"
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
                                onChange={(e) => SetCnic(e.target.value)}
                            />
                            {/* stn or ntn me sy koi b ek dal dy ya dono dal dy agar ho tw */}
                            <input
                                className="input"
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Home Address"
                                onChange={(e) => SetAdress(e.target.value)}
                            />
                        </div>
                        <div class="formGroup">
                            <input
                                className="input"
                                type="date"
                                name="Date of birth"
                                id="Date"
                                onChange={(e) => SetDateOfBirth(e.target.value)}
                            />
                            {/* stn or ntn me sy koi b ek dal dy ya dono dal dy agar ho tw */}
                            <select name="Genders" className="input" id="ImportOrLocal" onChange={(e) => SetEmployeeGender(e.target.value)}>
                                <option value="Select" disabled selected> Gender </option>
                                <option value="male"> male </option>
                                <option value="female"> female </option>
                            </select>

                        </div>

                        <div class="formGroup">
                            <select name="Genders" className="input" id="ImportOrLocal" onChange={(e) => SetEmployeePosition(e.target.value)}>
                                <option value="Select" disabled selected> Designation </option>
                                <option value="Manager"> Manager </option>
                                <option value="Supervisor"> Supervisor </option>
                                <option value="Normal Employee"> Normal Employee </option>
                            </select>
                            <input
                                className="input"
                                type="text"
                                name="Salary"
                                id="Date"
                                placeholder="Salary"
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
                                onClick={AddEmployee}
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
                            <Link to="/SeeEmployees">
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: "orange",
                                        width: "150px",
                                        color: "white",
                                    }}
                                >
                                    {" "}
                                    See Employee
                                </button>
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </main>


    )
}
