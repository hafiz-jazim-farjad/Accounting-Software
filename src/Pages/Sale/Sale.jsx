import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import Swal from 'sweetalert2';
function Sale() {
    // This is use email 
    const [name, setName] = useState('')

    // These are the values of input fields
    const [Name, SetName] = useState('');
    const [Contact, SetContact] = useState('');
    const [Email, SetEmail] = useState('');
    const [ProductName, SetProductName] = useState('');
    const [Quantity, SetQuantity] = useState('');
    const [SaledPrice, SetSaledPrice] = useState('');
    const [DeliveryDate, SetDeliveryDate] = useState('');
    const [Payment, SetPayment] = useState('');
    const [AdditionalNote, SetAdditionalNote] = useState('');
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


    const AddSale = async () => {
        if (Name && Contact && Email && ProductName && Quantity && SaledPrice && DeliveryDate && Payment && AdditionalNote) {
            try {
                const docRef = await addDoc(collection(db, "Sales"), {
                    Name,
                    Contact,
                    Email,
                    ProductName,
                    Quantity,
                    SaledPrice,
                    DeliveryDate,
                    Payment,
                    AdditionalNote,
                });
                console.log("Document written with ID: ", docRef.id);
                Swal.fire({
                    title: 'Sales Added Successfully',
                    text: 'Sales Added',
                    icon: 'success',
                    showConfirmButton: false,
                    showCancelButton: false
                });

                // Clear form fields
                SetName('');
                SetContact('');
                SetEmail('');
                SetProductName('');
                SetQuantity('');
                SetSaledPrice('');
                SetDeliveryDate('');
                SetPayment('');
                SetAdditionalNote('');
                // Optionally redirect
                setTimeout(() => {
                    window.location = "/SeeSales";
                }, 2000);
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
                    <Link to="/Vendor"><li>Vendor</li></Link>
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
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <main class="main">
                        <h2>Sales Record</h2>

                        <div class="formGroup">
                            <input className='input' type="text" name="customerName" id="customerName" placeholder="Customer Name" autofocus onChange={(e) => { SetName(e.target.value) }} />
                            <input className='input' type="tel" name="contactNumber" id="contactNumber" placeholder="Contact Number" onChange={(e) => { SetContact(e.target.value) }} />
                        </div>

                        <div class="formGroup">
                            <input className='input' type="email" name="email" id="email" placeholder="Customer Email Address" onChange={(e) => { SetEmail(e.target.value) }} />
                            <input className='input' type="text" name="product" id="product" placeholder="Product Name" onChange={(e) => { SetProductName(e.target.value) }} />
                        </div>

                        <div class="formGroup">
                            <input className='input' type="number" name="quantity" id="quantity" placeholder="Quantity" onChange={(e) => { SetQuantity(e.target.value) }} />
                            <input className='input' type="number" name="price" id="price" placeholder="Enter Sale Price" onChange={(e) => { SetSaledPrice(e.target.value) }} />
                        </div>

                        <div class="formGroup">
                            <input className='input' type="date" name="saleDate" id="saleDate" placeholder="Sale Date" onChange={(e) => { SetDeliveryDate(e.target.value) }} />
                            <input className='input' type="text" name="paymentMethod" id="paymentMethod" placeholder="Cash / Cheque / Account Transfer" onChange={(e) => { SetPayment(e.target.value) }} />
                        </div>

                        <div class="formGroup">
                            <input className='input' type="text" name="additionalNote" id="additionalNote"
                                placeholder="Additional Note About the Selled Product" onChange={(e) => { SetAdditionalNote(e.target.value) }} />
                        </div>
                        <div style={{ display: 'flex:', justifyContent: 'center', alignItems: 'center', width: '100% important' }}>

                            <button type="submit" id="submit" onClick={AddSale} style={{ backgroundColor: 'orange', width: '150px', color: 'white' }}>Add Sale</button>
                            <p>f</p> <Link to="/SeeSales" ><button type='submit' style={{ backgroundColor: 'orange', width: '150px', color: 'white' }}> See Sale</button></Link>
                        </div>
                    </main>



                </div>
            </div>
        </main>


    )
}

export default Sale
