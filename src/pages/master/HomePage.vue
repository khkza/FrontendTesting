<template>
  <Navbar>
    <div class="container">
      <div class="px-[10%] text-green-200 text-center">
        <h1 class="text-3xl text-blue-400 font-serif mb-15">
          Check your exam result<br />
          <span class="text-4xl text-blue-600"> with one click</span>
        </h1>
      </div>
      <!-- Form Container -->
      <div class="search-bar flex gap-2 px-2 py-1 w-[400px]">
        <input
          type="text"
          v-model="searchQuery"
          id="search-query"
          class="search-input"
          placeholder="Enter Roll No or Name"
          aria-label="Search by Roll No or Name"
        />
        <button @click="search" class="search-button" aria-label="Search">
          Search
        </button>
      </div>
      <p class="text-center text-md">Please enter your roll number</p>
    </div>
  </Navbar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../../components/NavBar.vue";
const searchQuery = ref("");
const router = useRouter();

function search() {
  if (searchQuery.value.trim()) {
    router.push({ name: "resultlist", query: { q: searchQuery.value } });
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.search-bar {
  background: rgb(250, 248, 248);
  margin: 20px auto;
  margin-top: 10rem;
  height: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.search-input {
  background-color: white;
  margin-right: 5px;
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
  flex-grow: 1;
}

.search-button {
  background-color: blue;
  border: none;
  color: white;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.results table {
  width: 100%;
  border-collapse: collapse;
}

.results th,
.results td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
}

.results th {
  background-color: #2e60b0;
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

.pagination-button {
  padding: 6px 12px;
  margin: 0 4px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.no-results {
  margin-top: 20px;
  width: 100%;
  padding: 15px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  border-radius: 4px;
}

.textColor {
  background: linear-gradient(to right, #2e60b0 0%, #5449cf 33%, #a4a8d8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h1 {
  margin-bottom: 5rem;
  margin-top: 10rem;
}

p {
  margin-bottom: 5rem;
}

a {
  transition: background-color 0.3s, color 0.3s;
}

a:hover {
  background-color: #4f46e5;
}

a:focus {
  outline: 2px solid #4f46e5;
}
</style>
