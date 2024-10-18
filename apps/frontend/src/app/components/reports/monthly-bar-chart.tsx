import { ChartData } from 'chart.js'
import { formatDollars } from 'frontend-utils'
import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { Loader } from '../common/loader/loader'

type Data = {
  value: number
  label: string
  date: Date
  color: string
}

type Props = {
  data: Data[]
  onSelected: (date: Date) => void
  isLoading: boolean
}

export const MonthlyBarChart: React.FC<Props> = ({ data, onSelected, isLoading }) => {
  const { currencyCode } = useUserTokenContext()

  const chartRef = React.useRef<ChartJSOrUndefined>(null)
  const [chartData, setChartData] = React.useState<ChartData<'bar', (number | null)[], unknown>>({
    datasets: []
  })

  const graphData = useMemo(
    () =>
      data.map((a: Data) => ({
        x: a.label,
        y: a.value,
        color: a.color
      })),
    [data]
  )

  useMemo(() => {
    const chart = chartRef.current
    if (chart) {
      const datasets: any[] = []

      datasets.push({
        data: graphData,
        backgroundColor: graphData.map((d) => d.color),
        borderRadius: 5
      })

      setChartData({
        datasets
      })
    }
  }, [graphData, chartRef.current])

  const formatYLabel = (value: string) => {
    const num = Number(value)
    if (num < 0) {
      if (num > -1000) {
        return `-${formatDollars(num, currencyCode, 0)}`
      }
      return `-${formatDollars(num / 1000, currencyCode, 0)}K`
    } else {
      if (num < 1000) {
        return `${formatDollars(num, currencyCode, 0)}`
      }
      return `${formatDollars(num / 1000, currencyCode, 0)}K`
    }
  }

  return (
    <div>
      <div className="relative h-[250px]">
        {isLoading && <Loader />}
        <Chart
          type="bar"
          ref={chartRef}
          data={chartData}
          height={160}
          options={{
            animation: false,
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    family: 'Barlow'
                  }
                }
              },
              y: {
                ticks: {
                  padding: 10,
                  minRotation: 0,
                  maxRotation: 0,
                  maxTicksLimit: 6,
                  callback: (tickValue: string | number) => formatYLabel(tickValue as string),
                  font: {
                    family: 'Barlow'
                  }
                },
                grid: {
                  drawTicks: false
                }
              }
            },
            plugins: {
              annotation: {
                annotations: {
                  optimal: {
                    drawTime: 'beforeDraw',
                    type: 'box',
                    backgroundColor: '#FFFFFF00',
                    borderWidth: 0,
                    yMax: 90,
                    yMin: 60
                  }
                }
              },
              tooltip: {
                enabled: false
              },
              legend: {
                display: false
              },
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (value) => (value.y != null ? formatYLabel(value.y) : ''),
                font: {
                  weight: 'bold',
                  family: 'Barlow',
                  size: 16
                },
                offset: 0
              }
            },
            onClick: (c, i) => {
              onSelected(data[i[0].index].date)
            }
          }}
        />
      </div>
    </div>
  )
}
