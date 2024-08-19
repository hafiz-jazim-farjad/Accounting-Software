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
                    title: "Admin Login Successfully",
                    text: "Admin Logined",
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

    // document.addEventListener("keydown" , (e)=>{
    //     if(e.code == "Enter" || e.code == "NumpadEnter"){
    //         if(email.length > 0 && password.length > 0){
    //         signInWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             const user = userCredential.user;
    //             console.log(user);
    //             Swal.fire({
    //                 title: "Admin Login Successfully",
    //                 text: "Admin Logined",
    //                 icon: "success",
    //                 showConfirmButton: false,
    //                 showCancelButton: false,
    //                 showCloseButton: false
    //             });

    //             setTimeout(() => {
    //                 window.location = "/Dashboard"
    //             }, 5000);
    //         })
    //         .catch((error) => {
    //         });
    //     }else{
    //         setTimeout(() => {
                
    //             Swal.fire({
    //                 title: "Wrong Credentials",
    //                 text: "Wrong Credentials",
    //                 icon: "error",
    //                 showConfirmButton: false,
    //                 showCancelButton: false,
    //                 showCloseButton: false
    //             });
    //         }, 3000);
    //     }
    //     }
        
    // })

    const ToSignup = () => {
        window.location = "/SignUp"
    }

    return (
        <main class="main" style={{ backgroundColor: 'rgb(255, 238, 207)', borderRadius: '50px', width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', rowGap: '10px' }}>

                <h2 style={{ textAlign: 'center', color: '#FFB938' }}>Accounts Software
                    <br /> <span style={{ color: 'black' }}>Login</span></h2>
                <input type="text" name="user" id="user" placeholder="username / email" autofocus class="LoginInputs" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="Password" id="Password" placeholder="Password" class="LoginInputs" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" onClick={LoginUser} id="submit" style={{ backgroundColor: '#FFB938' }} > Login </button>
                {/* <button  onClick={ToSignup} style={{backgroundColor:'transparent' , border:'none'}} > SignUp </button> */}
            </div>
        </main>
    )
}
