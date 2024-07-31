<template>
  <Navbar>
    <div class="w-full pt-[6%] bg-[#CAF4FF] ">
      <!-- Home Page Content -->
      <!-- <div>
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>

        <div v-if="loading">Loading...</div>

        <div v-if="studentCounts">
          <h2>Student Counts</h2>
          <p>Total Students: {{ studentCounts.totalStudents }}</p>
          <p>Failed Students: {{ studentCounts.passedCount }}</p>
          <p>Failed Students: {{ studentCounts.failedCount }}</p>
          <p>Pass Percentage: {{ studentCounts.passPercentage }}%</p>
          <p>Fail Percentage: {{ studentCounts.failPercentage }}%</p>
        </div>

        
      </div> -->
      <div v-if="loading">Loading...</div>

      <div v-if="studentCounts" class=" w-2/3 mx-auto grid grid-cols-12 gap-4">
            <div class=" col-span-4 text-black bg-green-400 rounded-lg  px-6 py-6">
              <h1 class=" text-2xl">Total Students</h1>
              <p class=" text-2xl"> {{ studentCounts.totalStudents }}</p><br>
              <span>All students from the database</span>
            </div>
            <div class=" col-span-4 text-white bg-green-400 rounded-lg  px-6 py-6">
              <h1 class=" text-2xl">passed Students</h1>
              <p class=" text-2xl"> {{ studentCounts.passedCount }}</p><br>
              <span>Student pass in the database</span>
            </div>
            <div class=" col-span-4 text-white bg-red-400 rounded-lg  px-6 py-6">
              <h1 class=" text-2xl">Failed Students</h1>
              <p class=" text-2xl"> {{ studentCounts.failedCount }}</p><br>
              <span>Student fail in the database
              </span>
            </div>
            <div class=" col-span-6 text-white bg-cyan-400 rounded-lg  px-6 py-6">
              <h1 class=" text-2xl">Pass Percentage</h1>
              <p class=" text-2xl"> {{ studentCounts.passPercentage }}%</p>
            </div>
            <div class=" col-span-6 text-white bg-cyan-400 rounded-lg  px-6 py-6">
              <h1 class=" text-2xl">Fail Percentage</h1>
              <p class=" text-2xl">  {{ studentCounts.failPercentage }}%</p>
            </div>
        </div>

      <!-- Statistics Section -->

      <!-- Chart Container -->
      <div class="w-2/3 mx-auto mt-5">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Content of your page -->
      <div class="content">
        <!-- Add your page content here -->
      </div>
    </div>
  </Navbar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import Navbar from "../../components/NavBar.vue";

const loading = ref(false);
const studentCounts = ref(null);
const chartData = ref(null);
const totalStudents = ref(0);
const studentsPassed = ref(0);
const studentsFailed = ref(0);
const chartCanvas = ref(null);

// Fetch both student counts and chart data on mounted
onMounted(async () => {
  fetchStudentCounts();
  fetchChartData();
});

// Fetch student counts
const fetchStudentCounts = async () => {
  loading.value = true;
  try {
    const response = await fetch("http://result.test/api/student-counts");
    if (!response.ok) {
      throw new Error("Failed to fetch student counts");
    }
    studentCounts.value = await response.json();
  } catch (error) {
    console.error("Error fetching student counts:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch chart data and render chart
const fetchChartData = async () => {
  try {
    const response = await fetch("http://result.test/api/chart");
    if (!response.ok) {
      throw new Error("Failed to fetch chart data");
    }
    chartData.value = await response.json();
    renderChart();
    calculateStatistics(); // Calculate statistics after fetching data
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

// Render the chart using Chart.js
const renderChart = () => {
  if (!chartData.value) return;

  const ctx = chartCanvas.value.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: "Pass Rate by Region",
          data: chartData.value.datasets.map((dataset) => dataset.data),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Calculate statistics based on chart data
const calculateStatistics = () => {
  if (!chartData.value) return;

  // Calculate total students
  totalStudents.value = chartData.value.datasets.reduce(
    (acc, dataset) => acc + dataset.data.length,
    0
  );

  // Calculate students passed and failed
  studentsPassed.value = chartData.value.datasets.reduce((acc, dataset) => {
    return acc + dataset.data.filter((score) => score > 40).length;
  }, 0);

  studentsFailed.value = totalStudents.value - studentsPassed.value;
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px; /* Adjust top padding as needed */
}

.chart-container {
  width: 80%; /* Adjust width as needed */
  max-width: 800px; /* Limit maximum width for responsiveness */
  height: 300px;
  margin-top: 90px; /* Adjust height as needed */
  margin-bottom: 10px; /* Add margin bottom for separation */
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
