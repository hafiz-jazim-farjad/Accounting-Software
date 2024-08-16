import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../../Firebase/Firebase';
import Swal from 'sweetalert2'


export default function Dashboard() {
    const [name, setName] = useState('')

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setName(user.email)
        } else {
        }
        if (!user) {
            window.location = "/Login"
        }

    });

    // for date 
    let forDayInWords = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursady', 'Friday', 'Saturday']
    let forMonthInWords = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December']

    let fullDate = new Date()
    let isDay = fullDate.getDay()
    let isDate = fullDate.getDate()
    let isMonth = fullDate.getMonth()
    let isYear = fullDate.getFullYear()

    let finalDay;
    let finalMonth;
    for (let i = 0; i < forMonthInWords.length; i++) {

        if (isDay === i) {
            finalDay = forDayInWords[i]
        }
        if (isMonth === i) {
            finalMonth = forMonthInWords[i]
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
    const isHours = time.getHours().toString().padStart(2, '0');
    const isMinutes = time.getMinutes().toString().padStart(2, '0');
    const isSeconds = time.getSeconds().toString().padStart(2, '0');
    let fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`

    let logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "/Login"
        }).catch((error) => {
            // An error happened.
        });
    }

    function ShowVenders() {
        Swal.fire({
            text: "Watch Or Add the Vendors",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "See",
            confirmButtonText: "Add"
        }).then((result) => {
            if (result.isConfirmed) {
                // User clicked "Add"
                window.location.href = "/Vendor";
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // User clicked "See"
                window.location.href = "/SeeVenders";
            }
        });
    }

    return (
        <main className="DashboardMain">
            <div className="DashboardleftSideBar">
                <div>
                    <h2>Dashboard</h2>
                </div>
                <ul id='ul'>
                    <Link to="/Dashboard"><li> Dashboard</li></Link>
                    <Link onClick={ShowVenders}><li>Vendor</li></Link>
                    {/* <Link to="/Vendor" id='Venders' style={{display:'none'}}><li>See Vendors</li></Link> */}
                    <Link to="/Customer"><li>Customer</li></Link>
                    <Link to="/Product"><li>Product</li></Link>
                    <Link to="/UOM"><li>UOM</li></Link>
                    <Link to="/Purchase"><li>Purchase</li></Link>
                    <Link to="/Invoice"><li>Invoice</li></Link>
                    <Link to="/Sale"><li>Sale</li></Link>
                    <Link to="/Attendance"><li>Attendance</li></Link>
                    <Link to="/Employee"><li>Employee</li></Link>
                    <Link to="/Salary"><li>Salary</li></Link>
                </ul>
                <div className="login_signup">
                    <ul>
                        <Link to="/login"><li>Login</li></Link>
                        <Link to="/signup"><li>Signup</li></Link>
                        <Link onClick={logout} ><li style={{ backgroundColor: 'red', color: 'white' }} >Logout</li></Link>
                    </ul>
                </div>
            </div>
            <div className="DashboardrightSideBar">
                <div className="header">
                    <div className="headerLeftSection">
                        <span id="one" style={{ fontSize: '15px' }}>{fullFinalDate} </span>
                        <span id="two">Time: {fullTime}</span>
                        <span id="three">Account</span>
                    </div>
                    <div className="headerRightSection" >
                        <span>{name}</span>
                    </div>
                </div>
                <div className="body">
                    <div className="sale" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><b style={{ color: 'orange', fontSize: '40px' }}> Total Sale</b> 100</div>
                    <div className="purchase" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><b style={{ color: 'orange', fontSize: '40px' }}> Total Purchase</b>  100</div>
                    <div className="attendance" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><b style={{ color: 'orange', fontSize: '40px' }}> Attendance</b>  100</div>
                    <div className="salary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><b style={{ color: 'orange', fontSize: '40px' }}> Total Salary</b>  100</div>
                </div>
            </div>
        </main>
    );
}
