const pool = require('../db/connect');




const getTransactions = async (req, res) => {
    try {
        const transactions = await pool.query("SELECT * FROM transactions ORDER BY product_quantity DESC");
        let transactionInfo = [];

        const myPromise = new Promise((resolve, reject) => {

            transactions.rows.map( async (transaction, index) => {
            const adminInfo = await pool.query("SELECT admin_name, admin_email FROM admin WHERE admin_id = $1",[transaction.admin_id]);
            const admin_name = adminInfo.rows[0].admin_name;
            const admin_email = adminInfo.rows[0].admin_email;

            const customerInfo = await pool.query("SELECT customer_name, customer_email FROM customers WHERE customer_id = $1", [transaction.customer_id]);

            const customer_name = customerInfo.rows[0].customer_name;
            const customer_email = customerInfo.rows[0].customer_email;

            const productInfo = await pool.query("SELECT product_name FROM products WHERE product_id = $1", [transaction.product_id]);

            const product_name = productInfo.rows[0].product_name;

            const product_quantity = transaction.product_quantity;
            const transaction_id = transaction.transaction_id;
            const transaction_date = transaction.transaction_date;
            const customer_price = transaction.customer_price;
            
            const newTransaction = {
                admin_name,
                admin_email,
                customer_name,
                customer_email,
                product_name,
                product_quantity,
                transaction_date,
                transaction_id,
                customer_price
            }

            transactionInfo.push(newTransaction);
            if (transactions.rows[index+1] === undefined)
            resolve();
        })
    });
    
    myPromise.then(() => res.status(200).json(transactionInfo)).catch(err => console.log(err))
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}





const addDraft = async (req, res) => {
    // try {
    //     const {admin_id, customer_id, product_id, product_quantity, customer_price} = req.body;

    //     let stockQuantity = await pool.query("SELECT product_quantity FROM products WHERE product_id = $1",[product_id]);
    //     stockQuantity = stockQuantity.rows[0].product_quantity
        
    //     if (product_quantity <= stockQuantity){
    //         const insert = await pool.query("INSERT INTO transactions_draft (admin_id, customer_id, product_id, product_quantity, customer_price) VALUES ($1, $2, $3, $4, $5)",[admin_id, customer_id, product_id, product_quantity, customer_price]);

    //         stockQuantity -= product_quantity;

    //         const update = await pool.query("UPDATE products SET product_quantity = $1 WHERE product_id = $2",[stockQuantity, product_id]);
    
    //         return res.status(201).json({success:true, msg: 'transaction draft saved successfully'});
    //     }
    //     else {
    //         return res.status(403).json({success:false, msg: 'dont have enough quantity', stockQuantity})
    //     }
        
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).json({msg: 'Error'});
    // }

    try {
        const {admin_id, customer_name, product_name, product_quantity, customer_price} = req.body;

        let product_id = await pool.query("SELECT product_id FROM products WHERE product_name = $1",[product_name]);
        let customer_id = await pool.query("SELECT customer_id FROM customers WHERE customer_name = $1",[customer_name]);

        if (customer_id.rows.length === 0){
            return res.status(404).json({success: false, msg: 'no customer found'})
        }
        if (product_id.rows.length === 0){
            return res.status(404).json({success: false, msg: 'no product found'})
        
        }
        product_id = product_id.rows[0].product_id;
        customer_id = customer_id.rows[0].customer_id;

        let stockQuantity = await pool.query("SELECT product_quantity FROM products WHERE product_id = $1",[product_id]);
        stockQuantity = stockQuantity.rows[0].product_quantity
        
        if (product_quantity <= stockQuantity){
            const insert = await pool.query("INSERT INTO transactions_draft (admin_id, customer_id, product_id, product_quantity, customer_price) VALUES ($1, $2, $3, $4, $5)",[admin_id, customer_id, product_id, product_quantity, customer_price]);

            stockQuantity -= product_quantity;

            const update = await pool.query("UPDATE products SET product_quantity = $1 WHERE product_id = $2",[stockQuantity, product_id]);
    
            return res.status(201).json({success:true, msg: 'transaction draft saved successfully'});
        }
        else {
            return res.status(403).json({success:false, msg: 'dont have enough quantity', stockQuantity})
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}





const getTransactionsDraft = async (req, res) => {
    try {
        const transactionsDraft = await pool.query("SELECT * FROM transactions_draft ORDER BY product_quantity DESC");
        if (transactionsDraft.rows.length === 0) 
            return res.status(200).json([]);
        let transactionInfo = [];

        const myPromise = new Promise((resolve, reject) => {

            transactionsDraft.rows.map( async (transaction, index) => {
            const adminInfo = await pool.query("SELECT admin_name, admin_email FROM admin WHERE admin_id = $1",[transaction.admin_id]);
            const admin_name = adminInfo.rows[0].admin_name;
            const admin_email = adminInfo.rows[0].admin_email;

            const customerInfo = await pool.query("SELECT customer_name, customer_email FROM customers WHERE customer_id = $1", [transaction.customer_id]);

            const customer_name = customerInfo.rows[0].customer_name;
            const customer_email = customerInfo.rows[0].customer_email;

            const productInfo = await pool.query("SELECT product_name FROM products WHERE product_id = $1", [transaction.product_id]);

            const product_name = productInfo.rows[0].product_name;

            const product_quantity = transaction.product_quantity;
            const transaction_id = transaction.transaction_id;
            const transaction_date = transaction.transaction_date;
            const customer_price = transaction.customer_price;
            
            const newTransaction = {
                admin_name,
                admin_email,
                customer_name,
                customer_email,
                product_name,
                product_quantity,
                transaction_date,
                transaction_id,
                customer_price
            }

            transactionInfo.push(newTransaction);
            if (transactionsDraft.rows[index+1] === undefined)
            resolve();
        })
    });
    
    myPromise.then(() => res.status(200).json(transactionInfo)).catch(err => console.log(err))
    
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}






const deleteTranscationDraft = async (req, res) => {
    try {
        const {id: transaction_id} = req.params;
        const transaction = await pool.query("SELECT product_id, product_quantity FROM transactions_draft WHERE transaction_id = $1", [transaction_id]);
        const transactionQuantity = transaction.rows[0].product_quantity;
        const product_id = transaction.rows[0].product_id;

        let stockQuantity = await pool.query("SELECT product_quantity FROM products WHERE product_id = $1",[product_id]);
        stockQuantity = stockQuantity.rows[0].product_quantity;

        stockQuantity += transactionQuantity;

        const update = await pool.query("UPDATE products SET product_quantity = $1 WHERE product_id = $2",[stockQuantity, product_id]);

        const remove = await pool.query("DELETE FROM transactions_draft WHERE transaction_id = $1",[transaction_id]);

        return res.status(200).json({success: true, msg: 'transaction draft deleted successfully'});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}





const editTranscationDraft = async (req, res) => {
    try {
        const {id: transaction_id} = req.params;
        const {admin_id, customer_id, product_id, product_quantity, customer_price} = req.body;
        let stockQuantity = await pool.query("SELECT product_quantity FROM products WHERE product_id = $1",[product_id]);
        stockQuantity = stockQuantity.rows[0].product_quantity;
        
        if (product_quantity <= stockQuantity){
            const transaction = await pool.query("SELECT product_quantity FROM transactions_draft WHERE transaction_id = $1", [transaction_id]);
            const transactionQuantity = transaction.rows[0].product_quantity;

            if (product_quantity <= transactionQuantity) {
                stockQuantity += (transactionQuantity - product_quantity);
            }else {
                stockQuantity -= (product_quantity - transactionQuantity)
            }

            const insert = await pool.query("UPDATE transactions_draft SET admin_id = $1, customer_id = $2, product_id = $3, product_quantity = $4, customer_price = $5 WHERE transaction_id = $6",[admin_id, customer_id, product_id, product_quantity, customer_price, transaction_id]);

            const update = await pool.query("UPDATE products SET product_quantity = $1 WHERE product_id = $2",[stockQuantity, product_id]);
    
            return res.status(201).json({success:true, msg: 'transaction draft saved successfully'});
        }
        else {
            return res.status(403).json({success:false, msg: 'dont have enough quantity', stockQuantity})
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}







const addTransactions = async (req,res) => {
    try {
        const transactions = await pool.query("SELECT * FROM transactions_draft");
        
        transactions.rows.map( async (transaction) => {

            const {admin_id, customer_id, product_id, product_quantity, customer_price} = transaction;
            const insert = await pool.query("INSERT INTO transactions (admin_id, customer_id, product_id, product_quantity, customer_price) VALUES ($1, $2, $3, $4, $5)",[admin_id, customer_id, product_id, product_quantity, customer_price]);

            const clear = await pool.query("DELETE FROM transactions_draft");
        })

        return res.status(201).json({success:true, msg: 'transaction saved successfully'});
    
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}


module.exports = {
    getTransactions,
    addDraft,
    getTransactionsDraft,
    deleteTranscationDraft,
    editTranscationDraft,
    addTransactions
}