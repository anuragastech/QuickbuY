const Order=require("../../models/user/order")
const chart = async (req, res) => {


    try {
      // const userId = req.vender.id
      //  console.log(userId);
  
      const chartData = await Order.aggregate([
        {
          $match: {
            // venderId: userId
                    }
        },
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
  
const index= async (req, res) => {
    try {
        const userId = req.vender.id
        // console.log(userId);

const chartData = await Order.aggregate([
    {
      $match: {
        venderId: userId 
      }
    },
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
  
  // Aggregate total sales for the user
  const totalPriceResult = await Order.aggregate([
    {
      $match: {
        venderId: userId // Filter orders by userid
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$price" },
      },
    },
  ]);
  
  // Aggregate total canceled orders for the user
  const canceledOrdersResult = await Order.aggregate([
    {
      $match: {
        venderId: userId, 
        status: "canceled" 
      }
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
  
        const totalProfit = totalSales - totalCost;
      //   console.log(totalCanceledOrders);
    
        res.render("vender/index", { chartData, totalSales ,totalProfit ,totalCanceledOrders});
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching data');
      }
    };  
    

module.exports={chart,index}
