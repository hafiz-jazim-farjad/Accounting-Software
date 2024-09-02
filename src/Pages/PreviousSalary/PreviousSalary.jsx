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



export default function PreviousSalary() {
    const [name, setName] = useState("");
    const [DateInput, SetDateInput] = useState("");


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

    async function GetSallary() {
        const q = query(collection(db, "Salary"));
        const querySnapshot = await getDocs(q);

        let rows = "";
        querySnapshot.forEach((doc) => {
            const Salary = doc.data();
            const rowId = doc.id;
if(DateInput == Salary.todayDate){

    
    rows += `
    <tr data-id="${rowId}">
    <td>${Salary.employeeName}</td>  
    <td className="mobile-header">${Salary.employeeGender}</td>
    <td className="mobile-header">${Salary.employeeposition}</td>
    <td className="mobile-header">${Salary.salary}</td>
    <td className="mobile-header">${Salary.todayDate}</td>
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
                        title: "Update salary will come soom",
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

    GetSallary();


    return (
        <main className="DashboardMain">
            <div className="DashboardrightSideBar" style={{marginTop:'-300px'}}>
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
                                <th colSpan={2}><span> <Link to={'/SeeSalary'}> <FontAwesomeIcon icon={faCircleArrowLeft} /> Back </Link> </span></th>
                                <th colSpan={2} > <input type="text" onChange={(e)=> SetDateInput(e.target.value)} placeholder="8/30/2024"/> </th>
                                <th colSpan={2} ><span>  </span></th>
                            </tr>
                            <tr
                                className="table-headers"
                                style={{ fontSize: "12px", overflow: "scroll" }}
                            >
                                <th>Employee Name</th>
                                <th>Employee Gender</th>
                                <th>Employee Position</th>
                                <th>Salary</th>
                                <th>Attendance Date</th>
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
