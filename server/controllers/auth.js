const pool = require('../db/connect');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');

const register = async (req, res) => {
    try {
        // 1. destructure the req.body (name, email, password)
        const { admin_name, admin_email, admin_password } = req.body;

        // 2. check if user exist
        const admin = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [admin_email]);

        if(admin.rows.length !== 0) {
            return res.status(401).json({success: false, msg: 'admin already exists'});
        }

        // 3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(admin_password, salt);

        // 4. enter the new user inside our database

        const newAdmin = await pool.query('INSERT INTO admin(admin_name,admin_email,admin_password) VALUES($1,$2,$3) RETURNING *',[admin_name,admin_email,bcryptPassword]);

        // 5. generting jwt token
        const token = jwtGenerator(newAdmin.rows[0].admin_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
};

const login = async (req, res) => {
    
    // 1. destructure req.body
    const { admin_email, admin_password } = req.body;

    // 2. check if user exists
    const admin = await pool.query('SELECT * FROM admin WHERE admin_email = $1',[admin_email]);

    if(admin.rows.length === 0) {
        return res.status(401).json({success: false, msg: 'password or email is incorrect'});
    }

    // 3. check if incoming password is the same as the database password
    const validPassword = await bcrypt.compare(admin_password, admin.rows[0].admin_password);

    if (!validPassword) {
        return res.status(401).json({success: false, msg: 'password or email is incorrect'});
    }

    // 4. asign a jwt token
    const token = jwtGenerator(admin.rows[0].admin_id);
    let admin_id = await pool.query('SELECT admin_id FROM admin WHERE admin_email = $1',[admin_email]);
    admin_id = admin_id.rows[0].admin_id;
    res.json({ token, admin_id });
};

module.exports = {
    register,
    login
}