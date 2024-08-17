import React, { useState, useEffect } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase/Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import Swal from 'sweetalert2';

export default function EditProduct() {
    const [name, setName] = useState('');

    // State variables for vendor data
    const [Name, SetName] = useState('');
    const [ImportOrLocal, SetImportOrLocal] = useState('');
    const [ProductNature, SetProductNature] = useState('');
    const [AdditionalInfo, SetAdditionalInfo] = useState('');

    // Get the current URL from the browser
    const url = window.location.href;

    // Extract the ID from the URL
    const id = url.split('/').pop();

    // Remove the leading colon if it exists
    const ProductId = id.startsWith(':') ? id.slice(1) : id;

    // Check authentication status
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.email);
            } else {
                window.location = '/Login';
            }
        });
    }, []);

    // Fetch vendor details from Firestore
    useEffect(() => {
        if (ProductId) {
            const fetchVendorDetails = async () => {
                const docRef = doc(db, 'Products', ProductId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    SetName(data.Name);
                    SetImportOrLocal(data.ImportOrLocal);
                    SetProductNature(data.ProductNature);
                    SetAdditionalInfo(data.AdditionalInfo);
                } else {
                    console.log('No such document!');
                }
            };
            fetchVendorDetails();
        }
    }, [ProductId]);

    // Function to handle form submission and update the vendor details
    const UpdateProduct = async () => {
        const docRef = doc(db, 'Products', ProductId);
        try {
            await updateDoc(docRef, {
                Name,
                ImportOrLocal,
                ProductNature,
                AdditionalInfo,
            });
            Swal.fire({
                title: 'Product Updated Successfully',
                text: 'Product information has been updated.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });
            window.location = '/SeeProducts';
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while updating the Product.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            console.error('Error updating document: ', error);
        }
    };

    // Get current date and time
    const forDayInWords = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const forMonthInWords = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const fullDate = new Date();
    const isDay = fullDate.getDay();
    const isDate = fullDate.getDate();
    const isMonth = fullDate.getMonth();
    const isYear = fullDate.getFullYear();

    const finalDay = forDayInWords[isDay];
    const finalMonth = forMonthInWords[isMonth];
    const fullFinalDate = `${finalDay}, ${finalMonth}-${isDate}-${isYear}`;

    // Manage time
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => setTime(new Date());
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const isHours = time.getHours().toString().padStart(2, '0');
    const isMinutes = time.getMinutes().toString().padStart(2, '0');
    const isSeconds = time.getSeconds().toString().padStart(2, '0');
    const fullTime = `${isHours} : ${isMinutes} : ${isSeconds}`;

    const logout = () => {
        signOut(auth)
            .then(() => {
                window.location.href = '/Login';
            })
            .catch((error) => {
                console.error('Error during sign out:', error);
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
                            <li style={{ backgroundColor: 'red', color: 'white' }}>Logout</li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className="DashboardrightSideBar">
                <div className="header">
                    <div className="headerLeftSection">
                        <span id="one" style={{ fontSize: '15px' }}>
                            {fullFinalDate}
                        </span>
                        <span id="two">Time: {fullTime}</span>
                        <span id="three">Account</span>
                    </div>
                    <div className="headerRightSection">
                        <span>{name}</span>
                    </div>
                </div>
                <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <main className="main">
                        <h2>Product Information</h2>
                        <div className="formGroup">
                            <input
                                type="text"
                                name="Code"
                                id="Code"
                                placeholder="Code Will Generate Auto"
                                disabled
                            />
                            <input
                                type="text"
                                name="Name"
                                id="Name"
                                placeholder="Name"
                                value={Name}
                                onChange={(e) => SetName(e.target.value)}
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="ImportOrLocal">Product Type</label>
                            <br />
                            <select
                                name="ImportOrLocal"
                                id="ImportOrLocal"
                                value={ImportOrLocal}
                                onChange={(e) => SetImportOrLocal(e.target.value)}
                            >
                                <option value="Local">Local</option>
                                <option value="Import">Import</option>
                            </select>

                            <label htmlFor="ProductNature">Product Nature</label>
                            <br />
                            <select
                                name="ProductNature"
                                id="ProductNature"
                                value={ProductNature}
                                onChange={(e) => SetProductNature(e.target.value)}
                            >
                                <option value="Consumeable">Consumeable</option>
                                <option value="Assests">Assests</option>
                                <option value="Etc">Etc...</option>
                            </select>
                        </div>
                        <div className="formGroup">
                            <input
                                type="text"
                                name="additionalNote"
                                id="AdditionalInfo"
                                placeholder="Additional Info"
                                value={AdditionalInfo}
                                onChange={(e) => SetAdditionalInfo(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <button
                                type="button"
                                id="submit"
                                onClick={UpdateProduct}
                                style={{ backgroundColor: 'orange', width: '150px', color: 'white' }}
                            >
                                Update Product
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </main>
    );
}
