import './chart.css';
import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({tutor, user}) => {

  return (
    <div className='chart'>
      <div className="chartTop">
        <div className="chartTitle">Phân bố người dùng</div>
      </div>

      <div className="chartBottom">
        <div className="pieChart">
          <Pie 
          width={200} 
          height={200}
          data={{
            labels: ['Gia sư', 'Phụ huynh học sinh'],
            datasets: [{
              label: 'Số lượng tài khoản',
              data: [tutor, user],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1,
            }]
          }}

          options={{
            responsive: true
          }}
          />
        </div>
      </div>
    </div>
  )
}

export default Chart