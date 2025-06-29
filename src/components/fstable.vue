<template>
    <div class="vuefstable-wrapper">
        <input v-model="internalSearch" placeholder="Ara..." class="table-search" />
        <table>
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                    </th>
                    <th v-for="col in columns" :key="col.key" @click="sortBy(col.key)">
                        {{ col.label }}
                        <span v-if="sortKey === col.key">{{ sortAsc ? '▲' : '▼' }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td :colspan="columns.length + 1" class="loading-row">Yükleniyor...</td>
                </tr>
                <tr v-else v-for="(item, rowIndex) in pagedItems" :key="rowIndex">
                    <td>
                        <input type="checkbox" :checked="selectedItems.includes(item)"
                            @change="toggleSelection(item)" />
                    </td>
                    <td v-for="col in columns" :key="col.key">
                        <slot :name="col.key" :item="item">
                            {{ item[col.key] }}
                        </slot>
                    </td>
                </tr>
                <tr v-if="!loading && pagedItems.length === 0">
                    <td :colspan="columns.length + 1" class="empty-row">Kayıt bulunamadı.</td>
                </tr>
            </tbody>
        </table>
        <div class="pagination" v-if="totalPages > 1">
            <button v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }"
                @click="changePage(page)">
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VueFsTable',
    props: {
        items: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        perPage: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            internalSearch: '',
            sortKey: null,
            sortAsc: true,
            currentPage: 1,
            selectedItems: []
        }
    },
    computed: {
        filteredItems() {
            if (!this.internalSearch) return this.items
            return this.items.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(this.internalSearch.toLowerCase())
                )
            )
        },
        sortedItems() {
            const items = [...this.filteredItems]
            if (!this.sortKey) return items
            return items.sort((a, b) => {
                const x = a[this.sortKey]
                const y = b[this.sortKey]
                return this.sortAsc ? (x > y ? 1 : -1) : (x < y ? 1 : -1)
            })
        },
        pagedItems() {
            const start = (this.currentPage - 1) * this.perPage
            return this.sortedItems.slice(start, start + this.perPage)
        },
        totalPages() {
            return Math.ceil(this.sortedItems.length / this.perPage)
        },
        allSelected() {
            return (
                this.pagedItems.length > 0 &&
                this.pagedItems.every(item => this.selectedItems.includes(item))
            )
        }
    },
    methods: {
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortAsc = !this.sortAsc
            } else {
                this.sortKey = key
                this.sortAsc = true
            }
        },
        changePage(page) {
            this.currentPage = page
        },
        toggleSelection(item) {
            const index = this.selectedItems.indexOf(item)
            if (index > -1) this.selectedItems.splice(index, 1)
            else this.selectedItems.push(item)
            this.$emit('update:selected', this.selectedItems)
        },
        toggleAll() {
            const allVisible = this.pagedItems
            if (this.allSelected) {
                this.selectedItems = this.selectedItems.filter(i => !allVisible.includes(i))
            } else {
                const newSelection = allVisible.filter(i => !this.selectedItems.includes(i))
                this.selectedItems = [...this.selectedItems, ...newSelection]
            }
            this.$emit('update:selected', this.selectedItems)
        }
    }
}
</script>

<style scoped>
.vuefstable-wrapper {
    width: 100%;
    font-family: 'Segoe UI', sans-serif;
}

.table-search {
    margin-bottom: 12px;
    padding: 8px 12px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    overflow: hidden;
}

thead {
    background-color: #f9f9f9;
}

th,
td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
}

th {
    font-weight: bold;
    color: #333;
    user-select: none;
}

tr:hover {
    background-color: #f6f6f6;
}

.loading-row,
.empty-row {
    text-align: center;
    padding: 20px;
    color: #999;
}

.pagination {
    margin-top: 12px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.pagination button {
    padding: 6px 12px;
    border: none;
    background: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button.active {
    background: #007bff;
    color: white;
}
</style>
