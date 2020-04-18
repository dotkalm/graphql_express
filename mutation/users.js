const bcrypt    = require('bcrypt');

const addUser = async (args) => {
    const hashedPassword = bcrypt.hashSync('password', bcrypt.genSaltSync(10));
    console.log( hashedPassword )
    return 'add user'
}

module.exports = { addUser }

