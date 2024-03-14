
const chart = (req, res) => {
    const chartData = [
        { label: "Apple", y: 10 },
        { label: "Orange", y: 15 },
        { label: "Banana", y: 25 },
        { label: "Mango", y: 30 },
        { label: "Grape", y: 20 },
    ];
    // console.log(chartData);
    res.json({ chartData }); 

}
const index= (req, res) => {
res.render('vender/index')
}


module.exports={chart,index}
