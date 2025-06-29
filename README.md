# 📊 vuefstable

Vue 2 / Nuxt 2 uyumlu, sade ve özelleştirilebilir tablo bileşeni.  
Arama · Sıralama · Sayfalama · Çoklu Seçim · Yükleniyor Durumu

---

## 🚀 Kurulum

```bash
npm install vuefstable

---

## Plugin Oluştur (plugins/vuefstable.js)

```bash
import Vue from 'vue'
import VueFsTablePlugin from 'vuefstable'

Vue.use(VueFsTablePlugin)

```

---

## nuxt.config.js içine ekleme

```bash
export default {
  plugins: ['~/plugins/vuefstable.js']
}
```


---


## ⚙️ Temel Kullanım

```bash

<template>
    <div>
        <vue-fs-table :items="users" :columns="columns" :loading="isLoading" :per-page="5"
            @update:selected="handleSelection">
            <!-- Ad sütununu özelleştiriyoruz -->
            <template #name="{ item }">
                <strong style="color: #007bff">{{ item.name }}</strong>
            </template>

            <!-- İşlem butonları -->
            <template #actions="{ item }">
                <button @click="editUser(item)" class="action-btn">✏️ Düzenle</button>
                <button @click="deleteUser(item)" class="action-btn danger">🗑️ Sil</button>
            </template>
        </vue-fs-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLoading: true,
            users: [],
            selected: [],
            columns: [
                { key: 'name', label: 'Ad' },
                { key: 'email', label: 'E-posta' },
                { key: 'role', label: 'Rol' },
                { key: 'actions', label: 'İşlemler' }
            ]
        }
    },
    created() {
        setTimeout(() => {
            this.users = [
                { name: 'Ali Veli', email: 'ali@example.com', role: 'Admin' },
                { name: 'Ayşe Demir', email: 'ayse@example.com', role: 'Kullanıcı' },
                { name: 'Mehmet Can', email: 'mehmet@example.com', role: 'Editör' },
                { name: 'Zeynep Kaya', email: 'zeynep@example.com', role: 'Admin' },
                { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Kullanıcı' },
                { name: 'Elif Güneş', email: 'elif@example.com', role: 'Editör' }
            ]
            this.isLoading = false
        }, 1000)
    },
    methods: {
        editUser(user) {
            alert(`${user.name} düzenleniyor...`)
        },
        deleteUser(user) {
            if (confirm(`${user.name} silinsin mi?`)) {
                this.users = this.users.filter(u => u !== user)
            }
        },
        handleSelection(selectedItems) {
            this.selected = selectedItems
        }
    }
}
</script>

<style scoped>
  .action-btn {
      margin-right: 8px;
      padding: 4px 8px;
      font-size: 13px;
      border: none;
      background-color: #f0f0f0;
      border-radius: 4px;
      cursor: pointer;
  }

  .action-btn.danger {
      background-color: #ffdddd;
      color: #c00;
  }
</style>


```

---

## 🎛 Özellikler

🔍 Arama (Search)

🔃 Sıralama (Sortable)

📄 Sayfalama (Pagination)

⏳ Yükleniyor Durumu

☑️ Çoklu Seçim (Checkbox)

🧩 Slot ile Hücre Özelleştirme


---


## 🔧 Props

| Prop      | Açıklama                  | Tip     | Zorunlu |
| --------- | ------------------------- | ------- | ------- |
| `items`   | Gösterilecek veri listesi | Array   | ✅       |
| `columns` | Kolon tanımları           | Array   | ✅       |
| `loading` | Yükleniyor durumu         | Boolean | ❌       |
| `perPage` | Sayfa başına kayıt sayısı | Number  | ❌       |
