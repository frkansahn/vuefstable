<template>
    <div class="table-example">
        <div class="table-example-wrapper">
            <div>
                <h4>
                    VueFsTable Example
                </h4>
            </div>
            <vuefstable
                :items="items"
                :columns="columns"
                :loading="isLoading"
                :total="total"
                :limit.sync="limit"
                :sortKey.sync="sortKey"
                :sortAsc.sync="sortAsc"
                :page.sync="page"
                :search.sync="search"
                :checkbox="false"
                size="md"
                theme="danger"
                @update:selected="handleSelection"
                @page-change="getData"
                @per-page-change="getData"
                @sort-change="getData"
                @search-change="getData">
                <template #number="{ item }">
                    <span>{{ item.number }}</span>
                </template>

                <template #url="{ item }">
                    <a :href="item.url">{{ item.url }}</a>
                </template>

                <template #created_at="{ item }">
                    <span>{{ new Date(item.created_at).toLocaleDateString() }}</span>
                </template>

                <template #actions="{ item }">
                    <button @click="editUser(item)" class="action-btn">
                        <i class="fas fa-xs fa-edit"></i>
                    </button>
                    <button @click="deleteUser(item)" class="action-btn danger">
                        <i class="fas fa-xs fa-trash"></i>
                    </button>
                </template>
            </vuefstable>
        </div>
    </div>
</template>

<script>
import vuefstable from "../src/components/vuefstable.vue";
export default {
    components: {
        vuefstable
    },
    data() {
        return {
            isLoading: true,
            items: [],
            selected: [],
            page: 1,
            limit: 10,
            total: 0,
            search: '',
            sortKey: '',
            sortAsc: '',
            columns: [
                { key: 'number', label: 'Numara', sort: true },
                { key: 'user.type', label: 'Tip', sort: true },
                { key: 'url', label: 'Link', sort: true },
                { key: 'created_at', label: 'Tarih', sort: true },
                { key: 'actions', label: 'İşlemler', sort: false }
            ]
        }
    },
    created() {
        this.getData();
    },
    methods: {
        editUser(data) {
            alert(`${data.number} düzenleniyor...`)
        },
        deleteUser(data) {
            if (confirm(`${data.number} silinsin mi?`)) {
                this.items = this.items.filter(u => u !== data)
            }
        },
        handleSelection(selectedItems) {
            this.selected = selectedItems
        },
        async getData() {
            this.isLoading = true;
            try {
                const res = await fetch(`https://api.github.com/repos/vuejs/vue/issues?per_page=${this.limit}&page=${this.page}&search=${this.search}&sortKey=${this.sortKey}&sortAsc=${this.sortAsc}`);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

                const data = await res.json();
                this.items = data;
                this.total = 1000; //Burası servisten dönecek response ile beslenecektir.
            } catch (err) {
                console.error('Veri alınamadı:', err);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
a {
    text-decoration: none;
    color: #000;
}

.table-example {
    width: 100%;
    float: left;
    display: flex;
    justify-content: center;
    font-family: sans-serif;
}

.table-example-wrapper {
    width: 100%;
    max-width: 1000px;
    float: left;
}

.action-btn {
    margin-right: 8px;
    padding: 4px 8px;
    font-size: 13px;
    border: none;
    background-color: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
    color: #5f5f5f;
}

.action-btn.danger {
    background-color: #ffdddd;
    color: rgb(214, 24, 24);
}
</style>
