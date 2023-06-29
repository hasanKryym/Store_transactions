import React, { useEffect, useState } from 'react'
import './AdminTable.css'
import { Link, useAsyncError, useNavigate } from 'react-router-dom';
import checkAuth from '../../checkAuth';
import Product from '../product/Product';
import Customer from '../customer/Customer';
import Transaction from '../transaction/Transaction';
import TransactionDraft from '../transaction-Draft/TransactionDraft';
import DraftForm from '../add-form/draft-form/DraftForm'
import CustomerAddForm from '../add-form/customer-add_form/CustomerAddForm';
import ProductAddForm from '../add-form/product-add_form/ProductAddForm';

import sortData from '../../sort';
import FilterData from '../filter-data/FilterData';

const AdminTable = ({category}) => {

  const [showMenuList, setShowMenuList] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState([]);
  const [unsortedData, setUnsortedData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [sortFromTo, setSortFromTo] = useState({
    from: 0,
    to: 10
  })

  const updateSort = (type) => {
    let sort;
    if (type === 'add') {
      if (unsortedData.length <= 10)
      return
      if (sortFromTo.from >= data.length) {
        sort = {
        from: 0,
        to: 10,
      }
    }else {
       sort = {
        from: sortFromTo.from + 10,
        to: sortFromTo.to + 10,
      }
    }
      } 
      else if (type === 'minus'){
        if (unsortedData.length <= 10)
        return
        if (sortFromTo.from -10 < 0) {
          const remainder = unsortedData.length % 10;
            sort = {
            from: unsortedData.length - remainder,
            to: unsortedData.length,
          }
      }
      else {
        if (sortFromTo.to - 10 < 10){
          sort = {
           from: 0,
           to: 10,
         }
        }else {
          sort = {
           from: sortFromTo.from - 10,
           to: sortFromTo.to - 10,
         }
        }
      }
    }
    setSortFromTo(sort)
  }

  // ADD FORM 
  const [showAddForm, setShowAddForm] = useState(false);

  const closeAddForm = () => {
    setShowAddForm(false);
  }

  const updateData = () => {
    fetchData();
  }

  const closeFilter = () => {
    setShowFilter(false);
  }

  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  },[])

  useEffect(() => {
    setSortFromTo({...sortFromTo, from : 0, to: 10});
  },[category])

  useEffect(() => {
    fetchData();
  },[sortFromTo])

  const checkAdmin = async () => {
     const loggedIn = await checkAuth();
     if(loggedIn !== true)
      navigate('/login_register');
  }


  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/v1/${category}`;

      if (category === 'draft') {
        url = `http://localhost:5000/api/v1/transactions/${category}`;
      }
      
      const response = await fetch(url, {
        headers: {Authorization: `${token}`}
      });

      const data = await response.json();
      setUnsortedData(data);
      setData(sortData(data,sortFromTo.from,sortFromTo.to));
    } catch (err) {
      console.error(err.message);
    }
  }

  const filteredArray = (data) => {
    setData(data);
    setFilterApplied(true);
  }

  const removeFilter = () => {
    fetchData();
    setFilterApplied(false);
  }


  const saveDrafts = async () => {
    try {
      if (data.length === 0)
        return
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/transactions', {
        method: "POST",
        headers: {
          Authorization: `${token}`
        }
      });

      const parseRes = await response.json();
      if (parseRes.success) 
        fetchData();
      else 
        console.error(parseRes.msg);
    } catch (err) {
      console.error(err.message);
    }
  }



  return (
    <>
    <div className='body_container'>
        <section className='content_container'>
            <header>
                {/* buttons */}
                  {category !== 'transactions' && <div className='functional_btns-container'>
                <button onClick={() => setShowAddForm(true)} className='functional_btns'><i className="fa-solid fa-plus"></i></button>
                <button onClick={() => setEditMode(!editMode)} className={`functional_btns ${editMode && 'edit_mode'}`}><i className="fa-regular fa-pen-to-square"></i></button>
                </div>}

                 <div className="search-box">
                    <button onClick={() => setShowFilter(true)} className="btn-search"><i className="fas fa-search"></i></button>
                    
                </div>
                
                <div className='menu'>
                  {category === 'draft' && <button onClick={saveDrafts} className='menu_btn done'>Done</button>}
                  <button onClick={() => setShowMenuList(!showMenuList)} className='menu_btn'>{category} <i className="fa-solid fa-arrow-down"></i></button>
                  {filterApplied && <button className='remove-filter_btn' onClick={removeFilter}>remove filter</button>}
                  {showMenuList && <ul className='menu_list'>
                    <li className='first_li'><Link onClick={() => setShowMenuList(false)} to='/admin_table/customers'>Customers</Link></li>
                    <li><Link onClick={() => setShowMenuList(false)} to='/admin_table/products'>Products</Link></li>
                    <li><Link onClick={() => setShowMenuList(false)} to='/admin_table/drafts'>Drafts</Link></li>
                    <li className='last_li'><Link onClick={() => setShowMenuList(false)} to='/admin_table/transactions'>Transactions</Link></li>
                  </ul>
                  }
                </div>
            </header>

            <div className="sort_btns">
              <button onClick={() => updateSort('minus')} className='sort_left'><i className="fa-solid fa-arrow-left"></i></button>
              <button onClick={() => updateSort('add')} className='sort_right'><i className="fa-solid fa-arrow-right"></i></button>
            </div>

            <div className="table_container">
              <table>
                {category === 'draft' && <>
                <th>customer</th>
                <th>product</th>
                <th>quantity</th>
                <th>final price</th>
                </>}

                {category === 'transactions' && <>
                <th>customer</th>
                <th>product</th>
                <th>quantity</th>
                <th>final price</th>
                </>}

                {category === 'products' && <>
                <th>name</th>
                <th>price</th>
                <th>quantity</th>
                </>}

                {category === 'customers' && <>
                <th>name</th>
                <th>address</th>
                <th>balance</th>
                <th>phone_nb</th>
                </>}
                
                <tbody>
                  
                  {data.length !== 0 && data.map((object) => {
                      if (category === 'products')
                        return <Product updateData={updateData} editMode={editMode} key={object.product_id} {...object}/>
                      else if (category === 'customers')
                      return <Customer updateData={updateData} editMode={editMode} key={object.customer_id} {...object}/>
  
                      else if (category === 'transactions')
                      return <Transaction key={object.transaction_id} {...object}/>
  
                      else if (category === 'draft')
                      return <TransactionDraft updateData={updateData} editMode={editMode} key={object.transaction_id} {...object}/>
                    
                  })}

                </tbody>
              </table>
            </div>
            {data.length === 0 && <h3 className='no_results'>no results found</h3>}

        </section>
            {showAddForm && category === 'draft' && <DraftForm updateData={updateData} closeAddForm={closeAddForm}/>}
            {showAddForm && category === 'customers' && <CustomerAddForm updateData={updateData} closeAddForm={closeAddForm}/>}
            {showAddForm && category === 'products' && <ProductAddForm updateData={updateData} closeAddForm={closeAddForm}/>}

            {showFilter && <FilterData filteredArray={filteredArray} category={category} closeFilter={closeFilter}/>}
            
    </div>
    </>
  )
}

export default AdminTable