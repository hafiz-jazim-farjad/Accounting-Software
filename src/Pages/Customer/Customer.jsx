import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase/Firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../Firebase/Firebase';
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';

function Customer() {
    const [name, setName] = useState('');
    const [Name, SetName] = useState('');
    const [Contact, SetContact] = useState('');
    const [Email, SetEmail] = useState('');
    const [Cnic, SetCnic] = useState('');
    const [DesiredProduct, SetDesiredProduct] = useState('');
    const [Quantity, SetQuantity] = useState('');
    const [DeliveryDate, SetDeliveryDate] = useState('');
    const [Payment, SetPayment] = useState('');
    const [AdditionalNote, SetAdditionalNote] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email);
            } else {
                window.location = "/Login";
            }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    // Date and Time Logic
    const formatDateTime = () => {
        const forDayInWords = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const forMonthInWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const fullDate = new Date();
        const day = forDayInWords[fullDate.getDay()];
        const date = fullDate.getDate();
        const month = forMonthInWords[fullDate.getMonth()];
        const year = fullDate.getFullYear();
        
        return `${day}, ${month}-${date}-${year}`;
    };

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => setTime(new Date());
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    const isHours = time.getHours().toString().padStart(2, '0');
    const isMinutes = time.getMinutes().toString().padStart(2, '0');
    const isSeconds = time.getSeconds().toString().padStart(2, '0');
    const fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`;

    const logout = () => {
        signOut(auth).then(() => {
            window.location.href = "/Login";
        }).catch((error) => {
            console.error("Logout error:", error);
        });
    };

    const AddCustomer = async () => {
        if (Name && Email && Contact && DesiredProduct && Cnic && Quantity && DeliveryDate && Payment && AdditionalNote) {
            try {
                const docRef = await addDoc(collection(db, "Customers"), {
                    Name,
                    Email,
                    Contact,
                    DesiredProduct,
                    Cnic,
                    Quantity,
                    DeliveryDate,
                    Payment,
                    AdditionalNote,
                });
                console.log("Document written with ID: ", docRef.id);
                Swal.fire({
                    title: 'Customer Added Successfully',
                    text: 'Customer Added',
                    icon: 'success',
                    showConfirmButton: false,
                    showCancelButton: false
                });

                // Clear form fields
                SetName('');
                SetContact('');
                SetEmail('');
                SetCnic('');
                SetDesiredProduct('');
                SetQuantity('');
                SetDeliveryDate('');
                SetPayment('');
                SetAdditionalNote('');
                // Optionally redirect
                window.location = "/SeeCustomers";
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            alert("Please Fill All the Credentials");
        }
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
                        <span id="one" style={{ fontSize: '15px' }}>{formatDateTime()} </span>
                        <span id="two">Time: {fullTime}</span>
                        <span id="three">Account</span>
                    </div>
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <main className="main">
                        <h2>Add Customer</h2>
                        <div className="formGroup">
                            <input type="text" name="customerName" id="Name" placeholder="Customer Name" value={Name} onChange={(e) => SetName(e.target.value)} />
                            <input type="tel" name="contactNumber" id="contactNumber" placeholder="Contact Number" value={Contact} onChange={(e) => SetContact(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input type="email" name="email" id="email" placeholder="Customer Email Address" value={Email} onChange={(e) => SetEmail(e.target.value)} />
                            <input type="text" name="cnic" id="CNICnumber" placeholder="CNIC Number" value={Cnic} onChange={(e) => SetCnic(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input type="text" name="desiredProduct" id="DesiredProduct" placeholder="Desired Product" value={DesiredProduct} onChange={(e) => SetDesiredProduct(e.target.value)} />
                            <input type="text" name="quantity" id="Quantity" placeholder="Quantity" value={Quantity} onChange={(e) => SetQuantity(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input type="date" name="saleDate" id="Delivery" placeholder="Sale Date" value={DeliveryDate} onChange={(e) => SetDeliveryDate(e.target.value)} />
                            <input type="text" name="paymentMethod" id="address" placeholder="Cash / Cheque / Account Transfer" value={Payment} onChange={(e) => SetPayment(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input type="text" name="additionalNote" id="additionalNote" placeholder="Additional Note About the Customer" value={AdditionalNote} onChange={(e) => SetAdditionalNote(e.target.value)} />
                        </div>
                        <button type="button" id="submit" onClick={AddCustomer}>Add Customer</button>
                    </main>
                </div>
            </div>
        </main>
    );
}

export default Customer;
