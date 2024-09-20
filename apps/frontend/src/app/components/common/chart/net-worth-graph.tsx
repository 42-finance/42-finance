import { ChartData, ChartTypeRegistry, TooltipOptions } from 'chart.js'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'
import { format } from 'date-fns'
import { formatDateInUtc, formatDollarsSigned } from 'frontend-utils'
import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types'

import { useUserTokenContext } from '../../../contexts/user-token.context'
import { Loader } from '../loader/loader'

export type DataPoint = {
  x: number
  y: number
}

type Props = {
  data: DataPoint[]
  isLoading: boolean
}

export const NetWorthGraph: React.FC<Props> = ({ data, isLoading }) => {
  const chartRef = React.useRef<ChartJSOrUndefined>(null)
  const { currencyCode } = useUserTokenContext()

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
        backgroundColor: fillLevelGradient,
        borderColor: '#21409A',
        data,
        fill: true,
        label: 'Net Worth',
        lineTension: 0.1,
        pointBackgroundColor: '#21409A',
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
  }, [chartRef.current, data])

  const tooltip: _DeepPartialObject<TooltipOptions<keyof ChartTypeRegistry>> = {
    callbacks: {
      title: (data: any) => {
        return formatDateInUtc(new Date(data[0].raw.x), 'MMMM dd, yyyy')
      },
      label: (data: any) => {
        return formatDollarsSigned(data.raw.y, currencyCode)
      }
    },
    footerFont: {
      weight: 'normal',
      size: 11
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
                callback: (val: any, index, ticks) => {
                  const label = format(new Date(val), 'MMM dd, yyyy')
                  return ticks.length <= 1 || ticks[index].major ? label : ''
                }
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
                callback: (tickValue: string | number) => `${formatDollarsSigned(Number(tickValue), currencyCode)}`,
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
