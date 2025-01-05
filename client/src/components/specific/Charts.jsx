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
    plugins,
} from 'chart.js'
import { orange, orangeLight, purple, purpleLight } from '../../constants/color.js';
import { getLast7Days } from '../../lib/features.js';



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


const labels=getLast7Days();

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

const LineChart = ({value=[]}) => {
    const data={
        labels,
        datasets:[
        {
            data:value,
            label:"Revenue",
            fill:true,
            backgroundColor:purpleLight,
            borderColor:purple
        },
       
    ],
    }
  return <Line data={data} options={lineChartOptions}/>
}



const doughnutChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
    },
    cutout:120,
}

const DoughnutChart = ({value=[],labels=[]}) => {
    const data={
        labels,
        datasets:[
        {
            data:value,
            backgroundColor:[purpleLight,orangeLight],
            hoverBackgroundColor:[purple,orange],
            borderColor:[purple,orange],
            offset:40,
        },
       
    ],
    }
    return <Doughnut 
    style={{zIndex:10}}
    data={data} 
    options={doughnutChartOptions}/>
  }

export {LineChart,DoughnutChart}