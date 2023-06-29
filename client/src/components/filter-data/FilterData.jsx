import React, { useEffect, useState } from 'react'
import search from '../../search';
import './FilterData.css'

const FilterData = ({filteredArray, closeFilter, category}) => {

  const [filterArray, setFilterArray] = useState([]);
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [menuList, setMenuList] = useState({
      customer_name: true,
      customer_address: true,
      customer_balance: true,
        
      product_name: true,
      product_price: true,
      product_quantity: true
  })

  const [showMenuList, setShowMenuList] = useState({
    customer: false,
    product: false,
    
  });

  const [showInput, setShowInput] = useState(false);

  const handleMenu = (type) => {
    if (type === 'customer')
      setShowMenuList({...showMenuList, customer: !showMenuList.customer, product: false});
    if (type === 'product')
      setShowMenuList({...showMenuList, customer: false, product: !showMenuList.product});
    if (type === 'close')
      setShowMenuList({...showMenuList, customer: false, product: false});
  }

  const addNewInput = (type) => {
    handleMenu('close');
    setInputType(type)
    setShowInput(true)
  }

  const removeInput = () => {
    setInputType('');
    setShowInput(false);
  }

  const addFilter = () => {
    if (input) {
      // filterArray.length = 0;
      filterArray.push({value: input, inputType})
      setFilterArray(filterArray);
      setMenuList({...menuList, [inputType]: false});
      setInput('');
      setInputType('');
      setShowInput(false);
    }else {
      alert('please fill the input');
    }
  }

  const deleteFilter = (inputType) => {
    
    const deletedArray = filterArray.filter((filter) => {
      return filter.inputType !== inputType;
    });

    setMenuList({...menuList, [inputType]: true})
    setFilterArray(deletedArray)
  }
  
  const submitFilter = async () => {
    if (filterArray.length === 0){
      closeFilter();
      return
    }else {
      if (category === 'draft')
        category = 'transactions_draft';
      const token = localStorage.getItem('token');
      const body = { filterArray };
      const response = await fetch(`http://localhost:5000/api/v1/filter/${category}`, {
        method:"POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();
      filteredArray(parseRes)
      closeFilter();
    }
    
  }

  useEffect(() => {
    if (inputType === 'customer_name') {
      let suggestions = search('customers', input);
      suggestions.then((array) => {
        setSuggestions(array);
      })
    }

    if (inputType === 'product_name') {
      let suggestions = search('products', input);
      suggestions.then((array) => {
        setSuggestions(array);
      })
    }

    if (inputType === 'customer_address') {
      let suggestions = search('customer_address', input);
      suggestions.then((array) => {
        setSuggestions(array);
      })
    }

  },[input])

  return (
    <>
    <section className='filter_container'>
      <div className='close_btn-container'>
      <button className='delete_filter' onClick={() => closeFilter()}><i className="fa-solid fa-xmark"></i></button>
      </div>
        <div className='add_filter-btn_container'>
          {(category !== 'products') && <div className='menu'>
                  <button onClick={() => handleMenu('customer')} className='menu_btn'>customer<i className="fa-solid fa-arrow-down"></i></button>
                  {showMenuList.customer && <ul className='menu_list'>


                      {menuList.customer_name && <li onClick={() => addNewInput('customer_name')} className='first_li'>name</li>}

                      {menuList.customer_address && <li onClick={() => addNewInput('customer_address')}>address</li>}

                      {menuList.customer_balance && <li onClick={() => addNewInput('customer_balance')} className='last_li'>balance</li>}
                    
                  </ul>
                  }
                </div>}


                {category !== 'customers' && <div className='menu'>
                  <button onClick={() => handleMenu('product')} className='menu_btn'>Product<i className="fa-solid fa-arrow-down"></i></button>
                  {showMenuList.product && <ul className='menu_list'>

                    {menuList.product_name && <li onClick={() => addNewInput('product_name')} className='first_li'>Name</li>}

                      {menuList.product_price && <li onClick={() => addNewInput('product_price')}>price</li>}

                      {menuList.product_quantity && <li onClick={() => addNewInput('product_quantity')} className='last_li'>quantity</li>}
                  </ul>
                  }
                </div>}

        </div>

        {showInput && <div className="filter_input-container">
          <><input list='suggestions' onChange={(e) => setInput(e.target.value)} className='filter_input' type="text" placeholder={inputType} />
          <button className='submit_filter' onClick={addFilter}><i className="fa-solid fa-check"></i></button>
          <button onClick={() => removeInput()} className='delete_filter'><i className="fa-solid fa-xmark"></i></button></>
        </div>}
        {suggestions && inputType === 'customer_name' && <datalist id='suggestions'>
        {suggestions.map((suggestion) => {
          return <option id={suggestion.customer_id} key={suggestion.customer_id} value={suggestion.customer_name}></option>
        })}
          </datalist>}

          {suggestions && inputType === 'product_name' && <datalist id='suggestions'>
        {suggestions.map((suggestion) => {
          return <option id={suggestion.product_id} key={suggestion.product_id} value={suggestion.product_name}></option>
        })}
          </datalist>}

        {suggestions && inputType === 'customer_address' && <datalist id='suggestions'>
        {suggestions.map((suggestion) => {
          return <option id={suggestion.custoemr_id} key={suggestion.customer_id} value={suggestion.customer_address}></option>
        })}
          </datalist>}


        <div className='filter-array_data'>
          {filterArray.length !== 0 && filterArray.map((filter, index) => {
            return <article className='filter_data-article' key={index}><h3>{filter.inputType}: <span>{filter.value}</span></h3> <button id={index} onClick={() => deleteFilter(filter.inputType)} className='delete_filter'><i className="fa-solid fa-xmark"></i></button></article>
          })}          
        </div>

        <div className='filter_btn-container'>
          <button onClick={submitFilter} className='filter_btn'>filter</button>
        </div>
        
    </section>
    </>
  )
}

export default FilterData