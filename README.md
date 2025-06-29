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
  <vuefstable :columns="columns" :items="users" :loading="isLoading">
    <template #actions="{ item }">
      <button @click="edit(item)">Düzenle</button>
    </template>
  </vuefstable>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      columns: [
        { key: 'name', label: 'Ad' },
        { key: 'email', label: 'E-posta' },
        { key: 'actions', label: 'İşlemler' }
      ],
      users: [
        { name: 'Ali', email: 'ali@example.com' },
        { name: 'Ayşe', email: 'ayse@example.com' }
      ]
    }
  },
  methods: {
    edit(user) {
      alert(`${user.name} düzenleniyor`)
    }
  }
}
</script>

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
