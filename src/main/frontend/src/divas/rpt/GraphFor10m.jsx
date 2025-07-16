import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as CommmonChart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Spin } from 'antd';

CommmonChart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graph = (props) => {
  console.log("[Start] Graph ------------------------------");
  console.log(props);

  const [isChartReady, setIsChartReady] = useState(false);
  const [windImages, setWindImages] = useState({});
  const chartRef = useRef(null);

  const isLineChart = props.type !== "0" && props.type !== "2" ? true : false;
  const isWindData = props.type === "4"; // 풍향/풍속 데이터인지 확인

  // 로딩 상태 확인
  const isLoading = props.loading || !props.data || props.data.length === 0 || !isChartReady;

  // 풍향 이미지 미리 로드
  useEffect(() => {
    if (isWindData && props.data && props.data.length > 0) {
      const imagePromises = [];
      const imageMap = {};
      
      // 유니크한 풍향 이미지 파일명들을 수집
      const uniqueImages = [...new Set(props.data.map(item => item.DATA2).filter(img => img && img !== "-"))];
      
      uniqueImages.forEach(imageName => {
        const img = new Image();
        const promise = new Promise((resolve) => {
          img.onload = () => {
            imageMap[imageName] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load wind image: ${imageName}`);
            resolve();
          };
        });
        img.src = `../images/wind/${imageName}`;
        imagePromises.push(promise);
      });
      
      Promise.all(imagePromises).then(() => {
        setWindImages(imageMap);
      });
    }
  }, [isWindData, props.data]);

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      const timer = setTimeout(() => {
        setIsChartReady(true);
        if (props.onRenderComplete) {
          props.onRenderComplete();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [props.data, props.onRenderComplete]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        flexDirection: 'column'
      }}>
        <Spin />
      </div>
    );
  }

  // Y축 범위 계산
  const calculateYAxisRange = () => {
    if (!props.data || props.data.length === 0) {
      return { min: 0, max: 1 };
    }

    let numericData = [];
    
    if (isWindData) {
      // 풍속 데이터만 사용하여 Y축 범위 계산
      numericData = props.data
        .map(item => parseFloat(item.DATA))
        .filter(value => !isNaN(value) && value !== null);
    } else {
      numericData = props.data
        .map(item => parseFloat(item.DATA))
        .filter(value => !isNaN(value) && value !== null);
    }

    if (numericData.length === 0) {
      return { min: 0, max: 1 };
    }

    let MAX = Math.max(...numericData);
    let MIN = Math.min(...numericData);

    if (isNaN(MAX) || MAX === 0) {
      MAX = 1;
      MIN = 0;
    } else if (MAX === MIN) {
      const INCRE = ((Math.abs(MAX)) / 5);
      MAX = Number(MAX) + Number(INCRE);
      MIN = Number(MIN) - Number(INCRE);
    } else {
      const margin = MAX * 0.25;
      MAX = MAX + margin;
      
      const minMargin = Math.abs(MAX - MIN) * 0.1;
      MIN = MIN - minMargin;
    }
    
    if (!isLineChart) {
      MIN = MIN < 0 ? 0 : MIN;
    }

    return { min: MIN, max: MAX };
  };

  const yAxisRange = calculateYAxisRange();

  // 풍향 이미지를 그리는 플러그인
  const windImagePlugin = {
    id: 'windImagePlugin',
    afterDraw: (chart) => {
      if (!isWindData || Object.keys(windImages).length === 0) return;
      
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(1); // 풍향 데이터셋 인덱스
      
      if (!meta || !meta.data) return;
      
      meta.data.forEach((point, index) => {
        const dataItem = props.data[index];
        if (dataItem && dataItem.DATA2 && dataItem.DATA2 !== "-" && windImages[dataItem.DATA2]) {
          const img = windImages[dataItem.DATA2];
          const x = point.x;
          const y = point.y;
          const size = 20; // 이미지 크기
          
          ctx.save();
          ctx.drawImage(img, x - size/2, y - size/2, size, size);
          ctx.restore();
        }
      });
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            return props.data[dataIndex].DATE;
          }
        }
      }
    },
    scales: isWindData ? {
      x: {
        ticks: {
          maxTicksLimit: 21
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: yAxisRange.min,
        max: yAxisRange.max,
        ticks: {
          stepSize: (yAxisRange.max - yAxisRange.min) / 5
        },
        title: {
          display: true,
          text: '풍속 (㎧)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: yAxisRange.min,
        max: yAxisRange.max,
        ticks: {
          stepSize: (yAxisRange.max - yAxisRange.min) / 5
        },
        title: {
          display: true,
          text: '풍향'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    } : {
      x: {
        ticks: {
          maxTicksLimit: 21
        }
      },
      y: {
        min: yAxisRange.min,
        max: yAxisRange.max,
        ticks: {
          stepSize: (yAxisRange.max - yAxisRange.min) / 5
        }
      }
    },
    animation: {
      onComplete: () => {
        if (props.onRenderComplete && !isChartReady) {
          props.onRenderComplete();
        }
      }
    }
  };

  const labels = props.data
    .map((it, index) => {
      if (index === 0) {
        return it.DATE.substring(0, 16);
      }
      
      if (it.DATE) {
        const currentDate = it.DATE.substring(0, 7);
        const prevDate = props.data[index - 1].DATE.substring(0, 7);
        return currentDate !== prevDate ? it.DATE.substring(5, 16) : it.DATE.substring(8, 16);
      }
      
      return '';
    });

  const data = {
    labels,
    datasets: isWindData ? [
      {
        label: '풍속 (㎧)',
        data: props.data.map((it) => it.DATA === "-" ? null : parseFloat(it.DATA)),
        borderColor: '#96c6f7',
        backgroundColor: '#96c6f7',
        yAxisID: 'y',
        type: 'line'
      },
      {
        label: '풍향',
        data: props.data.map((it, index) => {
          // 풍향은 풍속과 같은 위치에 표시하되, 실제 값은 풍속 값 사용
          return it.DATA === "-" ? null : parseFloat(it.DATA);
        }),
        borderColor: '#878b8f',
        backgroundColor: '#878b8f',
        pointBackgroundColor: 'transparent', // 기본 포인트도 투명하게
        pointBorderColor: 'transparent',
        pointRadius: 10, // 포인트 영역 크기 (클릭 영역)
        yAxisID: 'y1',
        type: 'line',
        showLine: false // 라인 숨기기
      }
    ] : [
      {
        label: props.label,
        data: props.data.map((it) => it.DATA),
        borderColor: props.type === "0" ? '#c3dcf5' : props.type === "1" ? '#96c6f7' : props.type === "2" ? '#c3dcf5' : '#c3dcf5',
        backgroundColor: props.type === "0" ? '#c3dcf5' : props.type === "1" ? '#96c6f7' : props.type === "2" ? '#c3dcf5' : '#c3dcf5',
      }
    ],
  };

  console.log("------------------------------Graph [End]");

  return (
    <div>
      {(() => {
        // if(props.type === "0"){
        //   return(<Bar options={options} data={data} />);
        // }else if(props.type === "1"){
        //   return(<Line options={options} data={data} />);
        // }else if(props.type === "2"){
        //   return(<Bar options={options} data={data} />);
        // }else{
        //   return(<Line options={options} data={data} />);
        // }
        if(isLineChart){
          return(
            <Line 
              ref={chartRef}
              options={options} 
              data={data} 
              plugins={isWindData ? [windImagePlugin] : []}
            />
          );
        }else{
          return(<Bar options={options} data={data} />);
        }
      })()}
    </div>
  );
};

export default Graph;