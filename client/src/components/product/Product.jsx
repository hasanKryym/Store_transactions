import React, { useState } from 'react'

const Product = ({product_id, product_name, product_price, product_quantity, editMode, updateData}) => {

  const [showDetails, setShowDetails] = useState(false);

  const deleteProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/products/${product_id}`, {
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
        <tr key={product_id} id={product_id}>
            <td>{product_name}</td>
            <td>{product_price}</td>
            <td>{product_quantity}</td>
            {editMode && <td><button onClick={deleteProduct} className='functional_btns delete'><i className="fa-solid fa-trash"></i></button></td>}
            
        </tr>


        
        
    </>
  )
}

export default Product