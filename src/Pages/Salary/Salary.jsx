import "../../App.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import Swal from "sweetalert2";

export default function Salary() {
    const [name, setName] = useState(""); // authorized user name
    const [employeeOptions, setEmployeeOptions] = useState([]); // employee options for dropdown
    const [salary, SetSalary] = useState(""); // attendance status
    const [todayDate, setTodayDate] = useState(""); // current date
    const [employeeGender, setEmployeeGender] = useState(""); // selected employee gender
    const [employeeName, setemployeeName] = useState(""); // selected employee position
    const [employeeposition, setemployeeposition] = useState(""); // selected employee position
    const [employeeId, setemployeeId] = useState(""); // selected employee position
    const [Paid, SetPaid] = useState(""); // selected employee position
    const [EmployeeFullName, SetEmployeeFullName] = useState(""); // selected employee position
    const [EmployeeSalary, SetEmployeeSalary] = useState(""); // selected employee position
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Set current date
        const todayDate = new Date();
        const formattedDate = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`;
        setTodayDate(formattedDate);

        // Authentication check
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email;
                const username = email.substring(0, email.indexOf("@"));
                setName(username);
            } else {
                window.location = "/Login";
            }
        });

        return () => unsubscribe(); // Clean up subscription
    }, []);

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date());
        };

        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const q = query(collection(db, "Employees"));
                const querySnapshot = await getDocs(q);
                const options = [];

                querySnapshot.forEach((doc) => {
                    const employee = doc.data();
                    const employeeName1 = employee.Name;
                    const EmployeePosition = employee.EmployeePosition;
                    const employeegender = employee.EmployeeGender;
                    const employeeId = employee.EmployeeId;
                    const Salary = employee.Salary;
                    SetSalary(Salary)
                    setEmployeeGender(employeegender);
                    setemployeeposition(EmployeePosition);
                    setemployeeId(employeeId);

                    if (!options.some(option => option.value === employeeName1)) {
                        options.push({ value: employeeName1, salary: Salary, label: `${employeeName1} = ${EmployeePosition}` });
                    }
                    
                    console.log(employeeName, 'employeeName');
                    console.log(employee.Name, 'employee.Name');
                    SetEmployeeFullName({ name: employee.Name, salary: employee.Salary });
                });

                setEmployeeOptions(options);
            } catch (error) {
                console.error("Error fetching employee data: ", error);
            }
        };

        fetchEmployeeData();
    }, []);

    useEffect(() => {
        if (employeeName === EmployeeFullName.name) {
            SetEmployeeSalary(EmployeeFullName.salary);
        }
    }, [employeeName, EmployeeFullName]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                window.location.href = "/Login";
            })
            .catch((error) => {
                console.error("Logout error: ", error);
            });
    };

    const AddSalary = async () => {
        try {
            const docRef = await addDoc(collection(db, "Salary"), {
                employeeName: employeeName,
                todayDate: todayDate,
                employeeGender: employeeGender,
                employeeposition: employeeposition,
                employeeId: employeeId,
                Paid: Paid,
                salary: salary,
            });

            console.log("Document written with ID: ", docRef.id);
            Swal.fire({
                title: "Salary Added Successfully",
                text: "Salary Added",
                icon: "success",
                showConfirmButton: false,
                showCancelButton: false,
            });
            setTimeout(() => {
                window.location = "/SeeSalary";
            }, 2000);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
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
                        <Link onClick={handleLogout}>
                            <li style={{ backgroundColor: "red", color: "white" }}>Logout</li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className="DashboardrightSideBar">
                <div className="header">
                    <div className="headerLeftSection">
                        <span id="one" style={{ fontSize: "15px" }}>
                            {/* {fullFinalDate} */} date here
                        </span>
                        <span id="two">Time: </span>
                        <span id="three">{name}</span>
                    </div>
                    <div className="headerRightSection">
                        <span>
                            <Link onClick={handleLogout}>
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
                        <h2>Add This Month Salary</h2>
                        <div className="formGroup">
                            <select
                                name="Employee"
                                className="input"
                                onChange={(e) => setemployeeName(e.target.value)}
                            >
                                <option value="" disabled selected>Select Employee</option>
                                {employeeOptions.map(option => (
                                    <option key={option.value} value={option.value} >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <input type="text" value={EmployeeSalary} className="input"  />
                            
                        </div>
                        <div className="formGroup">
                            <select
                                name="Attendance"
                                className="input"
                                onChange={(e) => SetPaid(e.target.value)}
                            >
                                <option value="Salary Paid Or Not" disabled selected>Salary Paid Or Not</option>
                                <option value="Paid">Paid</option>
                                <option value="Not Paid">Not Paid</option>
                            </select>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                columnGap: '10px'
                            }}
                        >
                            <button
                                type="button"
                                id="submit"
                                onClick={AddSalary}
                                style={{
                                    backgroundColor: "orange",
                                    width: "170px",
                                    color: "white",
                                }}
                            >
                                Add Salary
                            </button>
                            <p> </p>
                            <Link to="/SeeSalary">
                                <button
                                    type="button"
                                    style={{
                                        backgroundColor: "orange",
                                        width: "170px",
                                        color: "white",
                                    }}
                                >
                                    See Salary
                                </button>
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </main>
    );
}
