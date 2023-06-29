const pool = require('../db/connect');

const getProducts = async (req, res) => {
    try {
        const products = await pool.query("SELECT * FROM products ORDER BY product_name,product_quantity");
        res.status(200).json(products.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const addProduct = async (req, res) => {
    try {
        const {product_name, product_price, product_quantity} = req.body;
        const add = await pool.query("INSERT INTO products (product_name, product_price, product_quantity) VALUES ($1, $2, $3)", [product_name, product_price, product_quantity]);

        res.status(201).json({success:true, msg: 'product added successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const updateProduct = async (req, res) => {
    try {
        const {id: product_id} = req.params;
        const {product_name, product_price, product_quantity} = req.body;

        if (product_id) {
            const edit = await pool.query("UPDATE products SET product_name = $1, product_price = $2, product_quantity = $3 WHERE product_id = $4",[product_name,product_price,product_quantity, product_id]);

            res.status(200).json({success: true, msg: 'product updated successfully'});
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const deleteProducts = async (req, res) => {
    try {
        const { productsId } = req.body;
        productsId.map( async (product_id) => {
            const erase = await pool.query("DELETE FROM products WHERE product_id = $1", [product_id]);
        });
        return res.status(200).json({success: true});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}
const deleteById = async (req, res) => {
    try {
        const { id: product_id } = req.params;
        const erase = await pool.query("DELETE FROM products WHERE product_id = $1", [product_id]);
        return res.status(200).json({success: true});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}


module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProducts,
    deleteById
}