// const CanvasJS = require("@canvasjs/charts")
// Function to calculate or fetch chart data
// Backend route to provide chart data

const Order = require("../../models/user/order");

const chart = async (req, res) => {
  try {
    const chartData = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$orderDate" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalOrders: 1,
        },
      },
    ]);
    // const totalorders =chart
    // Convert data to the format expected by the charting library
    const formattedChartData = chartData.map((data) => ({
      label: getMonthName(data.month), // Function to get month name
      y: data.totalOrders,
    }));

    res.json({ chartData: formattedChartData });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).send("Error fetching chart data");
  }
};

// Function to get the name of the month from its number
function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1];
}

const index = async (req, res) => {
    try {
      const chartData = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$orderDate" },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalOrders: 1,
          },
        },
      ]);
  
      const totalPriceResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$price" },
          },
        },
      ]);
      const canceledOrdersResult = await Order.aggregate([
        {
          $match: { status: "canceled" } // Assuming "canceled" is the status for canceled orders
        },
        {
          $group: {
            _id: null,
            totalCanceledOrders: { $sum: 1 },
          },
        },
      ]);
      const totalCanceledOrders = canceledOrdersResult.length > 0 ? canceledOrdersResult[0].totalCanceledOrders : 0;

      const totalSales = totalPriceResult.map(x => x.totalSales);
      const totalCost =  Math.round(0.8 * totalSales);

      // Calculate total profit
      const totalProfit = totalSales - totalCost;
      console.log(totalCanceledOrders);
  
      res.render("admin/index", { chartData, totalSales ,totalProfit ,totalCanceledOrders});
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error fetching data');
    }
  };  
  
module.exports = { chart, index };
