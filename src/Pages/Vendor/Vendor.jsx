import React from 'react'
import '../../App.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../../Firebase/Firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../Firebase/Firebase';
import Swal from 'sweetalert2';

export default function Vendor() {

    // authorized wala name hy yeh
    const [name, setName] = useState('')


    // data wala name hy yeh
    const [Name, SetName] = useState('')
    const [Email, SetEmail] = useState('')
    const [Contact, SetContact] = useState('')
    const [ContactPerson, SetContactPerson] = useState('')
    const [Cnic, SetCnic] = useState('')
    const [NtnNumber, SetNtnNumber] = useState('')
    const [StnNumber, SetStnNumber] = useState('')
    const [Adress, SetAdress] = useState('')
    const [AdditionalInfo, SetAdditionalInfo] = useState('')

    const VenderRandomCode = Math.floor(Math.random() * 100000)
    const VenderGlCode = Math.floor(Math.random() * 100000)
    const VenderGlCodeFull = "PK" + VenderGlCode


    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email)
            } else {
            }
            if (!user) {
                window.location = "/Login"
            }
        });
    })

    async function AddVender() {

        if (Name && Email && Contact && ContactPerson && Cnic && NtnNumber && StnNumber && Adress && AdditionalInfo) {

            try {
                const docRef = await addDoc(collection(db, "Venders"), {
                    "Code": VenderRandomCode,
                    "GLCode": VenderGlCodeFull,
                    "Name": Name,
                    "Email": Email,
                    "Contact": Contact,
                    "ContactPerson": ContactPerson,
                    "Cnic": Cnic,
                    "NtnNumber": NtnNumber,
                    "StnNumber": StnNumber,
                    "Adress": Adress,
                    "AdditionalInfo": AdditionalInfo,
                });

                console.log("Document written with ID: ", docRef.id);
                Swal.fire({
                    title: 'Vender Added Successfully',
                    text: 'Vender Added',
                    icon: 'success',
                    showConfirmButton: false,
                    showCancelButton: false
                })
                document.getElementById("Name").value = '';
                document.getElementById("email").value = '';
                document.getElementById("contactNumber").value = '';
                document.getElementById("contactPerson").value = '';
                document.getElementById("CNICnumber").value = '';
                document.getElementById("NTNnumber").value = '';
                document.getElementById("STNnumber").value = '';
                document.getElementById("address").value = '';
                document.getElementById("additionalNote").value = '';
                setTimeout(() => {
                    window.location = "/SeeVenders"
                }, 2000);

            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            Swal.fire({
                title: 'Please Fill All The Credentials',
                text: 'Without Filling All The Creedentials You Will Not Be Able To Add Vender',
                icon: 'error',
                showConfirmButton: false,
                showCancelButton: false
            })        }


    }

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
    return (

        <main className="DashboardMain">
            <div className="DashboardleftSideBar">
                <h2>Dashboard</h2>
                <ul>
                    <Link to="/Dashboard"><li>Dashboard</li></Link>
                    <Link to="/Vendor"><li>Add Vendor</li></Link>
                    <Link to="/Customer"><li>Customer</li></Link>
                    <Link to="/Sale"><li>Sale</li></Link>
                    <Link to="/Purchase"><li>Purchase</li></Link>
                    <Link to="/Product"><li>Product</li></Link>
                    <Link to="/Invoice"><li>Invoice</li></Link>
                    <Link to="/UOM"><li>UOM</li></Link>
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
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <main class="main">
                        {/* vendor means jahan sy purchased kr rahy hen */}
                        <h2>Vendor Infomation</h2>
                        <div class="formGroup">
                            {/* code auto generate krna hy */}
                            <input type="text" name="Code" id="Code" placeholder="Code will auto grnerate" disabled />
                            <input type="text" name="GLCode" id="GLCode" placeholder="GLCode will auto grnerate" disabled />
                            <input type="text" name="Name" id="Name" placeholder=" Name" onChange={(e) => SetName(e.target.value)} />
                        </div>

                        <div class="formGroup">
                            <input type="email" name="email" id="email" placeholder=" Email Address" onChange={(e) => SetEmail(e.target.value)} />
                            <input type="tel" name="contactNumber" id="contactNumber" placeholder=" Contact Number" onChange={(e) => SetContact(e.target.value)} />
                            <input type="text" name="contactPerson" id="contactPerson" placeholder="Contact Person" onChange={(e) => SetContactPerson(e.target.value)} />
                        </div>
                        <div class="formGroup">
                            <input type="text" name="CNICnumber" id="CNICnumber" placeholder="CNIC Number" onChange={(e) => SetCnic(e.target.value)} />
                            {/* stn or ntn me sy koi b ek dal dy ya dono dal dy agar ho tw */}
                            <input type="text" name="NTNnumber" id="NTNnumber" placeholder="NTN Number" onChange={(e) => SetNtnNumber(e.target.value)} />
                            <input type="text" name="STNnumber" id="STNnumber" placeholder="STN Number" onChange={(e) => SetStnNumber(e.target.value)} />
                        </div>

                        <div class="formGroup">
                            <input type="text" name="address" id="address" placeholder="Address" onChange={(e) => SetAdress(e.target.value)} />
                        </div>

                        <div class="formGroup">
                            <input type="text" name="additionalNote" id="additionalNote" placeholder="Which Product you Buy From This Vender" onChange={(e) => SetAdditionalInfo(e.target.value)} />
                        </div>
                        <div style={{display:'flex:',justifyContent:'center' , alignItems:'center' , width:'100% important'}}>
                        <button type='submit' id="submit" onClick={AddVender}style={{backgroundColor:'orange' , width:'150px' , color:'white'}}> Add Vender </button>
                      <p>f</p> <Link to="/SeeVenders" ><button type='submit' style={{backgroundColor:'orange' , width:'150px' , color:'white'}}> See Vender</button></Link>
                        </div>
                    </main>


                </div>
            </div>
        </main>


    )
}