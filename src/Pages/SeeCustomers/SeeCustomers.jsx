import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, query, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function SeeCustomers() {

  const [name, setName] = useState('')
  const [Customers, SetCustomers] = useState([])

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


  async function getCustomers() {
    const q = query(collection(db, "Customers"));
    const querySnapshot = await getDocs(q);

    let rows = "";

    querySnapshot.forEach((doc) => {
      const Customers = doc.data();

      // Create a unique identifier for each row to pass to OpenDetail
      const rowId = doc.id;

      // Add the row to the table

      rows += `
            <tr data-id="${rowId}">
                <td>${Customers.Name}</td>
                <td className="mobile-header">${Customers.Email}</td>
                <td className="mobile-header">${Customers.Contact}</td>
                <td className="mobile-header">${Customers.Cnic}</td>
                <td className="mobile-header">${Customers.Payment}</td>
            </tr>
            `;

    });

    // Insert rows into the table body
    const tableBody = document.getElementById("TableBody");
    tableBody.innerHTML = rows;

    // Attach event listeners to table rows
    tableBody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        const rowId = row.getAttribute('data-id');
        OpenDetail(rowId);
      });
    });
  }

  async function OpenDetail(rowId) {
    // Fetch the specific vendor document based on the rowId
    const docRef = doc(db, "Customers", rowId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const Customer = docSnap.data();

      Swal.fire({
        title: '<strong>Customer Details</strong>',
        icon: 'success',
        html: `
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h5><strong>Customer Name:</strong> ${Customer.Name}</h5>
                            <h5><strong>Customer Email Code:</strong> ${Customer.Email}</h5>
                            <h5><strong>Customer Contact:</strong> ${Customer.Contact}</h5>
                            <h5><strong>Customer Cnic:</strong> ${Customer.Cnic}</h5>
                            <h5><strong>Customer DeliveryDate:</strong> ${Customer.DeliveryDate}</h5>
                            <h5><strong>Customer Payment:</strong> ${Customer.Payment}</h5>
                            <h5><strong>Customer DesiredProduct:</strong> ${Customer.DesiredProduct}</h5>
                            <h5><strong>AdditionalNote for Customer:</strong> ${Customer.AdditionalNote}</h5>
                            <h5><strong>Customer purchased Quantity</strong> ${Customer.Quantity}</h5>
                        </div>
                    </div>
                </div>
                `,
        showCloseButton: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Edit',
        confirmButtonColor: 'ref',
        cancelButtonColor: 'orange'

      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this Vender!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              const postRef = doc(db, "Customers", rowId);
              try {
                await deleteDoc(postRef);
              } catch (error) {
                console.error("Error deleting document: ", error);
              }
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Vender has been deleted Successfully',
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Are you Sure ?',
            text: 'You Want to Edit This Customer Detail',
            icon: 'success',
            confirmButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            showCloseButton: true,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: 'ref',
            cancelButtonColor: 'orange'
          }).then(async (EditResult) => {
            if (EditResult.isConfirmed) {

              await Swal.fire({
                title: "Select Your Updating Field",
                input: "select",
                inputOptions: {
                  Venders: {
                    Name: 'Name',
                    Email: 'Email',
                    Contact: 'Contact',
                    Cnic: 'Cnic',
                    DeliveryDate: "DeliveryDate",
                    DesiredProduct: "DesiredProduct",
                    PaymentMethod: "Payment",
                    Quantity: "Quantity",
                    AdditionalNote: 'AdditionalNote',
                  },
                },
                inputPlaceholder: "Select a Field that you want to edit",
                showCancelButton: true,
                inputValidator: (value) => {
                  return new Promise(async (resolve) => {
                    if (value === "Name") {
                      const { value: firstname } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer Name',
                        inputPlaceholder: 'Enter New Customer Name Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer Name Here'
                        },
                        showCancelButton: true
                      })
                      if (firstname) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Name: firstname,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Email") {
                      const { value: email } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer Email',
                        inputPlaceholder: 'Enter New Customer Email Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer Email Here'
                        },
                        showCancelButton: true
                      })
                      if (email) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Email: email,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Contact") {
                      const { value: Contact } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer Contact1',
                        inputPlaceholder: 'Enter New Customer Contact1 Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer Contact1 Here'
                        },
                        showCancelButton: true
                      })
                      if (Contact) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Contact: Contact,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Cnic") {
                      const { value: Cnic } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer Cnic',
                        inputPlaceholder: 'Enter New Customer Cnic Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer Cnic Here'
                        },
                        showCancelButton: true
                      })
                      if (Cnic) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Cnic: Cnic,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "DeliveryDate") {
                      const { value: DeliveryDate } = await Swal.fire({
                        input: 'date',
                        inputLabel: 'Update Customer DeliveryDate',
                        inputPlaceholder: 'Enter New Customer DeliveryDate Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer DeliveryDate Here'
                        },
                        showCancelButton: true
                      })
                      if (DeliveryDate) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            DeliveryDate: DeliveryDate,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "DesiredProduct") {
                      const { value: DesiredProduct } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer DesiredProduct',
                        inputPlaceholder: 'Enter New Customer DesiredProduct Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer DesiredProduct Here'
                        },
                        showCancelButton: true
                      })
                      if (DesiredProduct) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            DesiredProduct: DesiredProduct,
                          });
                          window.location.reload()
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "PaymentMethod") {
                      const { value: Payment } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer Payment Method',
                        inputPlaceholder: 'Enter New Customer Payment Method Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer Payment method Here'
                        },
                        showCancelButton: true
                      })
                      if (Payment) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Payment: Payment,
                          });
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "Quantity") {
                      const { value: Quantity } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer Product Quantity',
                        inputPlaceholder: 'Enter New Customer Product Quantity Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer Product Quantity Here'
                        },
                        showCancelButton: true
                      })
                      if (Quantity) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            Quantity: Quantity,
                          });
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else if (value === "AdditionalNote") {
                      const { value: AdditionalNote } = await Swal.fire({
                        input: 'text',
                        inputLabel: 'Update Customer AdditionalNote',
                        inputPlaceholder: 'Enter New Customer AdditionalNote Here',
                        inputAttributes: {
                          'aria-label': 'Enter New Customer AdditionalNote Here'
                        },
                        showCancelButton: true
                      })
                      if (AdditionalNote) {
                        const postRef = doc(db, "Customers", rowId);
                        const postSnapshot = await getDoc(postRef);
                        const postData = postSnapshot.data();

                        try {
                          await updateDoc(postRef, {
                            AdditionalNote: AdditionalNote,
                          });
                          // Optionally, update the UI to reflect the changes
                        } catch (error) {
                          console.error("Error updating document: ", error);
                        }
                      }
                    } else {
                      resolve("Please Select Any One Field");
                    }
                  });
                }
              });

            }
          })
        }
      })
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No such document!',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#3085d6'
      });
    }
  }



  getCustomers();





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
        <div className="Productbody">
          {/* <div className="Productbody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow:'hidden ' }}> */}
          {/* <p>Click the names to see more data.</p> */}

          <table style={{ width: '100%', cursor: 'alias' }}>
            <thead>
              <tr className="table-headers" style={{ fontSize: '12px', overflow: 'scroll' }}>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>CNIC</th>
                <th>Payment</th>
              </tr>
            </thead>
            {/* <tbody style={{ overflow: 'scroll', height: '100px !important' }} id='TableBody' > */}
            <tbody id='TableBody' >

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


  )
}