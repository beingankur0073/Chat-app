import React from 'react'
import {Line,Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS,
    Filler,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Legend,
    Tooltip,
    scales,
} from 'chart.js'


ChartJS.register(
    Filler,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Legend,
    Tooltip,
);


const lineChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },

    scales:{
        x:{
            grid:{
                display:false
            }
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false
            }
        }
    }
}

const LineChart = () => {
    const data={
        labels:["January","February","March","April","May","June","July"],
        datasets:[
        {
            data:[1,2,34,6],
            label:"Revenue",
            fill:false,
            backgroundColor:"rgba(75,192,192,0.2)",
            borderColor:"rgba(75,192,192,1)"
        },
        {
            data:[1,22,45,6],
            label:"Revenue 2",
            fill:true,
            backgroundColor:"rgba(75,12,192,0.3)",
            borderColor:"rgba(75,12,192,1)"
        },
    ],
    }
  return <Line data={data} options={lineChartOptions}/>
}

const DoughnutChart = () => {
    return (
      <div>Charts</div>
    )
  }

export {LineChart,DoughnutChart}