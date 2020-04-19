const bcrypt    = require('bcrypt');

const addUser = async (args) => {
    console.log(args.username)
    const hashedPassword = bcrypt.hashSync(args.hashedPassword, bcrypt.genSaltSync(12));
    console.log( hashedPassword )
    return 'add user'
}

module.exports = { addUser }

