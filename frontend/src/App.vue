<template>
  <div>
    <h1>Daftar Mahasiswa</h1>

    <!-- Form Tambah Mahasiswa -->
    <form @submit.prevent="addMahasiswa">
      <input
        type="text"
        v-model="newMahasiswa.nama"
        placeholder="Nama Mahasiswa"
        class="input-field"
      />
      <button type="submit" class="btn btn-add">Tambah</button>
    </form>

    <!-- Tabel Data Mahasiswa -->
    <table class="data-table">
      <thead>
        <tr>
          <th>NIM</th>
          <th>Nama Mahasiswa</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mahasiswa in mahasiswaList" :key="mahasiswa.nim">
          <!-- Tampilkan NIM asli -->
          <td>{{ mahasiswa.nim }}</td>
          <!-- Tampilkan nama atau input untuk edit -->
          <td>
            <span v-if="editId !== mahasiswa.nim">{{ mahasiswa.nama }}</span>
            <input v-else type="text" v-model="editName" class="input-field" />
          </td>
          <td>
            <!-- Tombol Edit/Save -->
            <button
              v-if="editId !== mahasiswa.nim"
              @click="startEdit(mahasiswa)"
              class="btn btn-edit"
            >
              Edit
            </button>
            <button v-else @click="confirmEdit(mahasiswa)" class="btn btn-save">
              Save
            </button>
            <!-- Tombol Hapus -->
            <button
              @click="deleteMahasiswa(mahasiswa.nim)"
              class="btn btn-delete"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mahasiswaList: [], // Data mahasiswa dari API
      newMahasiswa: { nama: "" }, // Data mahasiswa baru
      editId: null, // ID mahasiswa yang sedang diedit
      editName: "", // Nama mahasiswa yang sedang diedit
    };
  },
  methods: {
    // Ambil data mahasiswa dari API
    fetchMahasiswa() {
      axios
        .get("http://localhost:8000/api/mahasiswa")
        .then((response) => {
          this.mahasiswaList = response.data.sort((a, b) => a.nim - b.nim); // Urutkan NIM naik
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    // Tambah mahasiswa baru
    addMahasiswa() {
      axios
        .post("http://localhost:8000/api/mahasiswa", this.newMahasiswa)
        .then(() => {
          this.newMahasiswa.nama = ""; // Reset input
          this.fetchMahasiswa(); // Refresh data
        })
        .catch((error) => {
          console.error("Error adding mahasiswa:", error);
        });
    },
    // Mulai proses edit
    startEdit(mahasiswa) {
      this.editId = mahasiswa.nim;
      this.editName = mahasiswa.nama;
    },
    // Simpan hasil edit
    confirmEdit(mahasiswa) {
      axios
        .put(`http://localhost:8000/api/mahasiswa/${mahasiswa.nim}`, {
          nama: this.editName,
        })
        .then(() => {
          this.editId = null; // Reset edit mode
          this.editName = ""; // Reset input
          this.fetchMahasiswa(); // Refresh data
        })
        .catch((error) => {
          console.error("Error editing mahasiswa:", error);
        });
    },
    // Hapus mahasiswa berdasarkan NIM
    deleteMahasiswa(nim) {
      axios
        .delete(`http://localhost:8000/api/mahasiswa/${nim}`)
        .then(() => {
          this.fetchMahasiswa(); // Refresh data
        })
        .catch((error) => {
          console.error("Error deleting mahasiswa:", error);
        });
    },
  },
  mounted() {
    this.fetchMahasiswa(); // Ambil data saat aplikasi dimuat
  },
};
</script>

<style>
/* Styling sederhana untuk UI */
body {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-container {
  margin-bottom: 20px;
  text-align: center;
}

.input-field {
  padding: 10px;
  margin-right: 10px;
  width: 300px;
}

.btn {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add {
  background-color: #4caf50;
  color: white;
}

.btn-edit {
  background-color: #ffc107;
  color: white;
}

.btn-save {
  background-color: #007bff;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
  text-align: left;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.data-table th {
  background-color: #484848;
  text-align: center;
}
</style>
