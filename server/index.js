const express = require('express');
const app = express();

// routers
const authentication = require('./routes/authentication');
const customers = require('./routes/customers');
const products = require('./routes/products');
const transactions = require('./routes/transactions');
const search = require('./routes/search');
const filter = require('./routes/filter');

// Middleware
const authorize = require('./middleware/authorization');

const cors = require('cors');

app.use(express.json());
app.use(cors());

// ROUTES
app.use('/api/v1/auth', authentication);
app.use('/api/v1/customers', authorize, customers);
app.use('/api/v1/products', authorize, products);
app.use('/api/v1/transactions', authorize, transactions);
app.use('/api/v1/search', authorize, search);
app.use('/api/v1/filter', authorize, filter);

app.listen(5000, () => {
  console.log('server running on port 5000...');
});
