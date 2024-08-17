import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase/Firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import Swal from 'sweetalert2';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';

function Purchase() {
    const [name, setName] = useState('');
    const [PurchaseDate, SetPurchaseDate] = useState('');
    const [VenderName, SetVenderName] = useState('');
    const [Payment, SetPayment] = useState('');
    const [AdvancePaymentOrNot, SetAdvancePaymentOrNot] = useState('');
    const [PurchasedMoney, SetPurchasedMoney] = useState('');
    const [AdditionalNote, SetAdditionalNote] = useState('');
    const [VenderCode, SetVenderCode] = useState('');
    const venderCodeRef = useRef(null); // Create a ref for the select element

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email);
            } else {
                window.location = "/Login";
            }
        });

        // Function to populate the Vender Code select element
        const func = async () => {
            const q = query(collection(db, "Venders"));
            const querySnapshot = await getDocs(q);
            const selectElement = venderCodeRef.current; // Use ref to get the element
            if (selectElement) {
                selectElement.innerHTML = '';

                // Store Vender data in a way that can be accessed later
                let venderData = {};

                // Add a default "Select" option with an empty value
                selectElement.innerHTML += `<option value="" disabled selected>Select Vender Code</option>`;

                querySnapshot.forEach((doc) => {
                    const Vender = doc.data();
                    const code = Vender.Code;
                    const name = Vender.Name; // Get Vender.Name
                    const Product = Vender.AdditionalInfo; // Get Vender.Name

                    // Store both code and name in the venderData object
                    venderData[code] = {
                        name: name,
                        code: code
                    };

                    // Add option element directly
                    selectElement.innerHTML += `<option value="${code}">${Product} ${code}</option>`;
                });

                // Event listener for dropdown change
                selectElement.addEventListener('change', (event) => {
                    const selectedCode = event.target.value;
                    if (selectedCode) { // Check if a valid option is selected
                        const selectedData = venderData[selectedCode]; // Retrieve Vender data using code
                        if (selectedData) {
                            detailFunction(selectedData.name, selectedData.code); // Call the detail function with Vender.Name and Vender.Code
                        }
                    }
                });
            }
        };

        func();
    }, []);

    // Define the detail function
    const detailFunction = (name, code) => {
        console.log("Vender Name:", name);
        console.log("Vender Code:", code);
        SetVenderName(name);
        SetVenderCode(code);
    };
    const PurchaseCode = Math.floor(Math.random() * 100000)

    const AddPurchase = async () => {
        if (PurchaseDate && VenderName && Payment && AdvancePaymentOrNot && PurchasedMoney && AdditionalNote) {
            try {
                const docRef = await addDoc(collection(db, "Purchase"), {
                    PurchaseCode,
                    VenderCode,
                    PurchaseDate,
                    VenderName,
                    Payment,
                    AdvancePaymentOrNot,
                    PurchasedMoney,
                    AdditionalNote
                });
                console.log("Document written with ID: ", docRef.id);
                Swal.fire({
                    title: 'Purchase Added Successfully',
                    text: 'Purchase Added',
                    icon: 'success',
                    showConfirmButton: false,
                    showCancelButton: false
                });

                // Clear form fields
                SetPurchaseDate('');
                SetVenderName('');
                SetPayment('');
                SetAdvancePaymentOrNot('');
                SetPurchasedMoney('');
                SetAdditionalNote('');
                // Optionally redirect
                setTimeout(() => {
                    window.location = "/SeePurchases";
                }, 2000);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            alert("Please Fill All the Credentials");
        }
    };

    // For date and time
    let forDayInWords = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursady', 'Friday', 'Saturday'];
    let forMonthInWords = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December'];

    let fullDate = new Date();
    let isDay = fullDate.getDay();
    let isDate = fullDate.getDate();
    let isMonth = fullDate.getMonth();
    let isYear = fullDate.getFullYear();

    let finalDay = forDayInWords[isDay];
    let finalMonth = forMonthInWords[isMonth];
    let fullFinalDate = `${finalDay}, ${finalMonth}-${isDate}-${isYear}`;

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
    let fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`;

    let logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "/Login";
        }).catch((error) => {
            // An error happened.
        });
    };

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
                        <Link onClick={logout}><li style={{ backgroundColor: 'red', color: 'white' }}>Logout</li></Link>
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
                    <main className="main">
                        <h2>Purchase</h2>
                        <div className="formGroup">
                            <input className='input' type="text" name="Code" id="Code" placeholder="Purchase Code Will Generate Auto" disabled />
                            <input className='input' type="date" name="date" id="date" placeholder="date" onChange={(e) => { SetPurchaseDate(e.target.value) }} />
                            <select name="Vendo Code" id="VendoCode" className="advancePayment" style={{ height: '50px', borderRadius: '10px', border: '1px solid black' }} onChange={(e) => { SetAdvancePaymentOrNot(e.target.value) }} ref={venderCodeRef}>
                                {/* Options will be dynamically added here */}
                            </select>
                            <input className='input' type="text" name="Vendo name" id="Vendo name" placeholder="Vendo name" value={VenderName} />
                        </div>
                        <div className="formGroup">
                            <input className='input' type="text" name="paymentTerms" id="paymentTerms" placeholder="Cash / Cheque / Account Transfer" onChange={(e) => { SetPayment(e.target.value) }} />
                        </div>
                        <div className="formGroup">
                            <span>
                                <label htmlFor="advancePayment">Advance Payment</label>
                                <select name="advancePayment" className="advancePayment" id="advancePayment" onChange={(e) => { SetAdvancePaymentOrNot(e.target.value) }} >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </span>
                            <input className='input' type="text" name="hmpyr" id="hmpyr" placeholder="In How Much Money you Purchase" onChange={(e) => { SetPurchasedMoney(e.target.value) }} />
                        </div>
                        <div className="formGroup">
                            <input className='input' type="text" name="additionalNote" id="additionalNote" placeholder="Additional Info" onChange={(e) => { SetAdditionalNote(e.target.value) }} />
                        </div>
                        <div style={{ display: 'flex:', justifyContent: 'center', alignItems: 'center', width: '100% important' }}>
                            <button type='submit' id="submit" onClick={AddPurchase} style={{ backgroundColor: 'orange', width: '150px', color: 'white' }}> Add Purchase </button>
                            <p>f</p>
                            <Link to="/SeePurchases"><button type='submit' style={{ backgroundColor: 'orange', width: '150px', color: 'white' }}> See Purchase</button></Link>
                        </div>
                    </main>
                </div>
            </div>
        </main>
    );
}

export default Purchase;
