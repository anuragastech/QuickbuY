const personal=require('../../models/user/mongodb')
let Address = async (req, res) => {
    try {
        const { address, phone, country, city, state, pin } = req.body;
        const userId = req.user.id; // Assuming you have authenticated the user and their ID is available in req.user
        const currentUser = await personal.findById(userId);

        // Push the new address information into the currentUser's personalInfo array
        currentUser.personalInfo.push({ address, number: phone, country, state, city, pincode: pin });

        // Save the updated user document
        await currentUser.save();

        res.redirect('/user/check-out');
        } catch (error) {
        console.error('Error saving address:', error);
        res.status(500).json({ message: 'Failed to save address' });
    }
}






module.exports={Address};
