import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    let navigate=useNavigate();
    const [credentials,setCredintials]=useState({name:"",email:"",password:"",cpassword:""})
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,password,email}=credentials
        const response = await fetch(`http://localhost:3003/api/auth/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // "auth-token":   //password is 12345
                //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYzYjFjNjY5Y2VmODA5MjliZjg5NDAxIn0sImlhdCI6MTcxNTI0NTM5N30.koV2q8hswN4bR8oluC5jBdlAAyDFXr4ABCIRBrmLJD0"
            },
            body:JSON.stringify({name,password,email})
        });
        const json = await response.json();
        console.log(json)
        if (json.success){
            //redirect
            localStorage.setItem('token',json.authtoken);
            navigate('/');
            props.showAlert("welcome to i-notebook!!!","Success")

        }else{
            props.showAlert("Invaild Details!!!","Danger")
        }
    }
    const onChange=(e)=>{
        setCredintials({...credentials,[e.target.name]:e.target.value})
    }
  return (
    <div className='container'>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control"id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control"id="email" name="email" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">password</label>
                    <input type="password" className="form-control" id="password" name="password"  onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">re-enter password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword"  onChange={onChange}/>
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
  )
}

export default Signup
