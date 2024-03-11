// const CanvasJS = require("@canvasjs/charts")
// Function to calculate or fetch chart data
// Backend route to provide chart data


const chart =(req, res) => {
    try {
        // Mock chart data for demonstration
        const chartData = [
            { label: "Apple", y: 10 },
            { label: "Orange", y: 15 },
            { label: "Banana", y: 25 },
            { label: "Mango", y: 30 },
            { label: "Grape", y: 28 },
        ];
        res.render('admin/index', { chartData }); 
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports={chart}
