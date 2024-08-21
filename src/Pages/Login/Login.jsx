import '../../App.css'
import { Link } from 'react-router-dom'
import { auth } from '../../Firebase/Firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth'
import Swal from 'sweetalert2';
export default function SignUp() {

    // These are the States
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')


    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location = "/Dashboard"
        } else {
        }
    });

    // This function can Login the existing user to dashboard
    function LoginUser() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                Swal.fire({
                    title: `${email} Login Successfully`,
                    text: `${email}  Logined`,
                    icon: "success",
                    showConfirmButton: false,
                    showCancelButton: false,
                    showCloseButton: false
                });
                setTimeout(() => {
                    window.location = "/Dashboard"
                }, 5000);
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    title: "Your Credentials are wrong",
                    text: "Wrong Credentials",
                    icon: "error",
                    showConfirmButton: false,
                    showCancelButton: false,
                    showCloseButton: false
                });
            });
    }

    document.addEventListener("keydown", (e) => {
        if (e.code == "Enter" || e.code == "NumpadEnter") {
            if (email.length > 0 && password.length > 0) {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log(user);
                        Swal.fire({
                            title: `${email} Login Successfully`,
                            text: `${email}  Logined`,
                            icon: "success",
                            showConfirmButton: false,
                            showCancelButton: false,
                            showCloseButton: false
                        });

                        setTimeout(() => {
                            window.location = "/Dashboard"
                        }, 5000);
                    })
                    .catch((error) => {
                        console.log(error.code);
                        console.log(error.message);

                    });
            } else {
                setTimeout(() => {

                    Swal.fire({
                        title: "Wrong Credentials",
                        text: "Wrong Credentials",
                        icon: "error",
                        showConfirmButton: false,
                        showCancelButton: false,
                        showCloseButton: false
                    });
                }, 3000);
            }
        }

    })

    const ToSignup = () => {
        window.location = "/SignUp"
    }

    return (
        <main class="main" style={{ backgroundColor: 'rgb(255, 238, 207)', borderRadius: '50px', width: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', rowGap: '10px' }}>

                <h2 style={{ textAlign: 'center', color: 'black' }}>Data Management Software </h2>
                <h2 style={{ color: 'black' }}>Login</h2>
                <input type="text" name="user" id="user" placeholder="username / email" autofocus class="LoginInputs" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="Password" id="Password" placeholder="Password" class="LoginInputs" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" onClick={LoginUser} id="submit"> Login </button>
                <span style={{ textAlign: 'center', textDecoration: 'None', fontSize: '16pt', }}>
                    Made By -
                    <a href="https://techmancy.com" target='_blank' style={{ textAlign: 'center', color: 'blue', textDecoration: 'None', fontSize: '16pt', }}>TechMancy.com </a>
                </span>

                {/* <button  onClick={ToSignup} style={{backgroundColor:'transparent' , border:'none'}} > SignUp </button> */}
            </div>
        </main>
    )
}
