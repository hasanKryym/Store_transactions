import React, { useEffect, useState } from 'react'
import '../AddForm.css'

const CustomerAddForm = ({updateData, closeAddForm}) => {

    const [inputs, setInputs] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: "",
    customer_number: ''
  });

  const { customer_name, customer_email, customer_address, customer_number } = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name] : e.target.value});
  }

  const addCustomer = async (e) => {
    e.preventDefault();
    try {
        if (customer_name && customer_email && customer_address && customer_number) {
            const token = localStorage.getItem('token');
            const body = {customer_name, customer_email, customer_address, customer_number};
            const response = await fetch('http://localhost:5000/api/v1/customers', {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
    
            const parseRes = await response.json();
            if (parseRes.success) {
                updateData();
                closeAddForm();
            }
        } else {
            alert('please fill all the inputs')
        }
    } catch (err) {
        console.log(err.message);
    }
  }

  return (
    <>
        <div className="edit_form_container">
        <form onSubmit={addCustomer} className="edit_form">
            <div className="edit_form-close_btn">
                <button onClick={() => closeAddForm()}><i className="fa-solid fa-xmark"></i></button>
            </div>
      <div className="title">Add Customer</div>
      <div className="subtitle">Enter your new Customer</div>


      <div className="input-container ic1">
        <input autoComplete='off' id="customer_name" className="input" type="text" placeholder=" " name='customer_name' onChange={e => onChange(e)}/>
        <div className="cut"></div>
        <label htmlFor="customer_name" className="placeholder">Name</label>
      </div>

      <div className="input-container ic1">
        <input id="customer_email" className="input" type="email" placeholder=" " name='customer_email' onChange={e => onChange(e)}/>
        <div className="cut"></div>
        <label htmlFor="customer_email" className="placeholder">email</label>
      </div>

      <div className="input-container ic1">
        <input autoComplete='off' id="customer_address" className="input" type="text" placeholder=" " name='customer_address' onChange={e => onChange(e)}/>
        <div className="cut"></div>
        <label htmlFor="customer_address" className="placeholder">address</label>
      </div>

      <div className="input-container ic2">
        <input id="customer_number" className="input" type="number" placeholder=" " name='customer_number' onChange={e => onChange(e)}/>
        <div className="cut cut-short"></div>
        <label htmlFor='customer_number' className="placeholder">phone</label>
      </div>
      <div className='submit_btn-container'>
      <button className='submit' type='submit'>submit</button>
    </div>
    </form>

    </div>
    </>
  )
}

export default CustomerAddForm