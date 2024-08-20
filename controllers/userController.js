const User = require('../models/User');

const users = []; // Dummy database for demonstration

// Controller functions
exports.createUser = (req, res) => {
    // Create a new user based on request body
    const { name, email } = req.body;
    const newUser = new User(users.name, email);
    users.push(newUser);
    res.redirect('/users');
};

exports.getUserList = (req, res) => {
    // Retrieve list of users from the database
    res.render('userList', { users });
};

// Other controller functions for updating, deleting, etc.
const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    port: '3310',
    user: 'root',
    password: 'root',
    database: 'nodedetail'
});

// Controller functions
exports.showCreateUserForm = (req, res) => {
    res.send(`
        <form action="/create-user" method="post">
            Name<input type="text"  name="name" placeholder="Name" required><br><br>
            Email<input type="email"  name="email" placeholder="Email" required><br><br>
            <button type="submit">Create User</button><br>
        </form>
    `);
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;
    // Insert user into the database
    pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error, results, fields) => {
        if (error) {
            console.error('Error creating user: ', error);
            res.status(500).send('Error creating user');
            return;
        }
        res.redirect('/users');
    });
};
exports.getUserList = (req, res) => {
    // Retrieve list of users from the database
    pool.query('SELECT * FROM users', (error, results, fields) => {
        if (error) {
            console.error('Error fetching users: ', error); // Log the actual error
            return res.status(500).send('Error fetching users: ' + error.message); // Send detailed error message
        }
        res.render('userList', { users: results });
    });
};


// Other controller functions for updating, deleting, etc.
