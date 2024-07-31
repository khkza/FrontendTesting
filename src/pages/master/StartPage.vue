<template>
  <Navbar>
    <div class="grid grid-cols-2">
      <div class="back h-screen">
        <div class="h-screen flex justify-center items-start mt-20">
          <div class="px-[10%] text-green-200 text-center textColor">
            <h1 class="text-6xl font-serif mb-10">
              A Good Education Is A Foundation Forr Better Future
            </h1>
            <p class="text-xl leading-loose">
              Our free Online Results Service is the quickest and easiest way to
              access your exam results. You can then go online and check your
              results.
            </p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-blue-500 text-2xl list">
          အောင်စာရင်းများကို ဤနေရာတွင်ရှာဖွေနိုင်သည်
        </p>
        <br />
        <div
          class="flex justify-center bg-gray-200 items-center gap-x-4 search-bar"
        >
          <input
            type="text"
            v-model="searchQuery"
            id="search-query"
            class="search-input bg-white px-10 py-3 mt-4 hover:text-red-800 hover:bg-white"
            placeholder="Enter Roll No or Name"
          />
          <button
            @click="search"
            class="search-button bg-white px-10 py-3 rounded-full mt-4 hover:text-red-800 hover:bg-white"
          >
            Search
          </button>

          <a href="javascript: location.reload();"
            ><button
              class="search-button bg-white px-10 py-3 rounded-full mt-4 hover:text-red-800 hover:bg-white"
            >
              Refresh
            </button></a
          >
        </div>
        <div>
          <div v-if="filteredResults.length > 0" class="results">
            <h3 class="text-2xl mb-4">Search Results:</h3>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-300 text-white">
                <tr>
                  <th class="px-4 py-2">Roll No</th>
                  <th class="px-4 py-2">Student Name</th>
                  <th class="px-4 py-2">Pass/Fail</th>
                  <th class="px-4 py-2">Credit Subjects</th>
                </tr>
              </thead>
              <tbody class="bg-gray-400 text-white">
                <tr v-for="student in paginatedResults" :key="student.roll_no">
                  <td class="px-4 py-2">{{ student.roll_no }}</td>
                  <td class="px-4 py-2">{{ student.student_name }}</td>
                  <td
                    :class="{
                      pass: calculatePassOrFail(student) === 'Pass',
                      fail: calculatePassOrFail(student) === 'Fail',
                    }"
                  >
                    {{ calculatePassOrFail(student) }}
                  </td>
                  <td>
                    {{ formatCreditSubjects(calculateCreditSubjects(student)) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="pagination mt-4">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="bg-gray-500 px-4 py-2 rounded-l hover:bg-gray-500"
              >
                Previous
              </button>
              <span class="px-4 py-2">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="bg-gray-500 px-4 py-2 rounded-r hover:bg-gray-500"
              >
                Next
              </button>
            </div>
            <!-- No Results Found -->
            <div
              v-if="filteredResults.length === 0 && searchQuery"
              class="no-results mt-4"
            >
              <p>No results found for: {{ searchQuery }}.</p>
            </div>
            <!-- No Results Found -->
            <div
              v-if="filteredResults.length === 0 && searchQuery"
              class="no-results mt-4"
            >
              <p>No results found for: {{ searchQuery }}.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
    </div>
  </Navbar>
</template>

<script setup>
import Navbar from "../../components/NavBar.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Reactive state variables
const searchQuery = ref("");
const students = ref([]);
const results = ref([]);
const filteredResults = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

// Fetch students from the API
async function fetchStudents() {
  try {
    const response = await axios.get("http://result.test/api/students");
    students.value = response.data.map((student) => ({
      ...student,
      major: student.major || "Unknown", // Ensure 'major' is initialized
    }));
    console.log("Fetched students:", students.value);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Fetch results from the API
async function fetchResults() {
  try {
    const response = await axios.get("http://result.test/api/resultlist");
    const resultsData = response.data;

    // Merge students with results based on roll_no
    results.value = resultsData.map((result) => {
      const student = students.value.find((s) => s.roll_no === result.roll_no);
      return {
        ...result,
        student_name: student ? student.student_name : "Unknown",
        major: student ? student.major : "Unknown",
      };
    });

    console.log("Fetched results with major:", results.value);
  } catch (error) {
    console.error("Error fetching results:", error);
  }
}

// Fetch both students and results
async function fetchData() {
  await Promise.all([fetchStudents(), fetchResults()]);
}

// Search students by roll number or name
function search() {
  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    filteredResults.value = results.value.filter(
      (student) =>
        student.roll_no.toLowerCase().includes(query) ||
        student.student_name.toLowerCase().includes(query)
    );
    currentPage.value = 1; // Reset to the first page
  } else {
    filteredResults.value = [];
  }
}

// Calculate pass or fail
function calculatePassOrFail(student) {
  const passThreshold = 40;
  const subjects = [
    "myanmar",
    "english",
    "mathematics",
    "chemistry",
    "physics",
    "biological",
  ];

  for (let subject of subjects) {
    if (student[subject] < passThreshold) {
      return "Fail";
    }
  }
  return "Pass";
}

// Calculate credit subjects
function calculateCreditSubjects(student) {
  const credits = [];

  if (student.myanmar >= 75) credits.push("Myanmar");
  if (student.english >= 75) credits.push("English");
  if (student.mathematics >= 80) credits.push("Mathematics");
  if (student.chemistry >= 80) credits.push("Chemistry");
  if (student.physics >= 80) credits.push("Physics");

  // Check for biological subject based on the major
  if (student.major === "bio" && student.biological >= 75) {
    credits.push("Biological");
  } else if (student.major === "eco" && student.biological >= 75) {
    credits.push("Economics");
  }

  return credits;
}

// Format credit subjects as a comma-separated string
function formatCreditSubjects(subjects) {
  return subjects.join(", ");
}

// Computed property for paginated results
const paginatedResults = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredResults.value.slice(startIndex, endIndex);
});

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredResults.value.length / itemsPerPage);
});

// Methods for pagination
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// Fetch initial data when the component is mounted
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.back {
  background-image: url("https://myanmar-now.org/mm/wp-content/uploads/sites/7/drupal/news-images/ministry_of_education.jpg");
  background-size: auto;
  background-position: center 50%;
  background-repeat: no-repeat;
}
.search-bar {
  margin-top: 16px;
  background: gray;
  width: 90%;
  margin: 1 auto;
  margin-left: 50px;
  height: 100px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-input {
  border-radius: 0.375rem; /* Adjust according to your design */
}
.search-button {
  border-radius: 0.375rem;
}

.results {
  width: 90% !important;
  margin: 0 auto;
}

.results table {
  width: 100%;
  border-collapse: collapse;
}
.results th,
.results td {
  border: 1px solid #e5e7eb; /* Adjust according to your design */
  padding: 0.75rem;
}
.results th {
  background-color: #19747e; /* Adjust according to your design */
}
.pass {
  background-color: #0be8d6; /* Light green for pass */
}
.fail {
  background-color: #f8d7da; /* Light red for fail */
}
.pagination {
  display: flex;
  justify-content: center;
}
.pagination button {
  background-color: #81a0a9; /* Adjust according to your design */
  color: white;
}
.no-results {
  text-align: center;
  margin-top: 20px;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #caf4ff; /* Light grey background for the whole app */
}

header {
  background-color: #3498db; /* Primary color for header */
  color: white;
  padding: 10px;
  border-bottom: 1px solid #cccccc;
}

nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: flex-start;
}

nav li {
  margin-right: 10px;
}

.nav-link {
  color: rgb(73, 40, 194);
  text-decoration: none;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #c3d4e4; /* Darker shade for hover effect */
  border-radius: 5px;
}

main {
  flex: 1;
  padding: 20px;
  background-color: #d4dfe7; /* Light grey background for main content area */
}

aside {
  background-color: #2e21e6; /* White background for sidebar */
  padding: 20px;
  border-left: 1px solid #ccc;
  width: 250px;
}

.sidebar {
  background-color: #400bed; /* Light grey background for sidebar widgets */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Shadow effect */
}

h2 {
  margin-bottom: 10px;
  color: #3498db; /* Primary color for headings */
}

ul {
  padding: 0;
  list-style-type: none;
}

li {
  margin-bottom: 10px;
}

.router-link-active {
  font-weight: bold;
}

.router-link-active::before {
  content: "• "; /* Bullet point before active link */
  color: #3498db; /* Primary color for active link bullet */
}

.textColor {
  background: #f8ffe8;
  background: linear-gradient(to right, #87b02e 0%, #97c313 33%, #c8c2c2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.list {
  margin-left: 300px;
  margin-top: 50px;
}
</style>
