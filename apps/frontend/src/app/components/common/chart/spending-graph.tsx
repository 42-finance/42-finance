import { ChartData, ChartTypeRegistry, TooltipOptions } from 'chart.js'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'
import { formatDollarsSigned, lightColors } from 'frontend-utils'
import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types'

import { Loader } from '../loader/loader'

export type DataPoint = {
  x: number
  y: number
}

type Props = {
  lastMonthData: DataPoint[]
  thisMonthData: DataPoint[]
  isLoading: boolean
}

export const SpendingGraph: React.FC<Props> = ({ lastMonthData, thisMonthData, isLoading }) => {
  const chartRef = React.useRef<ChartJSOrUndefined>(null)

  const [chartData, setChartData] = React.useState<ChartData<'line', (number | null)[], unknown>>({
    datasets: []
  })

  useMemo(() => {
    const chart = chartRef.current

    if (chart) {
      const ctx = chart.canvas.getContext('2d')

      let fillLevelGradient

      if (ctx) {
        fillLevelGradient = ctx.createLinearGradient(0, 0, 0, 400)
        fillLevelGradient.addColorStop(0, `#21409A66`)
        fillLevelGradient.addColorStop(1, `#21409A19`)
      }

      const datasets: any[] = []

      datasets.push({
        backgroundColor: '#FFFFFF00',
        borderColor: '#555',
        data: lastMonthData,
        fill: true,
        label: 'Net Worth',
        lineTension: 0.1,
        pointBackgroundColor: '#555',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
        pointHoverRadius: 6,
        radius: 0,
        spanGaps: true
      })

      datasets.push({
        backgroundColor: '#FFFFFF00',
        borderColor: lightColors.primary,
        data: thisMonthData,
        fill: true,
        label: 'Net Worth',
        lineTension: 0.1,
        pointBackgroundColor: lightColors.primary,
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
        pointHoverRadius: 6,
        radius: 0,
        spanGaps: true
      })

      setChartData({
        datasets
      })
    }
  }, [chartRef.current, lastMonthData, thisMonthData])

  const tooltip: _DeepPartialObject<TooltipOptions<keyof ChartTypeRegistry>> = {
    callbacks: {
      title: (data: any) => {
        return ''
      },
      label: (data: any) => {
        return formatDollarsSigned(data.raw.y)
      }
    },
    footerFont: {
      weight: 'normal',
      size: 14
    }
  }

  return (
    <div className="relative mb-2.5 h-80">
      {isLoading && <Loader />}
      <Chart
        type="line"
        ref={chartRef}
        data={chartData}
        height={360}
        options={{
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          datasets: {
            line: {
              pointRadius: 0
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          maintainAspectRatio: false,
          parsing: false,
          normalized: true,
          plugins: {
            annotation: {
              annotations: {}
            },
            decimation: {
              enabled: true,
              algorithm: 'lttb'
            },
            legend: {
              display: false
            },
            tooltip,
            datalabels: {
              display: false
            }
          },
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false
              },
              type: 'time',
              ticks: {
                source: 'auto',
                minRotation: 0,
                maxRotation: 0,
                major: {
                  enabled: true
                },
                font: {
                  family: 'Barlow'
                },
                callback: (val: any, index, ticks) => null
              }
            },
            y: {
              type: 'linear',
              grid: {
                drawTicks: false
              },
              ticks: {
                padding: 10,
                minRotation: 0,
                maxRotation: 0,
                maxTicksLimit: 6,
                callback: (tickValue: string | number) => `${formatDollarsSigned(Number(tickValue))}`,
                font: {
                  family: 'Barlow'
                }
              }
            }
          }
        }}
      />
    </div>
  )
}
