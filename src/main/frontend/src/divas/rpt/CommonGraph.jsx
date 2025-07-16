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
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Spin } from 'antd';

CommmonChart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 풍향 아이콘 플러그인
const windDirectionIconPlugin = {
  id: 'windDirectionIcons',
  afterDatasetsDraw: function(chart, args, options) {
    // 플러그인 옵션에서 windDirectionEnabled 확인
    const pluginOptions = chart.config.options.plugins?.windDirectionIcons;
    const windDirectionEnabled = pluginOptions?.windDirectionEnabled;

    if (!windDirectionEnabled) return;
    
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(2); // 풍향 데이터셋 (인덱스 2)
    
    const windData = pluginOptions?.windData;
    if (!meta || !windData || !windData.deg_img) return;
    
    meta.data.forEach((element, index) => {
      const iconPath = windData.deg_img[index];
      // console.log(`Icon ${index}:`, iconPath);
      if (element && iconPath && iconPath !== "") {
        const iconSize = 16;
        const x = element.x;
        const y = element.y;
        
        // 이미지 로드 및 그리기
        const img = new Image();
        img.onload = function() {
          ctx.drawImage(img, x - iconSize/2, y - iconSize/2, iconSize, iconSize);
        };
        img.src = iconPath;
      }
    });
  }
};

CommmonChart.register(windDirectionIconPlugin);

const Graph = (props) => {
  console.log("[Start] RainGraph ------------------------------");
  console.log(props);

  const [isChartReady, setIsChartReady] = useState(false);
  const chartRef = useRef(null);

  // 로딩 상태 확인
  const isLoading = props.loading || 
    (props.sensorType === 'compare' 
      ? (!props.data || !props.data.rainData || !props.data.flowData || props.data.rainData.length === 0 || props.data.flowData.length === 0)
      : (props.sensorType === '3' || props.sensorType === '4' || props.sensorType === '5')
        ? (!props.data || typeof props.data !== 'object' || (!props.data.current && !props.data.vel))
        : (!props.data || props.data.length === 0)
    ) || !isChartReady;

  useEffect(() => {
    const hasValidData = props.sensorType === 'compare' 
      ? (props.data && props.data.rainData && props.data.flowData && props.data.rainData.length > 0 && props.data.flowData.length > 0)
      : (props.sensorType === '3' || props.sensorType === '4' || props.sensorType === '5')
        ? (props.data && typeof props.data === 'object' && (props.data.current || props.data.vel))
        : (props.data && props.data.length > 0);
      
    if (hasValidData) {
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
        height: '440px',
        flexDirection: 'column'
      }}>
        <Spin />
        <p></p>
      </div>
    );
  }

  // Y축 범위 계산
  const calculateYAxisRange = () => {
    let targetData;
    
    if (props.sensorType === 'compare') {
      // 비교분석일 때는 강우 데이터를 기준으로 계산
      targetData = props.data?.rainData || [];
    } else if (props.sensorType === '3' || props.sensorType === '5') {
      // 온도, 습도: current, max, min 데이터 모두 고려
      if (props.data && typeof props.data === 'object') {
        targetData = [
          ...(props.data.current || []),
          ...(props.data.max || []),
          ...(props.data.min || [])
        ];
      } else {
        targetData = [];
      }
    } else if (props.sensorType === '4') {
      // 풍속: vel, max_vel 데이터 고려
      if (props.data && typeof props.data === 'object') {
        targetData = [
          ...(props.data.vel || []),
          ...(props.data.max_vel || [])
        ];
      } else {
        targetData = [];
      }
    } else {
      // 센서 타입 0 (강우) 등 - 배열 데이터 처리
      if (Array.isArray(props.data)) {
        targetData = props.data;
      } else if (props.data && typeof props.data === 'object') {
        // 객체인 경우 빈 배열로 초기화 (데이터 타입이 맞지 않음)
        targetData = [];
      } else {
        targetData = [];
      }
    }
    
    if (!targetData || targetData.length === 0) {
      return { min: 0, max: 1 };
    }

    const numericData = targetData
      .map(item => parseFloat(item))
      .filter(value => !isNaN(value) && value !== null);

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
    
    // 강우량과 습도는 항상 0 이상
    if (props.sensorType === '0' || props.sensorType === '5') {
      MIN = MIN < 0 ? 0 : MIN;
    }

    return { min: MIN, max: MAX };
  };

  // 수위 Y축 범위 계산 (비교분석용)
  const calculateFlowYAxisRange = () => {
    if (props.sensorType !== 'compare' || !props.data?.flowData) {
      return { min: 0, max: 1 };
    }

    const numericData = props.data.flowData
      .map(item => parseFloat(item))
      .filter(value => !isNaN(value) && value !== null);

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

    return { min: MIN, max: MAX };
  };

  const yAxisRange = calculateYAxisRange();
  const flowYAxisRange = calculateFlowYAxisRange();

  const getLabel = () => {
    if (props.sensorType === '1') {
      return '수위';
    } else if (props.sensorType === '2') {
      return '적설';
    } else if (props.sensorType === '3') {
      return '온도';
    } else if (props.sensorType === '4') {
      return '풍속';
    } else if (props.sensorType === '5') {
      return '습도';
    } else {
      return '강우';
    }
  }

  const getTooltipLabel = () => {
    if (props.dataType === 'H') {
      return '시';
    } else if (props.dataType === 'D' || props.dataType === 'A') {
      return '일';
    } else if (props.dataType === 'N') {
      return '월';
    } else if (props.dataType === 'Y') {
      return '년';
    } else {
      return '시';
    }
  }

  // 시간별 라벨 생성 (00~23시)
  // const labels = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}시`);
  const labels = props.header;

  // 비교분석용 데이터셋 처리
  const createDatasets = () => {
    if (props.sensorType === 'compare' && props.data && props.data.rainData && props.data.flowData) {
      return [
        {
          type: 'bar',
          label: '강우량 (mm)',
          data: props.data.rainData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y_rain'
        },
        {
          type: 'line',
          label: '수위 (m)',
          data: props.data.flowData,
          borderColor: '#69F',
          backgroundColor: 'rgb(128, 186, 245)',
          fill: 'origin',
          tension: 0.1,
          yAxisID: 'y_flow'
        }
      ];
    } else if (props.sensorType === '3') {
      // 온도: 현재, 최고, 최저 라인그래프
      return [
        {
          label: '현재온도 (℃)',
          data: props.data.current || [],
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '최고온도 (℃)',
          data: props.data.max || [],
          borderColor: '#ff8c42',
          backgroundColor: 'rgba(255, 140, 66, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '최저온도 (℃)',
          data: props.data.min || [],
          borderColor: '#3d9be9',
          backgroundColor: 'rgba(61, 155, 233, 0.1)',
          fill: false,
          tension: 0.1
        }
      ];
    } else if (props.sensorType === '4') {
      // 풍향/풍속: 현재풍속, 최고풍속, 풍향
      return [
        {
          label: '현재풍속 (㎧)',
          data: props.data.vel || [],
          borderColor: '#20bf6b',
          backgroundColor: 'rgba(32, 191, 107, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '최고풍속 (㎧)',
          data: props.data.max_vel || [],
          borderColor: '#fa8231',
          backgroundColor: 'rgba(250, 130, 49, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '풍향',
          data: props.data.vel || [],
          borderColor: '#878b8f',
          backgroundColor: '#878b8f',
          pointBackgroundColor: 'transparent', // 기본 포인트도 투명하게
          pointBorderColor: 'transparent',
          pointRadius: 10, // 포인트 영역 크기 (클릭 영역)
          showLine: false
        }
      ];
    } else if (props.sensorType === '5') {
      // 습도: 현재, 최고, 최저 라인그래프
      return [
        {
          label: '현재습도 (%)',
          data: props.data.current || [],
          borderColor: '#4834d4',
          backgroundColor: 'rgba(72, 52, 212, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '최고습도 (%)',
          data: props.data.max || [],
          borderColor: '#6c5ce7',
          backgroundColor: 'rgba(108, 92, 231, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '최저습도 (%)',
          data: props.data.min || [],
          borderColor: '#a29bfe',
          backgroundColor: 'rgba(162, 155, 254, 0.1)',
          fill: false,
          tension: 0.1
        }
      ];
    }
    
    // 일반 데이터셋 (강우 등)
    return [
      {
        label: getLabel(),
        data: props.data,
        borderColor: props.sensorType === '1' ? '#96c6f7' : '#c3dcf5',
        backgroundColor: props.sensorType === '1' ? 'rgba(150, 198, 247, 0.2)' : '#c3dcf5',
        fill: props.sensorType === '1' ? 'origin' : false,
        tension: 0.1
      }
    ];
  };

  // Y축 설정 - 비교분석용
  const createScales = () => {
    if (props.sensorType === 'compare') {
      return {
        x: {
          ticks: {
            maxTicksLimit: 25
          }
        },
        // 좌측 여백 + 격자선용 Y축
        y_left: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: yAxisRange.max,
          ticks: {
            display: false // 눈금 숨김
          },
          grid: {
            color: '#e0e0e0',
            drawOnChartArea: true,
            drawTicks: false,
            lineWidth: 1
          },
          border: {
            display: false
          },
          afterFit: function(scale) {
            scale.width = 20;
          }
        },
        // 강우량 Y축
        y_rain: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: yAxisRange.max,
          ticks: {
            color: 'rgba(54, 162, 235, 1)', // 파란색
            padding: 5,
            callback: function(value) {
              return parseFloat(value).toFixed(1);
            },
            maxTicksLimit: 10,
            stepSize: (yAxisRange.max - 0) / 7
          },
          grid: {
            display: true,
            color: 'rgba(54, 162, 235, 1)',
            lineWidth: 3,
            drawOnChartArea: false,
            drawTicks: false,
            borderColor: 'rgba(54, 162, 235, 1)', // Y축 테두리 색상
            borderWidth: 3 // Y축 테두리 굵기
          },
          afterFit: function(scale) {
            scale.width = 40;
          }
        },
        // 수위 Y축
        y_flow: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: flowYAxisRange.max,
          ticks: {
            color: '#69F', // 파란색
            padding: 5,
            callback: function(value) {
              return parseFloat(value).toFixed(2);
            },
            maxTicksLimit: 10,
            stepSize: (flowYAxisRange.max - 0) / 7
          },
          grid: {
            display: true,
            color: '#69F',
            lineWidth: 3,
            drawOnChartArea: false,
            drawTicks: false,
            borderColor: '#69F', // Y축 테두리 색상
            borderWidth: 3 // Y축 테두리 굵기
          },
          afterFit: function(scale) {
            scale.width = 30;
          }
        }
      };
    }
    
    // 일반 스케일
    return {
      x: {
        ticks: {
          maxTicksLimit: 25
        }
      },
      y: {
        min: yAxisRange.min,
        max: yAxisRange.max,
        ticks: {
          stepSize: (yAxisRange.max - yAxisRange.min) / 7
        }
      }
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false,
        // text: `${props.rtuName || ''} 시간별 강우량`
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const dataIndex = props.header[context[0].dataIndex];
            return `${dataIndex}${getTooltipLabel()}`;
          },
          label: function(context) {
            if (props.sensorType === 'compare') {
              const unit = context.datasetIndex === 0 ? 'mm' : 'm';
              return `${context.dataset.label}: ${isNaN(context.parsed.y) ? "-" : context.parsed.y} ${unit}`;
            } else if (props.sensorType === '4') {
              if (context.datasetIndex === 2) {
                // 풍향 데이터셋
                const windDirText = props.data.deg[context.dataIndex];
                return `${context.dataset.label}: ${windDirText}`;
              } else {
                // 풍속 데이터에 풍향 정보 추가
                return `${context.dataset.label}: ${context.parsed.y === "-" ? "-" : context.parsed.y}㎧`;
              }
            }
            return `${context.dataset.label}: ${context.parsed.y === "-" ? "-" : context.parsed.y}`;
          }
        }
      },
      windDirectionIcons: {
        windDirectionEnabled: props.sensorType === '4',
        windData: props.sensorType === '4' && props.windData ? props.windData : null
      }
    },
    scales: createScales(),
    animation: {
      onComplete: () => {
        if (props.onRenderComplete && !isChartReady) {
          props.onRenderComplete();
        }
      }
    }
  };

  const data = {
    labels,
    datasets: createDatasets()
  };

  console.log("------------------------------RainGraph [End]");

  // 차트 타입 결정
  const getChartComponent = () => {
    if (props.sensorType === 'compare') {
      // 혼합 차트는 Line 컴포넌트를 기본으로 사용
      return Line;
    } else if (props.sensorType === '0' || props.sensorType === '2') {
      return Bar;
    } else if (props.sensorType === '3' || props.sensorType === '4' || props.sensorType === '5') {
      // 온도, 풍속, 습도는 라인차트
      return Line;
    } else {
      return Line;
    }
  };
  
  const ChartComponent = getChartComponent();

  return (
    <div style={{ width: '100%', height: '100%', padding: '5px' }}>
      <ChartComponent ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default Graph; 