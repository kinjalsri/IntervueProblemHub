const pool = require('../Config/db');

const getTags = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM tags
             ORDER BY name`
        );

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    getTags
};