<template>
  <Navbar>
    <div class="results-container">
      <h1 class="page-title">Here Are Your Exam Results!</h1>
      <br /><br />

      <!-- Display results for each student -->
      <div
        v-for="student in filteredResults"
        :key="student.roll_no"
        :class="{
          pass: calculatePassOrFail(student) === 'Pass',
          fail: calculatePassOrFail(student) === 'Fail',
        }"
        class="student-result"
      >
        <h2 class="student-name">{{ student.student_name }}</h2>
        <br /><br />

        <div
          :class="{
            con: true,
            'success-background': calculatePassOrFail(student) === 'Pass',
            'fail-background': calculatePassOrFail(student) === 'Fail',
          }"
        >
          <div
            v-if="calculatePassOrFail(student) === 'Pass'"
            class="icon-success-container flex items-center"
          >
            <!-- Success Icon -->
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="success-icon mr-3"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.5 18C14.9183 18 18.5 14.4183 18.5 10C18.5 5.58172 14.9183 2 10.5 2C6.08172 2 2.5 5.58172 2.5 10C2.5 14.4183 6.08172 18 10.5 18ZM14.2071 8.70711C14.5976 8.31658 14.5976 7.68342 14.2071 7.29289C13.8166 6.90237 13.1834 6.90237 12.7929 7.29289L9.5 10.5858L8.20711 9.29289C7.81658 8.90237 7.18342 8.90237 6.79289 9.29289C6.40237 9.68342 6.40237 10.3166 6.79289 10.7071L8.79289 12.7071C9.18342 13.0976 9.81658 13.0976 10.2071 12.7071L14.2071 8.70711Z"
                fill="#065F46"
              />
            </svg>
          </div>
          <div v-else class="icon fail-icon flex items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z"
                fill="#991B1B"
              />
            </svg>
          </div>
          <div class="result-message">
            {{ calculatePassOrFailMessage(student) }}
          </div>
        </div>
        <br /><br /><br />
        <div v-if="calculateCreditSubjects(student).length > 0">
          <div v-if="calculatePassOrFail(student) === 'Pass'" class="credit">
            <span
              >{{ creditSubjectCount(student) }} Subjects successfully passed
              with distinction:</span
            >
            <br /><br />
            <div class="hhh">
              <div
                v-if="calculateCreditSubjects(student).length > 0"
                class="credit-list"
              >
                <div class="credit-items">
                  <div
                    v-for="(subject, index) in calculateCreditSubjects(student)"
                    :key="subject"
                    class="credit-item"
                  >
                    <div class="credit-text">{{ subject }}</div>
                    <!-- Show SVG divider except after the last item -->
                    <div
                      v-if="index < calculateCreditSubjects(student).length - 1"
                      class="divider"
                    >
                      <svg
                        width="2"
                        height="49"
                        viewBox="0 0 2 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1 0V48.5" stroke="#A49EFF" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <span v-else>None</span>
            </div>

            <br /><br />
          </div>
        </div>
      </div>

      <!-- No results found message -->
      <div
        v-if="filteredResults.length === 0 && searchQuery"
        class="no-results"
      >
        <p>
          No results found for: <strong>{{ searchQuery }}</strong
          >.
        </p>
      </div>
    </div>
  </Navbar>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import Navbar from "../../components/NavBar.vue";
// Initialize state variables
const students = ref([]);
const results = ref([]);
const route = useRoute();
const searchQuery = computed(() => route.query.q?.trim().toLowerCase() || "");

// Fetch students from the API
async function fetchStudents() {
  try {
    const response = await axios.get("http://result.test/api/students");
    students.value = response.data.map((student) => ({
      ...student,
      major: student.major || "Unknown", // Ensure 'major' is initialized
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Fetch results from the API
async function fetchResults() {
  console.log(searchQuery);
  try {
    const response = await axios.get(
      `http://result.test/api/result?search=${searchQuery.value}`
    );
    console.log(response);
    results.value = response.data.map((result) => {
      const student = students.value.find((s) => s.roll_no === result.roll_no);
      return {
        ...result,
        major: student ? student.major : "Unknown",
      };
    });
  } catch (error) {
    console.error("Error fetching results:", error);
  }
}

// Filter results based on search query
const filteredResults = computed(() => {
  const query = searchQuery.value;
  return results.value.filter(
    (result) =>
      result.roll_no.toLowerCase().includes(query) ||
      result.student_name.toLowerCase().includes(query)
  );
});

// Function to calculate Pass/Fail
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

  for (const subject of subjects) {
    if (student[subject] < passThreshold) {
      return "Fail";
    }
  }
  return "Pass";
}

// Function to calculate credit subjects
function calculateCreditSubjects(student) {
  const credits = [];

  if (student.myanmar >= 75) credits.push("Myanmar");
  if (student.english >= 75) credits.push("English");
  if (student.mathematics >= 80) credits.push("Mathematics");
  if (student.chemistry >= 80) credits.push("Chemistry");
  if (student.physics >= 80) credits.push("Physics");

  if (student.major === "bio" && student.biological >= 75) {
    credits.push("Biological");
  } else if (student.major === "eco" && student.biological >= 75) {
    credits.push("Economical");
  }

  return credits;
}

// Function to count the number of credit subjects
function creditSubjectCount(student) {
  return calculateCreditSubjects(student).length;
}

// Function to return the appropriate message based on pass/fail status
function calculatePassOrFailMessage(student) {
  const result = calculatePassOrFail(student);
  return result === "Pass"
    ? "Congratulations! Your final exam result is Pass."
    : "Sorry! Your final exam result is Fail.";
}

// Fetch initial data when the component is mounted
onMounted(() => {
  fetchStudents();
  fetchResults();
});
</script>
<style scoped>
.results-container {
  padding: 20px;
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
  max-width: 800px;
}

/* Title styling */
.page-title {
  font-size: 2.5em;
  color: #007bff; /* Blue color for title */
}

/* Student name styling */
h2 {
  font-size: 1.5em;
  color: #333;
}

/* Result message styling */
.result-message {
  font-size: 1.2em;
}

/* Pass/Fail styling */
.pass {
  color: #28a745; /* Green color for pass */
}

.fail {
  color: #dc3545; /* Red color for fail */
}

/* Credit subjects styling */
.credit {
  background-color: rgb(247, 241, 241);
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  color: #007bff;
  /* Rounded corners for the credit section */
}

/* Credit list styling */
.credit-list {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Credit items styling */
.credit-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.credit-text {
  font-size: 1.1em;
  color: #333;
}

/* Divider styling */
.divider {
  display: flex;
  align-items: center;
}

.show {
  display: flex;
}

/* No results message styling */
.no-results {
  margin-top: 20px;
  color: #dc3545;
  font-size: 1.2em;
}
.result {
  background-color: rgb(247, 241, 241);

  display: flex;
  justify-content: center;
}
.credit-items {
  display: flex;
  justify-content: center;
  margin: 5px;
  gap: 10px;
}
.hhh {
  background-color: white; /* White background for the container */
  padding: 10px; /* Padding inside the container */
  margin-left: 10px; /* Margin on the left side */
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  border: 1px solid #ddd; /* Optional: border for visual separation */
  border-radius: 8px; /* Optional: rounded corners */
}
.con {
  display: flex;
  background-color: rgb(226, 235, 228);
  justify-content: center;
  margin-left: 25%;
  border-radius: 12px;
  width: 58%;
  padding-top: 5px;
  padding-bottom: 5px;
}
.fail-background {
  background-color: rgb(238, 185, 185);
  border-radius: 12px;
  width: 45%;
  padding: 5px;
}
</style>
