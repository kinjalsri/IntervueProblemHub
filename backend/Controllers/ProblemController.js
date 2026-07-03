const pool = require('../Config/db');

const addProblem = async (req, res) => {

    try {

        const {
            title,
            description,
            company_name,
            is_anonymous,
            tag_ids
        } = req.body;

        const created_by = req.user.id;

        // Insert problem
        const result = await pool.query(
            `
            INSERT INTO problems
            (
                title,
                description,
                created_by,
                company_name,
                is_anonymous
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING id
            `,
            [
                title,
                description,
                created_by,
                company_name,
                is_anonymous
            ]
        );

        const problemId = result.rows[0].id;

        // Insert tags into problem_tags table
        if (tag_ids && tag_ids.length > 0) {

            for (const tagId of tag_ids) {

                await pool.query(
                    `
                    INSERT INTO problem_tags
                    (
                        problem_id,
                        tag_id
                    )
                    VALUES
                    (
                        $1,
                        $2
                    )
                    `,
                    [problemId, tagId]
                );
            }
        }

        res.status(201).json({
            message: 'Problem created successfully',
            problemId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const fetchProblems = async(req, res) => {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM problems
            ORDER BY created_at DESC`
        );


        res.status(200).json(result.rows);
    }

    catch(err){
         console.error(err);

        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getAdminProblems = async (req, res) => {
    try{
        
         const userId = req.user.id;
         
         const result = await pool.query(
            `SELECT * 
            FROM problems
            WHERE created_by= $1
            ORDER BY created_at DESC`, [userId]
         );

         

         res.status(200).json(result.rows);

    }

    catch(err){
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

//getting particular problems detail
const problemDetail = async(req, res) =>{
    
    try{
        const problemId = req.params.id;

        const result = await pool.query(
            `SELECT *
            FROM problems
            WHERE id = $1`, [problemId]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
            message: "Problem not found"
         });
        }

        else res.status(200).json(result.rows[0]);
    }

    catch(err){
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

};

const updateProblemStatus = async (req, res) => {
    try {

        const problemId = req.params.id;
        const userId = req.user.id;
        const {status} = req.body;

        const existingStatus = await pool.query(
            `SELECT *
             FROM user_problems
             WHERE user_id = $1
             AND problem_id = $2`,
            [userId, problemId]
        );

         // update existing status
        if (existingStatus.rows.length > 0) {

            await pool.query(
                `UPDATE user_problems
                 SET status = $1
                 WHERE user_id = $2
                 AND problem_id = $3`,
                [status, userId, problemId]
            );

            return res.status(200).json({
                message: "Status updated successfully"
            });
        }

        // create new status entry
        await pool.query(
            `INSERT INTO user_problems
             (user_id, problem_id, status)
             VALUES
             ($1, $2, $3)`,
            [userId, problemId, status]
        );

        res.status(201).json({
            message: "Status added successfully"
        });

        
    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
}

const updateProblem = async(req, res) => {
    
    try {
        const problemId = req.params.id;
         const {
            title,
            description,
            company_name,
            is_anonymous
        } = req.body;

        const problem = await pool.query(
            `SELECT * FROM problems WHERE id = $1`
            , [problemId]
        );

        if(problem.rows.length === 0){
            return res.status(404).json({
                message : "Problem not found"
            });
        }

        if(problem.rows[0].created_by !==req.user.id){
            return res.status(403).json({
                message : "Unautherised"
            });
        }

        const result = await pool.query(
            `UPDATE problems
            SET 
            title = $1,
            description = $2,
                company_name = $3,
                is_anonymous = $4
             WHERE id = $5
             RETURNING *`
            [
                title,
                description,
                company_name,
                is_anonymous,
                problemId
            ]
        );

        res.status(200).json({
            message: "Problem updated successfully",
            problem: result.rows[0]
        });

    } 
    catch (err) {

         console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
    
}

const deleteProblem = async (req, res) => {

    try {

        const problemId = req.params.id;

        const problem = await pool.query(
            `SELECT *
             FROM problems
             WHERE id = $1`,
            [problemId]
        );

        if (problem.rows.length === 0) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        if (problem.rows[0].created_by !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        await pool.query(
            `DELETE FROM problems
             WHERE id = $1`,
            [problemId]
        );

        res.status(200).json({
            message: "Problem deleted successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    addProblem, fetchProblems, getAdminProblems, problemDetail, updateProblemStatus, updateProblem, deleteProblem
};