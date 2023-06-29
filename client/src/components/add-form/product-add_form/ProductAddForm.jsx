import React, { useState } from 'react'

const ProductAddForm = ({updateData, closeAddForm}) => {

    const [inputs, setInputs] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: "",
    customer_number: ''
  });

  const { product_name, product_price, product_quantity } = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name] : e.target.value});
  }

  const addProduct = async (e) => {
    e.preventDefault();
    try {
        if (product_name && product_price && product_quantity) {
            const token = localStorage.getItem('token');
            const body = { product_name, product_price, product_quantity };
            const response = await fetch('http://localhost:5000/api/v1/products', {
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
        <form onSubmit={addProduct} className="edit_form">
            <div className="edit_form-close_btn">
                <button onClick={() => closeAddForm()}><i className="fa-solid fa-xmark"></i></button>
            </div>
      <div className="title">Add Product</div>
      <div className="subtitle">Enter your new Product</div>


      <div className="input-container ic1">
        <input autoComplete='off' id="product_name" className="input" type="text" placeholder=" " name='product_name' onChange={e => onChange(e)}/>
        <div className="cut"></div>
        <label htmlFor="product_name" className="placeholder">Name</label>
      </div>

      <div className="input-container ic2">
        <input id="product_price" className="input" type="number" placeholder=" " name='product_price' onChange={e => onChange(e)}/>
        <div className="cut cut-short"></div>
        <label htmlFor='product_price' className="placeholder">price</label>
      </div>

      <div className="input-container ic2">
        <input id="product_quantity" className="input" type="number" placeholder=" " name='product_quantity' onChange={e => onChange(e)}/>
        <div className="cut cut-short"></div>
        <label htmlFor='product_quantity' className="placeholder">quantity</label>
      </div>

      <div className='submit_btn-container'>
      <button className='submit' type='submit'>submit</button>
    </div>
    </form>

    </div>
    </>
  )
}

export default ProductAddForm