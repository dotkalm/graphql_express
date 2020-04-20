const bcrypt    = require('bcrypt');
const Pool = require('pg-pool')

const addUser = async (args, dbConfig) => {
    const pool = new Pool(dbConfig)
    const hashedPassword = bcrypt.hashSync(args.hashedPassword, bcrypt.genSaltSync(12));
    const client = await pool.connect()
    try{
        return client.query(`
            INSERT INTO users (username, hashedPassword) 
            VALUES (
                '${args.username}', 
                '${hashedPassword}');
            `)
    } finally{
        client.release()
    }

}


module.exports = { addUser }

