import '../../App.css'
import { Link } from 'react-router-dom'
import { auth } from '../../Firebase/Firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth'
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

    // This function is use for create a new user
    function CreateUser() {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                alert("Account Created Successfully")
                window.location = "/Login"
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                alert("User Alredy Exist")
            });
    }

    const ToLogin = ()=>{
        window.location = "/Login"
    }

    return (
        <main class="main">
            <div style={{display:'flex' , justifyContent:'center' , alignItems:'center' , flexDirection:'column' , rowGap:'10px'}}>

            <h2>SignUp</h2>
            <input type="text" name="user" id="user" placeholder="username / email" autofocus class="LoginInputs" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" name="Password" id="Password" placeholder="Password" class="LoginInputs" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={CreateUser} id="submit" > SignUp </button>
            <button  onClick={ToLogin} style={{backgroundColor:'transparent' , border:'none'}} > Login </button>
            </div>
        </main>
    )
}
