// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");

// const app = express();
// dotenv.config();
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const port = 5600;
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: process.env.MYSQLPASSWORD,
//   database: "userinfo",
// });

// // Connect to MySQL database
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL database:", err);
//     process.exit(1);
//   }
//   console.log("Connected to MySQL database");
// });

// // Middleware to verify token
// const authenticateToken = (req, res, next) => {
//   const token =
//     req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
//   if (token == null) {
//     return res.status(401).json({ error: "Token is required" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("Error verifying token:", err);
//       return res.status(403).json({ error: "Invalid token" });
//     }
//     req.user = user;
//     next();
//   });
// };
// // Route to handle user signup
// // Route to handle user signup
// app.post("/signup", (req, res) => {
//   const { name, age } = req.body;
//   const checkQuery = "SELECT * FROM Users WHERE name = ?";
//   db.query(checkQuery, [name], (checkError, checkResult) => {
//     if (checkError) {
//       console.error("Error checking existing user:", checkError);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while checking existing user." });
//     }

//     if (checkResult.length > 0) {
//       // If user already exists, update their age instead of creating a new user
//       const updateQuery = "UPDATE Users SET age = ? WHERE name = ?";
//       db.query(updateQuery, [age, name], (updateError) => {
//         if (updateError) {
//           console.error("Error updating user:", updateError);
//           return res
//             .status(500)
//             .json({ error: "An error occurred while updating user." });
//         }
//         res.status(200).json({ message: "User updated successfully" });
//       });
//     } else {
//       // If user does not exist, create a new user
//       const postQuery = "INSERT INTO Users (name, age) VALUES (?, ?)";
//       db.query(postQuery, [name, age], (insertError, result) => {
//         if (insertError) {
//           console.error("Error inserting data:", insertError);
//           return res
//             .status(500)
//             .json({ error: "An error occurred while inserting data." });
//         }
//         const userId = result.insertId;
//         const token = jwt.sign({ id: userId, name }, process.env.JWT_SECRET, {
//           expiresIn: "1h",
//         });
//         res.status(200).json({ message: "Signup successful", token });
//       });
//     }
//   });
// });

// // Route to handle user signin
// app.post("/signin", (req, res) => {
//   const { name } = req.body;

//   const checkQuery = "SELECT * FROM Users WHERE name = ?";
//   db.query(checkQuery, [name], (checkError, checkResult) => {
//     if (checkError) {
//       console.error("Error checking user:", checkError);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while checking user credentials." });
//     }

//     if (checkResult.length === 0) {
//       return res.status(401).json({ error: "Invalid credentials." });
//     }

//     const user = checkResult[0];
//     const token = jwt.sign(
//       { id: user.id, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ message: "Signin successful", token });
//   });
// });

// // Route to handle user signout
// app.post("/signout", authenticateToken, (req, res) => {
//   // Since JWT is stateless, there's no real signout on the server side.
//   // You just remove the token from the client side.
//   res.status(200).json({ message: "Signout successful" });
// });

// // Route to get the Users Data
// app.get("/UsersData", (req, res) => {
//   const query = `
//       SELECT 
//         U.name,
//         U.age,
//         (
//           SELECT SUM(SD.steps) 
//           FROM StepsData SD 
//           WHERE SD.user_id = U.id AND DATE(SD.date) = CURDATE()
//         ) AS daily_steps,
//         (
//           SELECT SUM(SD.steps) 
//           FROM StepsData SD 
//           WHERE SD.user_id = U.id AND YEARWEEK(SD.date) = YEARWEEK(CURDATE())
//         ) AS weekly_steps,
//         (
//           SELECT SUM(SD.steps) 
//           FROM StepsData SD 
//           WHERE SD.user_id = U.id AND MONTH(SD.date) = MONTH(CURDATE())
//         ) AS monthly_steps,
//         (
//           SELECT SUM(SD.steps) 
//           FROM StepsData SD 
//           WHERE SD.user_id = U.id
//         ) AS total_steps
//       FROM Users U
//     `;

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching data:", error);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while fetching data." });
//     }
//     res.json(results);
//   });
// });

// // Route to handle user data submission
// app.post("/getuserdata", (req, res) => {
//   const { name, age } = req.body;

//   const checkQuery = "SELECT * FROM Signin WHERE name = ?";
//   db.query(checkQuery, [name], (checkError, checkResult) => {
//     if (checkError) {
//       console.error("Error checking existing user:", checkError);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while checking existing user." });
//     }

//     if (checkResult.length > 0) {
//       return res
//         .status(409)
//         .json({ error: "User with the same name already exists." });
//     }

//     const token = jwt.sign({ name, age }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     const postQuery = "INSERT INTO Signin (name, age, token) VALUES (?, ?, ?)";
//     db.query(postQuery, [name, age, token], (insertError) => {
//       if (insertError) {
//         console.error("Error inserting data:", insertError);
//         return res
//           .status(500)
//           .json({ error: "An error occurred while inserting data." });
//       }
//       res.status(200).json({ message: "Data inserted successfully", token });
//     });
//   });
// });

// // Route to update user data
// app.put("/UsersData/:id", (req, res) => {
//   const { id } = req.params;
//   const { name, age } = req.body;

//   const token = jwt.sign({ name, age }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   const updateQuery =
//     "UPDATE Signin SET name = ?, age = ?, token = ? WHERE id = ?";
//   db.query(updateQuery, [name, age, token, id], (error, result) => {
//     if (error) {
//       console.error("Error updating data:", error);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while updating data." });
//     }
//     if (result.affectedRows > 0) {
//       res.status(200).json({ message: "Data updated successfully", token });
//     } else {
//       res.status(404).json({ error: "No user found with the given ID." });
//     }
//   });
// });

// // DELETE route to delete a user by ID
// app.delete("/UsersData/:id", (req, res) => {
//   const { id } = req.params;
//   const deleteQuery = "DELETE FROM Signin WHERE id = ?";

//   db.query(deleteQuery, [id], (error, result) => {
//     if (error) {
//       console.error("Error deleting data:", error);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while deleting data." });
//     }
//     if (result.affectedRows > 0) {
//       res.json({ message: "User deleted successfully" });
//     } else {
//       res.status(404).json({ error: "No user found with the given ID." });
//     }
//   });
// });

// // Middleware to verify token and extract user information
// app.use("/api/steps", authenticateToken);

// // Route to fetch steps data for a specific user
// // app.get('/api/steps/:userId', (req, res) => {
// //     const userId = req.params.userId;

// //     db.query('SELECT date, steps FROM StepsData WHERE user_id = ?', [userId], (err, results) => {
// //         if (err) return res.status(500).send(err);
// //         res.json(results);
// //     });
// // });

// // Route to fetch steps data for all users
// app.get("/api/steps", (req, res) => {
//     const query = `
//     SELECT 
//       U.name,
//       U.age,
//       (
//         SELECT SUM(SD.steps) 
//         FROM StepsData SD 
//         WHERE SD.user_id = U.id AND DATE(SD.date) = CURDATE()
//       ) AS daily_steps,
//       (
//         SELECT SUM(SD.steps) 
//         FROM StepsData SD 
//         WHERE SD.user_id = U.id AND YEARWEEK(SD.date) = YEARWEEK(CURDATE())
//       ) AS weekly_steps,
//       (
//         SELECT SUM(SD.steps) 
//         FROM StepsData SD 
//         WHERE SD.user_id = U.id AND MONTH(SD.date) = MONTH(CURDATE())
//       ) AS monthly_steps,
//       (
//         SELECT SUM(SD.steps) 
//         FROM StepsData SD 
//         WHERE SD.user_id = U.id
//       ) AS total_steps
//     FROM Users U
//   `;
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// });


// app.post('/api/steps', (req, res) => {
//     const { name, age, stepsData } = req.body;

//     db.beginTransaction(err => {
//         if (err) {
//             console.error('Transaction error:', err);
//             return res.status(500).json({ error: 'Server error occurred while starting the transaction.' });
//         }

//         const userQuery = 'INSERT INTO Users (name, age,total_steps) VALUES (?, ?,?) ON DUPLICATE KEY UPDATE age = VALUES(age)';
//         db.query(userQuery, [name, age], (err, result) => {
//             if (err) {
//                 console.error('User query error:', err);
//                 return db.rollback(() => res.status(500).json({ error: 'Error inserting or updating user data.' }));
//             }

//             const userId = result.insertId || result.insertId;

//             // Validate and format steps data
//             const formattedStepsData = stepsData.map(data => {
//                 const [day, month, year] = data.date.split('-');
//                 // Ensure the date is in YYYY-MM-DD format
//                 const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//                 return [userId, formattedDate, data.steps];
//             });

//             const stepsQuery = 'INSERT INTO StepsData (user_id, date, steps) VALUES ?';

//             db.query(stepsQuery, [formattedStepsData], (err) => {
//                 if (err) {
//                     console.error('Steps data insertion error:', err);
//                     return db.rollback(() => res.status(500).json({ error: 'Error inserting steps data.' }));
//                 }

//                 db.commit(err => {
//                     if (err) {
//                         console.error('Transaction commit error:', err);
//                         return db.rollback(() => res.status(500).json({ error: 'Transaction commit error.' }));
//                     }

//                     res.status(200).json({ message: 'Data inserted successfully' });
//                 });
//             });
//         });
//     });
// });
  

// // Route to get leaderboard
// // Route to get leaderboard
// app.get("/leaderboard", (req, res) => {
//   console.log("Leaderboard route hit");
//   const query = `
//      SELECT Users.name, SUM(StepsData.steps) AS total_steps
//         FROM Users
//         LEFT JOIN StepsData ON Users.id = StepsData.user_id
//         GROUP BY Users.id
//         ORDER BY total_steps DESC
//     `;

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching leaderboard:", error);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while fetching leaderboard data." });
//     }

//     // Add rank to each result
//     results.forEach((result, index) => {
//       result.rank = index + 1;
//     });

//     console.log("Leaderboard data:", results);
//     res.json(results);
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

const app = express();
const port = 5600;

app.use(cors());
app.use(bodyParser.json());

dotenv.config();

// MySQL database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQLPASSWORD,
  database: 'stepcounter',
};

const pool = mysql.createPool(dbConfig);

// Register endpoint
app.post('/signup', async (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: 'Please provide name and age.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'INSERT INTO users (name, age) VALUES (?, ?)';
      const [results] = await connection.execute(query, [name, age]);

      const token = jwt.sign({ id: results.insertId, name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


//get all data 
// 
app.get('/users/data', async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM step_data'; // Corrected table name
      const [rows] = await connection.execute(query);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
      connection.release();
    }
  });
  
// Login endpoint
app.post('/signin', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please provide name.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM users WHERE name = ?';
      const [rows] = await connection.execute(query, [name]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const user = rows[0];
      const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
