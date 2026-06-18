const bcrypt  = require ('bcrypt');
const jwt = require('jsonwebtoken'); 
const pool = require('../Config/db');


const signup = async(req, res)=> {
    try{

        const{name, email, password, role} = req.body;

        const userExists = await pool.query(
            'SELECT * FROM users WHERE email=$1'
        ,[email]
        );

        if (userExists.rows.length > 0) {
            return res.status(409).json({
                message: 'User already exists',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //insert user 
        const result = await pool.query(
            `INSERT INTO users (name,email, password_hash, role)
            VALUES($1,$2,$3,$4)
            RETURNING id, name, email, role`
            , [name, email, hashedPassword, role]
        );

        res.status(201).json({
            message: 'User created succesfully',
            user: result.rows[0],
            success: true
        });


    }

    catch(err){

        console.error(err);

        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }

};

const login = async(req, res) => {
    try{
        const {email, password} = req.body;

        // check user exists
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found',
                success: false

            });
        }

        const user = result.rows[0];

        // compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );
         if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }

        // generate jwt token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            success: true,
            token,
            email,
            name: user.name
        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });

    }
};

module.exports = {
    signup,
    login
};