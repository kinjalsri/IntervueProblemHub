const pool = require('../Config/db');

const getMe = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const getWorkingProblems = async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT p.*
             FROM user_problems up
             JOIN problems p
             ON up.problem_id = p.id
             WHERE up.user_id = $1
             AND up.status = 'working'`,
            [userId]
        );

        res.status(200).json(result.rows);
        
    } catch (error) {


        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
}

const getLikedProblems =  async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT p.*
             FROM user_problems up
             JOIN problems p
             ON up.problem_id = p.id
             WHERE up.user_id = $1
             AND up.status = 'liked'`,
            [userId]
        );

        res.status(200).json(result.rows);
        
    } catch (error) {


        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
};

const getSolvedProblems =  async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT p.*
             FROM user_problems up
             JOIN problems p
             ON up.problem_id = p.id
             WHERE up.user_id = $1
             AND up.status = 'solved'`,
            [userId]
        );

        res.status(200).json(result.rows);
        
    } catch (error) {


        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
}

const updateInterests = async (req, res) => {

    try {

        const userId = req.user.id;
        const { tag_ids } = req.body;

        // Remove old interests
        await pool.query(
            `DELETE FROM user_tags
             WHERE user_id = $1`,
            [userId]
        );

        // Insert new interests
        for (const tagId of tag_ids) {

            await pool.query(
                `INSERT INTO user_tags
                 (user_id, tag_id)
                 VALUES
                 ($1, $2)`,
                [userId, tagId]
            );
        }

        res.status(200).json({
            message: 'Interests updated successfully'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const getUserInterests = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT t.*
             FROM user_tags ut
             JOIN tags t
             ON ut.tag_id = t.id
             WHERE ut.user_id = $1
             ORDER BY t.name`,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getRecommendations = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT DISTINCT p.*
             FROM problems p
             JOIN problem_tags pt
             ON p.id = pt.problem_id
             JOIN user_tags ut
             ON pt.tag_id = ut.tag_id
             WHERE ut.user_id = $1`,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



module.exports = {
    getMe, 
    getWorkingProblems,
    getLikedProblems,
    getSolvedProblems,
    updateInterests,
    getUserInterests,
    getRecommendations
    
};