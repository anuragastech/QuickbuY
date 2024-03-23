

const register=require('../../models/vender/mongodb')

const blockVender = async (req, res) => {
    try {
        const userId = req.params.userId;
        await register.findByIdAndUpdate(userId, { blocked: true });
        res.status(200).json({ message: 'Vender blocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const unblockVender = async (req, res) => {
    try {
        const userId = req.params.userId;
        await register.findByIdAndUpdate(userId, { blocked: false });
        res.status(200).json({ message: 'Vender unblocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports={blockVender,unblockVender} ;
