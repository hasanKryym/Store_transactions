import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import './Login_register.css'
import { Link, useNavigate } from 'react-router-dom'
import checkAuth from '../../checkAuth'

const Login_register = () => {

  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(true);
  const [showForm, setShowForm] = useState(true);

  const [inputs, setInputs] = useState({
    admin_name: "",
    admin_email: "",
    admin_password: ""
  });

  const {admin_name, admin_email, admin_password } = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name] : e.target.value});
  }

  useEffect(() => {
    checkAdmin();

    // (async () => {

    // })();

  },[])

  const checkAdmin = async () => {
     const loggedIn = await checkAuth();
     if(loggedIn === true) {
       setShowForm(false);
       navigate("/admin_table")
    }
    else {
      setShowForm(true);
    }
  }

  const signup = async (e) => {
    e.preventDefault();
    try {
      if (admin_name && admin_email && admin_password){
       const body = {admin_name, admin_email, admin_password};
       const response = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body)
       });

       const parseRes = await response.json();

       if(parseRes.token){
         localStorage.setItem('token', parseRes.token);
         localStorage.setItem('admin_id', parseRes.admin_id)
         setShowForm(false);
       }

      }
      
    } catch (err) {
      console.log(err.message);
    }
  }

  const login = async(e) => {
    e.preventDefault();
    try {
      if (admin_email && admin_password){
       const body = {admin_email, admin_password};
       const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body)
       });

       const parseRes = await response.json();
       if(parseRes.token){
         localStorage.setItem('token', parseRes.token);
         localStorage.setItem('admin_id', parseRes.admin_id);
         setShowForm(false);
         navigate('/admin_table/drafts')
       }else {
        setInputs({...inputs, admin_email : '', admin_password: ''});
        alert('Invalid email/password combination');
       }
      

      }
      
    } catch (err) {
      console.log(err.message);
    }
  }


  return (
    <Fragment>
      <div className="container">
        <input type="chekbox" id='check' />
        
        {!showLogin && showForm &&

        <div className="signup form">
            <header>Signup</header>
            <form onSubmit={signup}>
              <input type="text" name="admin_name" placeholder='name'
              value={admin_name} 
              onChange={e => onChange(e)}
          />
              <input type="email" name="admin_email" placeholder='email' 
              value={admin_email} 
              onChange={e => onChange(e)}
          />
              <input type="password" name="admin_password" placeholder='password'
              value={admin_password} 
              onChange={e => onChange(e)}
          />
            
              <input type="submit" className="button" value="Signup"/>
            </form>
            <div className="signup">
               <span className="signup">Already have an account?
                <button onClick={() => {setShowLogin(true)}}>login</button>
              </span>
            </div>
          </div>
        }


        {showLogin && showForm &&
        <div className='login form'>
          <header>Login</header>
          <form onSubmit={login}>
            <input type="email" name="admin_email" placeholder='email' 
              value={admin_email} 
              onChange={e => onChange(e)}
          />
            <input type="password" name="admin_password" placeholder='password'
              value={admin_password} 
              onChange={e => onChange(e)}
          />
            <input type="submit" className="button" value="Login"/>
          </form>

          <div className="signup">
            <span className="signup">Don't have an account?
            <button onClick={() => {setShowLogin(false)}}>Sign up</button>
            </span>
          </div>
        </div>
        }
        
        
  
      </div>

    </Fragment>   
  )
}

export default Login_register
