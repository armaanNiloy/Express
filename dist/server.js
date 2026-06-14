import express, { response } from "express";
import { Pool } from "pg";
import config from "./config";
const app = express();
const port = 5000;
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
const pool = new Pool({
    connectionString: config.connection_string
});
const initDB = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      age INT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
        console.log("Database Connected Successfully");
    }
    catch (error) {
        console.log(error);
    }
};
initDB();
app.get('/', (req, res) => {
    // res.send('Express Serversss')
    res.status(200).json({
        "message": "Express Server",
        "author": "next level"
    });
});
app.post('/api/users', async (req, res) => {
    // console.log(req.body);
    try {
        const { name, email, password, age } = req.body;
        const result = await pool.query(`
    INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
    RETURNING *
    `, [name, email, password, age]);
        // console.log(result);
        res.status(201).json({
            message: "User Created Successfully!!!",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
});
app.get('/api/users', async (req, res) => {
    try {
        const result = pool.query(`
      SELECT * FROM users
      `);
        res.status(200).json({
            success: true,
            message: "Users retrive successfully",
            data: (await result).rows
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    try {
        const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found",
                data: {}
            });
        }
        res.status(200).json({
            success: true,
            message: "User Retrive successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, is_active } = req.body;
    try {
        const result = await pool.query(`
      UPDATE users
      SET name = COALESCE($1, name), 
      email = COALESCE($2, email), 
      password = COALESCE($3, password), 
      is_active = COALESCE($4, is_active)

      WHERE id = $5 RETURNING *
      `, [name, email, password, is_active, id]);
        console.log(result.rows.length);
        if (result.rows.length === 0) {
            res.status(500).json({
                success: false,
                message: "User Not Updated",
                data: {}
            });
        }
        res.status(200).json({
            success: true,
            message: "User Updated successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const result = await pool.query(`
    DELETE FROM users
    WHERE id=$1
    `, [id]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found",
                data: {}
            });
        }
        res.status(200).json({
            success: true,
            message: "User Deleted successfully",
            data: {}
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map