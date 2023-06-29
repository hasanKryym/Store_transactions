import React, { useState } from 'react'
import './TransactionDraft.css'

const TransactionDraft = ({admin_email, admin_name, customer_email, customer_name, product_name, product_quantity, transaction_date, transaction_id, customer_price, editMode, updateData}) => {

  const finalPrice =  '$' + customer_price * product_quantity ;

  const [showDetails, setShowDetails] = useState(false);

  const deleteDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/transactions/draft/${transaction_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`
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
        <tr onClick={() => setShowDetails(true)} key={transaction_id} id={transaction_id}>
            <td>{customer_name}</td>
            <td>{product_name}</td>
            <td>{product_quantity}</td>
            <td>{finalPrice}</td>
            {editMode && <td><button onClick={deleteDraft} className='functional_btns delete'><i className="fa-solid fa-trash"></i></button></td>}
        </tr>


    {showDetails && <article className='details_article'>
      <div className="edit_form-close_btn">
                <button onClick={() => setShowDetails(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="customer-admin_info">
          <div className="admin_info">
          <h2>Admin</h2>
          <h4>name: <span>{admin_name}</span></h4>
          <h4>email: <span>{admin_email}</span></h4>
          </div>

          <div className="customer_info">
          <h2>Customer</h2>
          <h4>name: <span>{customer_name}</span></h4>
          <h4>email: <span>{customer_email}</span></h4>
          </div>
            </div>

          <div className="transaction_info">
            <h4>date: <span>{transaction_date}</span></h4>
            <h4>customer_price: $<span>{customer_price}</span></h4>
          </div>
        </article>
    }
    </>
  )
}

export default TransactionDraft