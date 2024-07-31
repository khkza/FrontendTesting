<template>
  <Navbar>
    <div class="w-full">
      <h2 class="text-3xl font-extrabold text-blue-600 text-center pt-20">
        About
      </h2>
      <p class="my-4 text-lg text-gray-500 text-center">
        Our goal with this system is to enhance transparency, efficiency, and
        accountability in managing student academic records.<br />
        We believe it will empower educators and administrators alike to make
        informed decisions and provide targeted support to students based on
        their academic needs.
      </p>

      <!-- Main Section -->
      <main class="flex-grow">
        <section id="welcome" class="welcome">
          <div class="container aos-init aos-animate" data-aos="fade-up">
            <div class="section-title titel-bottom-line">
              <h1 class="text-center text-3xl text-blue-600 font-extrabold">
                Contact Information
              </h1>
              <br /><br />
            </div>
            <div class="form-detail">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Left Column -->
                <div
                  class="contact-info-box-content bg-gray-200 rounded shadow-md px-12 py-10"
                >
                  <h2 class="company-name-head font-bold mb-4 text-lg">
                    Za Information Technology Co.,Ltd.
                  </h2>
                  <div class="contact_info">
                    <i class="fa fa-map-marker">Address : </i>132, 7th Floor,
                    Anawrahta Road, Botahtaung Tsp, YANGON.
                  </div>
                  <div class="contact_info">
                    <i class="fa fa-envelope">Mail : </i
                    ><a href="contact@@za.com.mm">contact@za.com</a>
                  </div>
                  <div class="contact_info">
                    <i class="fa fa-envelope">Technical Support : </i
                    ><a href="mailto:techsupport@geniusedusoft.com"
                      >techsupport@geniusedusoft.com</a
                    >
                  </div>
                </div>
                <!-- Right Column -->
                <div
                  class="contact-info-box-content bg-gray-200 rounded shadow-md px-12 py-10"
                >
                  <div class="contact_info">
                    <span class="phone-titel">Cell :</span> +91 -93270 01952
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer Section -->
      <footer class="">
        <div class="container flex justify-center items-center py-4 mt-10">
          Copyright © 2024
          <a
            href="https://www.education.com/"
            title=" Education Management System"
          ></a>
          All Rights Reserved.
        </div>
      </footer>
    </div>
  </Navbar>
</template>

<script setup>
import Navbar from "../../components/NavBar.vue";
</script>

<style scoped>
/* Scoped styles */
.text-2xl {
  font-size: 1.875rem; /* 30px */
}

/* Example background color */
.bg-red-200 {
  background-color: #fca5a5;
  font-size: 20px; /* Red-200 */
}
.text-center {
  text-align: center;
}

.text-red-600 {
  color: #dc2626; /* Adjust the color code as needed */
}

main {
  padding: 7rem 0; /* Example padding */
}

footer {
  margin-top: 12rem; /* Adjust the distance between main and footer */
}

header,
main,
footer {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center contents vertically */
  align-items: center; /* Center contents horizontally */
}

/* Additional styles can be added as per your design needs */
</style>
