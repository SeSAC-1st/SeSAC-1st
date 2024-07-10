const { User } = require('../../models/user/User');

exports.userRegister = async (req, res) => {
    try {
        console.log(req.body)
        const {
            userId, userName, loginId, userPw, email, address, profileImg, userNick, birthday
        } = req.body;
        const newUser = await User.create({
            userId, userName, loginId, userPw, email, address, profileImg, userNick, birthday
        });

        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}