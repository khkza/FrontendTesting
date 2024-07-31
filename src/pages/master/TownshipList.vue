<template>
  <Navbar>
    <div class="w-full h-[95vh]">
      <div class="container">
        <!-- Toggle between Pass and Fail -->
        <div class="form-container">
          <div class="toggle-pass-fail">
            <div class="h">
              <div class="flex gap-4">
                <label>
                  <input type="checkbox" v-model="passChecked" /> Pass
                </label>
                <p v-if="passChecked">Pass Count: {{ passCount }}</p>

                <label>
                  <input type="checkbox" v-model="failChecked" /> Fail
                </label>
                <p v-if="failChecked">Fail Count: {{ failCount }}</p>
              </div>
              <br />
            </div>

            <!-- Region Selection Dropdown -->
            <div class="s">
              <div class="flex gap-4">
                <label for="township_id" class="label">Township:</label>
                <select
                  v-model="selectedTownship"
                  @change="handleChange"
                  class="select-township"
                >
                  <option value="" disabled>Select Township</option>
                  <option
                    v-for="township in filteredTownships"
                    :key="township.id"
                    :value="township.id"
                  >
                    {{ township.name }}
                  </option>
                </select>

                <!-- Refresh button -->
                <div v-if="selectedTownship">
                  <button @click="handleRefresh" class="refresh-button">
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>

        <!-- Credit Subject Filters -->
        <div class="credit-subjects">
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="all" />
            All
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="none" />
            None
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="one" />
            1 D
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="two" />
            2 D
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="three" />
            3 D
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="four" />
            4 D
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="five" />
            5 D
          </label>
          <label>
            <input type="radio" v-model="selectedCreditFilter" value="six" />
            6 D
          </label>
        </div>

        <!-- Display Selected Township -->
        <div class="tab">
          <div v-if="!selectedTownship" class="no-township-selected">
            <p>Select a township to view results.</p>
          </div>

          <!-- Display Students -->
          <div v-if="filteredResults.length > 0" class="results">
            <h3>Students in {{ selectedTownshipName }} Result:</h3>
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Pass Or Fail</th>
                  <th>Credit Subjects</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in paginatedResults" :key="student.id">
                  <td>{{ student.roll_no }}</td>
                  <td>{{ student.student_name }}</td>

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
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">
                Previous
              </button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">
                Next
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="selectedTownship && filteredResults.length === 0"
          class="no-results"
        >
          <p>No results found for {{ selectedTownshipName }}.</p>
        </div>
      </div>
    </div>
    <footer>
      <p class="bg-gray-200 flex justify-center items-center py-2">
        Copyright © 2024 All Rights Reserved.
      </p>
    </footer>
  </Navbar>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import axios from "axios";
import Navbar from "../../components/NavBar.vue";

// Initialize variables
const selectedTownship = ref("");
const townships = ref([]);
const allResults = ref([]);
const filteredResults = ref([]);
const students = ref([]);
const selectedTownshipName = ref("");
const searchQuery = ref("");

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = 10; // Number of items per page

// Checkbox states
const passChecked = ref(true); // Default to showing passed students
const failChecked = ref(false); // Default to hiding failed students

// Selected credit subject filter
const selectedCreditFilter = ref("all"); // Default to 'all'

// Simulate fetching townships from an API
fetchTownships();

async function fetchTownships() {
  try {
    const response = await fetch("http://result.test/api/township");
    if (!response.ok) throw new Error("Failed to fetch townships");
    townships.value = await response.json();
  } catch (error) {
    console.error("Error fetching townships:", error);
  }
}

// Fetch students data
async function fetchStudents() {
  try {
    const response = await axios.get("http://result.test/api/students");
    students.value = response.data;

    // Merge students with results based on roll_no
    allResults.value.forEach((result) => {
      const student = students.value.find((s) => s.roll_no === result.roll_no);
      if (student) {
        result.major = student.major || "Unknown";
      }
    });
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Watch for changes in selectedTownship and update selectedTownshipName and filteredResults
watchEffect(() => {
  if (selectedTownship.value) {
    const township = townships.value.find(
      (t) => t.id === selectedTownship.value
    );
    selectedTownshipName.value = township ? township.name : "";
    updateFilteredResults();
  }
});

// Handle change event to fetch results for the selected township
async function handleChange() {
  try {
    const response = await fetch(
      `http://result.test/api/resultlist?township_id=${selectedTownship.value}`
    );
    if (!response.ok) throw new Error("Failed to fetch results");
    allResults.value = await response.json();
    await fetchStudents(); // Fetch students after getting results
    updateFilteredResults();
  } catch (error) {
    console.error("Error fetching results:", error);
  }
}

// Function to update filteredResults based on selectedTownship, checkbox states, and credit subject filter
function updateFilteredResults() {
  filteredResults.value = allResults.value.filter((student) => {
    const studentStatus = calculatePassOrFail(student);
    const creditSubjectsPassed = calculateCreditSubjects(student);

    return (
      student.township_id === selectedTownship.value &&
      ((passChecked.value && studentStatus === "Pass") ||
        (failChecked.value && studentStatus === "Fail")) &&
      meetsCreditSubjectFilter(creditSubjectsPassed)
    );
  });
  // Reset pagination to first page when filtering results
  currentPage.value = 1;
}

// Function to calculate Pass or Fail based on scores
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

// Function to calculate credit subjects passed
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

// Function to format credit subjects as a comma-separated string
function formatCreditSubjects(subjects) {
  return subjects.join(", ");
}

// Function to check if the student meets the selected credit subject filter
function meetsCreditSubjectFilter(subjectsPassed) {
  const subjectsCount = subjectsPassed.length;
  switch (selectedCreditFilter.value) {
    case "all":
      return true; // Show all students
    case "none":
      return subjectsCount === 0;
    case "one":
      return subjectsCount === 1;
    case "two":
      return subjectsCount === 2;
    case "three":
      return subjectsCount === 3;
    case "four":
      return subjectsCount === 4;
    case "five":
      return subjectsCount === 5;
    case "six":
      return subjectsCount === 6;
    default:
      return false;
  }
}

// Computed property to count pass students
const passCount = computed(() => {
  return filteredResults.value.filter(
    (student) => calculatePassOrFail(student) === "Pass"
  ).length;
});

// Computed property to count fail students
const failCount = computed(() => {
  return filteredResults.value.filter(
    (student) => calculatePassOrFail(student) === "Fail"
  ).length;
});

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

// Computed property to filter townships based on search query
const filteredTownships = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return townships.value;
  } else {
    return townships.value.filter((township) =>
      township.name.toLowerCase().includes(query)
    );
  }
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

// Function to handle refreshing data
async function handleRefresh() {
  if (!selectedTownship.value) {
    // If no region is selected, do not perform refresh
    return;
  }

  try {
    // Clear current results and students data
    allResults.value = [];
    filteredResults.value = [];
    students.value = [];
    selectedTownship.value = ""; // Clear selected region

    // Optionally hide refresh button here
    // No need to explicitly hide button; the v-if in template will handle it

    // You may want to update the state or fetch new data if needed
    // await handleChange(); // Only if you want to refetch after clearing
  } catch (error) {
    console.error("Error refreshing data:", error);
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 10px auto;
  padding: 100px 100px 100px 300px;
}

.form-container {
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.toggle-pass-fail label {
  margin-right: 15px;
}

.toggle-pass-fail p {
  display: inline;
  margin-left: 10px;
}

.township-selection {
  margin: 15px 0;
}

.township-search {
  margin-right: 10px;
  padding: 5px;
}

.select-township {
  padding: 5px;
}

.credit-subjects label {
  margin-right: 15px;
}

.refresh-button {
  width: 100px;
  height: 30px;

  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #0056b3;
}

.results table {
  width: 100%;
  border-collapse: collapse;
}

.results th,
.results td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.results th {
  background-color: #f4f4f4;
}

.pass {
  color: green;
}

.fail {
  color: red;
}

.pagination {
  margin: 15px 0;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}
.tab {
  width: 40%;
  margin-left: 3%;
}
.no-township-selected,
.no-results {
  margin-top: 20px;
  width: 100%;
  padding: 15px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  border-radius: 4px;
}
.h {
  margin-left: 20%;
}
.s {
  margin-left: 20%;
}
</style>
