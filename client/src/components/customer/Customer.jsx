import React, { useState } from 'react'
import './Customer.css'
const Customer = ({customer_id, customer_name, customer_email, customer_address, customer_balance, customer_number, editMode, updateData}) => {

  const [showDetails, setShowDetails] = useState(false);

  const deleteCustomer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/customers/${customer_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        }
      });

      const parseRes = await response.json();
      if (parseRes.success) 
      updateData();
      else 
      console.error(parseRes.msg);
      
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <>
        <tr onClick={() => setShowDetails(true)} key={customer_id} id={customer_id}>
            <td>{customer_name}</td>
            <td>{customer_address}</td>
            <td>{customer_balance}</td>
            <td>{customer_number}</td>
            {editMode && <td><button onClick={deleteCustomer} className='functional_btns delete'><i className="fa-solid fa-trash"></i></button></td>}
        </tr>

        {showDetails && <article className='details_article'>
      <div className="edit_form-close_btn">
                <button onClick={() => setShowDetails(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="customer-admin_info">

          <div className="customer_info">
          <h2>Customer</h2>
          <h4>id: <span>{customer_id}</span></h4>
          <h4>name: <span>{customer_name}</span></h4>
          <h4>email: <span>{customer_email}</span></h4>
          <h4>address: <span>{customer_address}</span></h4>
          <h4>balance: $<span>{customer_balance}</span></h4>
          <h4>number: <span>{customer_number}</span></h4>
          </div>
            </div>
        </article>
    }
    </>
  )
}

export default Customer