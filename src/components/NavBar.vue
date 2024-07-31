<template>
  <div
    class="flex justify-between items-center py-4 sticky top-0 border element-style"
  >
    <div class="flex items-center justify-center ms-5">
      <!-- <img src="/Users/za/Documents/code/vue-exercises/vue-stater/src/image/education.png" alt="" class="w-[40px] me-2"> -->
    </div>
    <nav>
      <ul>
        <!-- <li>
            <router-link to="/" class="nav-link">
              <i class="fas fa-home"></i> Home
            </router-link>
          </li> -->
        <li>
          <router-link to="/" class="nav-link">
            <i class="fas fa-users"></i> Home
          </router-link>
        </li>
        <!-- <li>
            <router-link to="/result" class="nav-link">
              <i class="fas fa-poll"></i> Result List
            </router-link>
          </li> -->
        <!-- <li>
            <router-link to="/main" class="nav-link">
              <i class="fas fa-chart-line"></i> Show Result
            </router-link>
          </li> -->
        <li>
          <router-link
            to="/region"
            class="nav-link"
            :class="{ 'router-link-active': $route.path === '/region' }"
          >
            <i class="fas fa-chart-line"></i> Region List
          </router-link>
        </li>
        <li>
          <router-link
            to="/township"
            class="nav-link"
            :class="{ 'router-link-active': $route.path === '/township' }"
          >
            <i class="fas fa-chart-line"></i> Township List
          </router-link>
        </li>
        <!-- <li>
            <router-link to="/select" class="nav-link">
              <i class="fas fa-chart-line"></i> Select
            </router-link>
          </li> -->
        <li>
          <router-link to="/contact" class="nav-link">
            <i class="fas fa-chart-line"></i> About
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
  <slot></slot>
</template>

<script>
export default {
  name: "App",
  // Your data and methods go here
};
</script>

<style scoped>
/* Scoped styles for this component */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #bb7a7a; /* Light grey background for the whole app */
}

header {
  background-color: #0c466d; /* Primary color for header */
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
.element-style {
  background-color: white;
  justify-content: center;
  height: 100%;
}
nav li {
  margin-right: 10px;
}

.nav-link {
  color: blue;
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
  background-color: #631f51;
}

aside {
  background-color: #2e21e6; /* White background for sidebar */
  padding: 20px;
  border-left: 1px solid #ccc;
  width: 250px;
}

.sidebar {
  background-color: #0636a5; /* Light grey background for sidebar widgets */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Shadow effect */
}

h2 {
  margin-bottom: 10px;
  color: #db3442; /* Primary color for headings */
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
</style>
