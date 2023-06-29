CREATE TABLE admin(
    admin_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    admin_password VARCHAR(255) NOT NULL
);

CREATE TABLE customers(
    customer_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_address VARCHAR(255) NOT NULL,
    customer_number VARCHAR(255) NOT NULL,
    customer_balance DECIMAL DEFAULT 0
);

CREATE TABLE products(
    product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL NOT NULL,
    product_quantity INT
);

CREATE TABLE transactions(
    transaction_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(2),
    admin_id uuid REFERENCES admin(admin_id),
    customer_id uuid REFERENCES customers(customer_id),
    product_id uuid REFERENCES products(product_id),
    product_quantity INT,
    customer_price DECIMAL
);

CREATE TABLE transactions_draft(
    transaction_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    admin_id uuid REFERENCES admin(admin_id),
    customer_id uuid REFERENCES customers(customer_id),
    product_id uuid REFERENCES products(product_id),
    product_quantity INT,
    customer_price DECIMAL
);