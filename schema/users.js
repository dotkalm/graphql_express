const bcrypt = require('bcrypt');
const Pool = require('pg-pool')

const checkAuth = async (dbConfig, username, password, context) => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        const result = await client.query(`
            SELECT * FROM users
            WHERE username = '${username}';`)
        const userObj = result.rows[0]
        if(userObj === undefined){
            throw new Error("cannot find user") 
        }else{
            const passwordsMatch = bcrypt.compareSync(password, userObj.hashedpassword)
            if(passwordsMatch){
                context.req.session.logged = true
                console.log(context.req.session)

                return result.rows
            }else{
                throw new Error("wrong password") 
            }
        }
    } catch(error){
        console.log(error.message)
    }finally{
        client.release()
    }
}

module.exports = { checkAuth }
