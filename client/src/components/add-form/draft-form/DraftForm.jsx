import React, { useEffect, useState } from 'react'
import '../AddForm.css'
import search from '../../../search';
const AddForm = ({closeAddForm, updateData}) => {

    const [inputs, setInputs] = useState({
    customer_name: '',
    product_name: '',
    product_quantity: "",
    customer_price: ''
  });

  const { customer_name, product_name, product_quantity, customer_price } = inputs;
  
  const onChange = (e) => {
    setInputs({...inputs, [e.target.name] : e.target.value});
  }

  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [customer_id, setCustomer_id] = useState('');
  const [product_id, setProduct_id] = useState('');


  useEffect(() => {
    let suggestions = search('customers', customer_name);
    suggestions.then((array) => {
      setNameSuggestions(array);
    })
  },[customer_name])

  useEffect(() => {
    let suggestions = search('products', product_name);
    suggestions.then((array) => {
      setProductSuggestions(array);
    })
  },[product_name])


  const submitDraft = async (e) => {
    e.preventDefault();
    try {
      if (customer_name && product_name && product_quantity && customer_price) {
        const admin_id = localStorage.getItem('admin_id');
        const token = localStorage.getItem('token');
        const body = {admin_id, customer_name, product_name, product_quantity, customer_price};
        const response = await fetch('http://localhost:5000/api/v1/transactions/draft', {
          method: "POST",
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
        }else {
          alert(parseRes.msg + " remaining " + parseRes.stockQuantity)
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <>
        <div className="edit_form_container">
        <form onSubmit={submitDraft} className="edit_form">
            <div className="edit_form-close_btn">
                <button onClick={() => closeAddForm()}><i className="fa-solid fa-xmark"></i></button>
            </div>
      <div className="title">Add Draft</div>
      <div className="subtitle">Enter your new Draft </div>

    <div className='form_inputs'>

    <div className='form_info'>
      

      <div className="input-container ic1">
        <input autocomplete="off" list='names' id="customer_name" className="input" type="text" placeholder=" " name='customer_name' onChange={e => onChange(e)}/>
        <div className="cut"></div>
        <label htmlFor="customer_name" className="placeholder">Customer</label>
      </div>
      {nameSuggestions && <datalist id='names'>
        {nameSuggestions.map((name) => {
          return <option onClick={() => setCustomer_id(name.customer_id)} id={name.customer_id} key={name.customer_id} value={name.customer_name}></option>
        })}
          </datalist>}

      <div className="input-container ic1">
        <input autocomplete="off" list='products' id="product_name" className="input" type="text" placeholder=" " name='product_name' onChange={e => onChange(e)}/>
        <div className="cut"></div>
        <label htmlFor="product_name" className="placeholder">Product</label>
      </div>
      {productSuggestions && <datalist id='products'>
        {productSuggestions.map((product) => {
          return <option onClick={() => setProduct_id(product.product_id)} id={product.product_id} key={product.product_id} value={product.product_name}></option>
        })}
          </datalist>}


    </div>
    <div className='form_nbs'>
      <div className="input-container ic2">
        <input autocomplete="off" id="product_quantity" className="input" type="number" placeholder=" " name='product_quantity' onChange={e => onChange(e)}/>
        <div className="cut cut-short"></div>
        <label htmlFor='product_quantity' className="placeholder">Quantity</label>
      </div>

      <div className="input-container ic2">
        <input autocomplete="off" id="customer_price" className="input" type="number" placeholder=" " name='customer_price' onChange={e => onChange(e)}/>
        <div className="cut cut-short"></div>
        <label htmlFor='customer_price' className="placeholder">Price</label>
      </div>
    </div>
    </div>
    <div className='submit_btn-container'>
      <button className='submit' type='submit'>submit</button>
    </div>


    </form>

    </div>

    </>
  )
}

export default AddForm