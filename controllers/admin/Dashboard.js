// const CanvasJS = require("@canvasjs/charts")
// Function to calculate or fetch chart data
// Backend route to provide chart data


const chart = (req, res) => {
    const chartData = [
        { label: "Apple", y: 10 },
        { label: "Orange", y: 15 },
        { label: "Banana", y: 25 },
        { label: "Mango", y: 30 },
        { label: "Grape", y: 28 },
    ];
    res.json({ chartData }); 
}
const index= (req, res) => {
res.render('admin/index')
}


module.exports={chart,index}
