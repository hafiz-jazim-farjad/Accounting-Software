import React from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    doc,
    getDoc,
    query,
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
export default function SeeEmployees() {
    const [name, setName] = useState("");


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email);
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

    async function GetEmployees() {
        const q = query(collection(db, "Employees"));
        const querySnapshot = await getDocs(q);

        let rows = "";
        querySnapshot.forEach((doc) => {
            const Employees = doc.data();
            const rowId = doc.id;
            rows += `
            <tr data-id="${rowId}">
                <td>${Employees.Name}</td>
                <td className="mobile-header">${Employees.Email}</td>
                <td className="mobile-header">${Employees.Contact}</td>
                <td className="mobile-header">${Employees.Cnic}</td>
                <td className="mobile-header">${Employees.Adress}</td>
                <td className="mobile-header">${Employees.EmployeePosition}</td>
            </tr>
            `;
        });

        // Insert rows into the table body
        const tableBody = document.getElementById("TableBody");
        tableBody.innerHTML = rows;

        // Attach event listeners to table rows
        tableBody.querySelectorAll("tr").forEach((row) => {
            row.addEventListener("click", () => {
                const rowId = row.getAttribute("data-id");
                OpenDetail(rowId);
            });
        });
    }

    async function OpenDetail(rowId) {
        // Fetch the specific vendor document based on the rowId
        const docRef = doc(db, "Employees", rowId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const Employee = docSnap.data();

            Swal.fire({
                title: "<strong>Employee Details</strong>",
                icon: "success",
                html: `
                <div className="container">
    <div className="row" style="display: flex justify-content: center; align-items: center;; flex-wrap: wrap;">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                            <h5 style="margin-right: 20px;"><strong>Employee Name:</strong> ${Employee.Name}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee position:</strong> ${Employee.EmployeePosition}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee Id:</strong> ${Employee.EmployeeId}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee Email:</strong> ${Employee.Email}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee Contact:</strong> ${Employee.Contact}</h5>
                            <h5 style="margin-right: 20px;"><strong>Emergency Contact:</strong> ${Employee.ContactPerson}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee CNIC:</strong> ${Employee.Cnic}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee Gender:</strong> ${Employee.EmployeeGender}</h5>
                            <h5 style="margin-right: 20px;"><strong>Date Of Birth:</strong> ${Employee.DateOfBirth}</h5>
                            <h5 style="margin-right: 20px;"><strong>Home Address:</strong> ${Employee.Adress}</h5>
                            <h5 style="margin-right: 20px;"><strong>Salary:</strong> ${Employee.Salary}</h5>
                        </div>
                    </div>
                </div>
                `,
                showCloseButton: true,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Edit",
                confirmButtonColor: "ref",
                cancelButtonColor: "orange",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You want to delete this Employee!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const postRef = doc(db, "Employees", rowId);
                            try {
                                await deleteDoc(postRef);
                            } catch (error) {
                                console.error("Error deleting document: ", error);
                            }
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Employee has been deleted Successfully",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location = `/EditEmployees/id/:${rowId}`;
                }
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "No such document!",
                icon: "error",
                confirmButtonText: "Close",
                confirmButtonColor: "#3085d6",
            });
        }
    }

    GetEmployees();


    return (
        <main className="DashboardMain">
            <div className="DashboardleftSideBar">
                <h2>Dashboard</h2>
                <ul>
                    <Link to="/Dashboard">
                        <li>Dashboard</li>
                    </Link>
                    <Link to="/Vendor">
                        <li>Vendor</li>
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
                        <span id="three">Account</span>
                    </div>
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody">
                    {/* <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow:'hidden ' }}> */}
                    {/* <p>Click the names to see more data.</p> */}

                    <table style={{ width: "100%", cursor: "alias" }}>
                        <thead>
                            <tr
                                className="table-headers"
                                style={{ fontSize: "12px", overflow: "scroll" }}
                            >
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact1</th>
                                <th>CNIC</th>
                                <th>Adress</th>
                                <th>Product Purchased</th>
                            </tr>
                        </thead>
                        {/* <tbody style={{ overflow: 'scroll', height: '100px !important' }} id='TableBody' > */}
                        <tbody id="TableBody">
                            {/* <tr>
      <td>Flex</td>
      <th className="mobile-header">Number</th><td>5478</td>
      <th className="mobile-header">Market rate</th><td>€42.68	</td>
      <th className="mobile-header">Weight</th><td>2%</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
      <th className="mobile-header">Number</th><td>5478</td>
      <th className="mobile-header">Market rate</th><td>€42.68	</td>
      <th className="mobile-header">Weight</th><td>2%</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
      <th className="mobile-header">Value</th><td>€4,676.02</td>
    </tr>
   */}
                            <h3>Loading...</h3>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
