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
// import icons from Fontawesome 
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';



export default function SeeSalary() {
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
                window.location = "/Login"
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

    async function GetSalary() {
        const q = query(collection(db, "Salary"));
        const querySnapshot = await getDocs(q);

        let rows = "";
        querySnapshot.forEach((doc) => {
            const Employees = doc.data();
            const rowId = doc.id;
            const date = new Date();
            const Finaldatetomatch = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
if(Finaldatetomatch == Employees.todayDate){

    rows += `
    <tr data-id="${rowId}">
    <td>${Employees.employeeName}</td>  
    <td className="mobile-header">${Employees.employeeGender}</td>
    <td className="mobile-header">${Employees.salary}</td>
    <td className="mobile-header">${Employees.todayDate}</td>
    <td className="mobile-header">${Employees.Paid}</td>
    </tr>
    `;
}
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
        const docRef = doc(db, "Salary", rowId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const Employee = docSnap.data();

            Swal.fire({
                title: "<strong>Attendance Details</strong>",
                icon: "success",
                html: `
                <div className="container">
    <div className="row" style="display: flex justify-content: center; align-items: center;; flex-wrap: wrap;">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                            <h5 style="margin-right: 20px;"><strong>Employee Name:</strong> ${Employee.employeeName}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee Gender:</strong> ${Employee.employeeGender}</h5>
                            <h5 style="margin-right: 20px;"><strong>Employee Position:</strong> ${Employee.employeeposition}</h5>
                            <h5 style="margin-right: 20px;"><strong>Salary:</strong> ${Employee.salary}</h5>
                            <h5 style="margin-right: 20px;"><strong>Salary Date:</strong> ${Employee.todayDate}</h5>
                            <h5 style="margin-right: 20px;"><strong>Salary Paid/Unpaid:</strong> ${Employee.Paid}</h5>
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
                        text: "You want to delete this Salary!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const postRef = doc(db, "Salary", rowId);
                            try {
                                await deleteDoc(postRef);
                            } catch (error) {
                                console.error("Error deleting document: ", error);
                            }
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Salary has been deleted Successfully",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // window.location = `/EditEmployees/id/:${rowId}`;
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Update Salary will come soom",
                        showConfirmButton: false,
                        timer: 1500,
                    });
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

    GetSalary();


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
                        <span id="three">{name}</span>
                    </div>
                    <div className="headerRightSection">
                        <span>
                            <Link onClick={logout}>
                                <span style={{ backgroundColor: "red", color: "white", padding: '10px', borderRadius: '10px' }}>Logout</span>
                            </Link>
                        </span>                    </div>
                </div>
                <div className="Productbody">
                    {/* <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow:'hidden ' }}> */}
                    {/* <p>Click the names to see more data.</p> */}

                    <table >
                        <thead style={{width:'100% !important'}}>
                            <tr>
                                <th colSpan={2}><span> <Link to={'/Salary'}> <FontAwesomeIcon icon={faCircleArrowLeft} /> Back </Link> </span></th>
                                <th colSpan={2} >This Month Salary Detail</th>
                                <th colSpan={2} ><span> <Link to={'/PreviousAttendance'}> <FontAwesomeIcon icon={faCircleArrowLeft} /> See more </Link> </span></th>
                            </tr>
                            <tr
                                className="table-headers"
                                style={{ fontSize: "12px", overflow: "scroll" }}
                            >
                                <th>Employee Name</th>
                                <th>Employee Gender</th>
                                <th>Salary</th>
                                <th>Salary Date</th>
                                <th>Paid / UnPaid</th>
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
