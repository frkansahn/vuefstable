# Changelog

Tüm önemli değişiklikler bu dosyada belgelenir.

---

## [1.0.4] - 2025-07-01

### 🚀 Eklendi
- Yeni tema sistemi: `classic`, `dark`, `striped`, `modern`, `material`, `danger`, `warning`, `borderless`.
- `size` prop'u ile tablo boyutu kontrolü eklendi (`sm`, `md`, `lg`, `xl`).
- `search`, `page`, `limit`, `sortKey`, `sortAsc` prop'ları dışarıdan kontrol edilebilir hale getirildi.
- Debounce destekli arama özelliği eklendi (500ms).
- Otomatik per-page liste kontrolü ve sıralaması eklendi.
- Seçim kutusu (checkbox) özelliği eklendi.
- Sayfa başına kayıt sayısı (`perPages`) özelleştirilebilir hale getirildi.
- FontAwesome simge desteği eklendi.
- Slot üzerinden her hücre özelleştirilebilir hale getirildi.
- Geliştirici dostu pagination kontrolü (total üzerinden sayfa hesaplama).
- `@page-change`, `@search-change`, `@per-page-change`, `@sort-change` ve `@update:selected` gibi tüm etkileşimler için emit desteği sağlandı.

### 🛠️ Değiştirildi
- Pagination görünümü baştan tasarlandı, UX artırıldı.
- Sort ikonları FontAwesome ile gösterilecek şekilde yenilendi.
- Arama input'u ve perPage select daha şık görsellerle güncellendi (theme'lere göre uyumlu hale getirildi).

### 🐛 Düzeltildi
- `user.type` gibi nested key'lerin gösterilememesi sorunu çözüldü.
- `perPages.sort()` yanlış sıralama algoritması düzeltildi.
- `search` prop'unun mutate edilme hatası yerine `v-model` uyumlu yapı getirildi.

---

> Bu, Vue 2 & Nuxt 2 uyumlu `vuefstable` bileşeninin ilk kararlı sürümüdür. Artık açık kaynak olarak kullanılabilir.
