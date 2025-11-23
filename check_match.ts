
import pool from './lib/mysql';

async function checkMatch() {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM matches WHERE id = 'bc471f1d-7f89-4a4e-9d57-d5f315349275'`
        );
        console.log(JSON.stringify(rows, null, 2));
    } catch (error) {
        console.error(error);
    }
}

checkMatch();
