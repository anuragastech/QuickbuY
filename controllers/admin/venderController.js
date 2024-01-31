

const register=require('../../models/vender/mongodb')

// Controller logic for blocking a user
const blockVender = async (req, res) => {
    try {
        const venderId = req.params.userId;
        await register.findByIdAndUpdate(venderId, { blocked: true });
        res.status(200).json({ message: 'Vender blocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller logic for unblocking a user
const unblockVender = async (req, res) => {
    try {
        const venderId = req.params.venderId;
        await register.findByIdAndUpdate(venderId, { blocked: false });
        res.status(200).json({ message: 'Vender unblocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports={blockVender,unblockVender} ;
