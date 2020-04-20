const bcrypt = require('bcrypt');
const Pool = require('pg-pool')

const checkAuth = async (dbConfig, username, password) => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    console.log(username, password)
    try{
        const result = await client.query(`
            SELECT * FROM users
            WHERE username = '${username}';`)
        const userObj = result.rows[0]
        if(userObj === undefined){
            console.log("cannot find user")
        }else{
            console.log(userObj, password)
            const result = bcrypt.compareSync(password, userObj.hashedpassword)
            console.log(result)
        }
        return result.rows
    } finally{
        client.release()
    }
}

module.exports = { checkAuth }
