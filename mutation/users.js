const bcrypt    = require('bcrypt');
const { Client } = require('pg');

const addUser = async (args) => {
    const hashedPassword = bcrypt.hashSync(args.hashedPassword, bcrypt.genSaltSync(12));
    console.log(hashedPassword)
    let ssl = false
    if(process.env.ON_HEROKU === 1){
        ssl = true
    }
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl
    });
    client.connect()
    try{
        const prepareAndInsert = await client.query(`
            PREPARE user_insert (TEXT, TEXT) AS INSERT INTO users VALUES ($1, $2);
            EXECUTE user_insert('${args.username}','${hashedPassword}');
        `)
        return prepareAndInsert
    } catch(error){
        console.log(error.message)
    }finally{
        client.end()
    }
}


module.exports = { addUser }

