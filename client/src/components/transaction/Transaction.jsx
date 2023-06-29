import React, { useState } from 'react'
import '../transaction-Draft/TransactionDraft.css'
const Transaction = ({admin_email, admin_name, customer_email, customer_name, product_name, product_quantity, transaction_date, transaction_id, customer_price}) => {

  const finalPrice =  '$' + customer_price * product_quantity ;

  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
        <tr onClick={() => setShowDetails(true)} key={transaction_id} id={transaction_id}>
            <td>{customer_name}</td>
            <td>{product_name}</td>
            <td>{product_quantity}</td>
            <td>{finalPrice}</td>
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

export default Transaction