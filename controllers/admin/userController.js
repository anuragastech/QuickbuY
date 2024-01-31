

const create=require('../../models/user/mongodb')

// Controller logic for blocking a user
const blockUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await create.findByIdAndUpdate(userId, { blocked: true });
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller logic for unblocking a user
const unblockUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await create.findByIdAndUpdate(userId, { blocked: false });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports={blockUser,unblockUser} ;
