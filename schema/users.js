const bcrypt = require('bcrypt');
const Pool = require('pg-pool')
const { Client } = require('pg');
require('dotenv').config()

const checkAuth = async (args, context) => {
    let ssl = false
    if(process.env.ON_HEROKU === 1){
        ssl = true
    }
    const { username, password, uid } = args
    console.log(username, password, uid)
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl
    });
    client.connect()

    try{
        const result = await client.query(`
            SELECT * FROM users
            WHERE username = '${username}';`)
        const userObj = result.rows[0]
        console.log(userObj)
        if(userObj === undefined){
            throw new Error("cannot find user") 
        }else{
            console.log(userObj)

            const passwordsMatch = bcrypt.compareSync(password, userObj.password)
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
        client.end()
    }
}

module.exports = { checkAuth }
