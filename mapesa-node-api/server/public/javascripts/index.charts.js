//analytics

let md = [['Year', 'Sales', 'Expenses']]
var figOneData
const getFigOneData = async () => {
  try {
    let res = await axios.get('/get-data?dType=figure1')
    figOneData = res.data
  } catch (error) {
    console.log(error)
  }
}

const mapMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const prepareLabels = () => {
  let allLabels = []
  for (var i of figOneData) {
    allLabels.push(`${mapMonths[i.label.month - 1]}`)
  }
  return allLabels
}

const processData = () => {
  //labels

  //income
  let incomeData = []
  for (var i of figOneData) {
    incomeData.push(i.data.income)
  }
  return {
    label: 'Income',
    backgroundColor: 'rgba(46, 101, 243, 1)',
    data: incomeData,
    barThickness: 50,
  }
}

const processSpentData = () => {
  let incomeData = []
  for (var i of figOneData) {
    incomeData.push(i.data.spent)
  }
  return {
    label: 'Spent',
    backgroundColor: 'rgba(0, 190, 190, 1)',
    data: incomeData,
    barThickness: 50,
  }
}

const plotChart = async () => {
  await getFigOneData()
  processData()
  const ctx = document.getElementById('playground').getContext('2d')
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: prepareLabels(),
      datasets: [processData(), processSpentData()],
    },
    options: {
      scales: {
        y: {
          suggestedMin: 50,
          suggestedMax: 100,
          beginAtZero: true,
          grid: {
            color: '#E0E2E7',
            borderColor: '#FFFFFF',
            borderDash: [5, 15],
          },

          ticks: {
            stepSize: 20000,
            color: '#9CA1AD',
            font: {
              family: "'Inter', sans-serif",
              size: 10,
              weight: 'bold',
            },
          },
        },
        x: {
          grid: {
            color: '#FFFFFF',
            borderColor: '#FFFFFF',
          },
          ticks: {
            color: '#9CA1AD',
            font: {
              family: "'Inter', sans-serif",
              size: 10,
              weight: 'bold',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })

  return myChart
}

plotChart()
