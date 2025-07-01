<template>
    <div class="vuefstable-wrapper" :class="[`size-${size}`, `theme-${theme}`]">
        <div class="vuefstable-header">
            <select class="perpages" v-model="fsPerPage" @change="onPerPageChange">
                <option v-for="(pp, index) in perPages" :value="pp">{{ pp }}</option>
            </select>
            <input v-model="internalSearch" @input="onSearchChange" placeholder="Ara..." class="table-search" />
        </div>
        <div class="vuefstable-content">
            <table>
                <thead>
                    <tr>
                        <th v-if="checkbox">
                            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                        </th>
                        <th v-for="col in columns" :key="col.key" :class="{ sortable: col.sort }"
                            @click="col.sort && sortBy(col.key)">
                            <span class="label">
                                {{ col.label }}
                            </span>
                            <span v-if="fsSortKey === col.key">
                                <i v-if="fsSortAsc == 'asc'" class="fas fa-xs fa-arrow-up"></i>
                                <i v-else class="fas fa-xs fa-arrow-down"></i>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td :colspan="columns.length + 1" class="loading-row">Yükleniyor...</td>
                    </tr>
                    <tr v-else v-for="(item, rowIndex) in items" :key="rowIndex">
                        <td v-if="checkbox">
                            <input type="checkbox" :checked="selectedItems.includes(item)"
                                @change="toggleSelection(item)" />
                        </td>
                        <td v-for="col in columns" :key="col.key">
                            <slot :name="col.key" :item="item">
                                {{ getValueByPath(item, col.key) }}
                            </slot>
                        </td>
                    </tr>
                    <tr v-if="!loading && items.length === 0">
                        <td :colspan="columns.length + 1" class="empty-row">Kayıt bulunamadı.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="vuefstable-footer">
            <div class="vuefstable-selected" v-if="checkbox">
                {{ selectedItems?.length || 0 }} seçim
            </div>
            <div class="pagination" v-if="totalPages > 1">
                <button @click="changePage(1)" :disabled="currentPage === 1">
                    <i class="fas fa-angle-double-left"></i>
                </button>
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="fas fa-angle-left"></i>
                </button>

                <button v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }"
                    @click="changePage(page)" v-if="page !== '...'">
                    {{ page }}
                </button>
                <span v-else class="ellipsis">...</span>

                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="fas fa-angle-right"></i>
                </button>
                <button @click="changePage(totalPages)" :disabled="currentPage === totalPages">
                    <i class="fas fa-angle-double-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'
export default {
    name: 'vuefstable',
    props: {
        items: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        total: {
            type: Number,
            default: null // null ise local pagination, doluysa dışarıdan kontrol
        },
        loading: {
            type: Boolean,
            default: false
        },
        search: {
            type: String,
            default: null
        },
        checkbox: {
            type: Boolean,
            default: false
        },
        page: {
            type: Number,
            default: 1
        },
        limit: {
            type: Number,
            default: 10
        },
        sortKey: {
            type: String,
            default: null
        },
        sortAsc: {
            type: String,
            default: null
        },
        perPages: {
            type: Array,
            default: () => [10, 25, 50, 100]
        },
        size: {
            type: String,
            default: 'md' // sm-md-lg-xl
        },
        lang: {
            type: String,
            default: 'tr'
        },
        theme: {
            type: String,
            default: 'classic' // örnek: 'classic', 'borderless', 'striped', 'dark', 'danger', 'warning', 'modern', 'material'
        }
    },
    data() {
        return {
            fsSortKey: this.sortKey,
            fsSortAsc: this.sortAsc,
            currentPage: 1,
            selectedItems: [],
            fsPerPage: 10,
            internalSearch: '',
            searchDebounceTimer: null,
        }
    },
    watch: {
        search: {
            immediate: true,
            handler(val) {
                this.internalSearch = val
            }
        },
        internalSearch(val) {
            this.$emit('update:search', val)
        },
        limit: {
            immediate: true,
            handler(val) {
                this.fsPerPage = val
            }
        }
    },
    computed: {
        totalPages() {
            const total = this.total !== null ? this.total : this.sortedItems.length
            return Math.ceil(total / this.fsPerPage)
        },
        allSelected() {
            return (
                this.items.length > 0 &&
                this.items.every(item => this.selectedItems.includes(item))
            )
        },
        visiblePages() {
            const pages = []
            const total = this.totalPages
            const current = this.currentPage

            if (total <= 7) {
                for (let i = 1; i <= total; i++) pages.push(i)
            } else {
                pages.push(1)
                if (current > 4) pages.push('...')
                const start = Math.max(2, current - 1)
                const end = Math.min(total - 1, current + 1)
                for (let i = start; i <= end; i++) pages.push(i)
                if (current < total - 3) pages.push('...')
                pages.push(total)
            }

            return pages
        }
    },
    methods: {
        sortBy(key) {
            if (this.fsSortKey === key) {
                this.fsSortAsc = this.sortAsc == 'asc' ? 'desc' : 'asc' 
            } else {
                this.fsSortKey = key
                this.fsSortAsc = 'asc'
            }

            this.$emit('update:sortKey', this.fsSortKey)
            this.$emit('update:sortAsc', this.fsSortAsc)
            this.$emit('sort-change')
        },
        getValueByPath(obj, path) {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj)
        },
        changePage(page) {
            this.currentPage = page;
            this.$emit('update:page', page)
            this.$emit('page-change')
        },
        onPerPageChange() {
            this.currentPage = 1;
            this.$emit('update:limit', this.fsPerPage)
            this.$emit('per-page-change');
        },
        onSearchChange() {
            if (this.searchDebounceTimer) {
                clearTimeout(this.searchDebounceTimer)
            }
            this.searchDebounceTimer = setTimeout(() => {
                this.$emit('search-change')
            }, 500)
        },
        toggleSelection(item) {
            const index = this.selectedItems.indexOf(item)
            if (index > -1) this.selectedItems.splice(index, 1)
            else this.selectedItems.push(item)
            this.$emit('update:selected', this.selectedItems)
        },
        toggleAll() {
            const allVisible = this.items;
            if (this.allSelected) {
                this.selectedItems = this.selectedItems.filter(i => !allVisible.includes(i))
            } else {
                const newSelection = allVisible.filter(i => !this.selectedItems.includes(i))
                this.selectedItems = [...this.selectedItems, ...newSelection]
            }
            this.$emit('update:selected', this.selectedItems)
        }
    },
    mounted() {
        if (this.perPages?.length > 0) {
            if (!this.perPages.includes(this.fsPerPage)) {
                this.perPages.push(this.fsPerPage);
                this.perPages.sort((a, b) => a - b)
            }
        }
    }
}
</script>

<style scoped>
.vuefstable-wrapper {
    width: 100%;
    float: left;
    font-family: 'Segoe UI', sans-serif;
    color: #000;
    line-height: normal;
    font-weight: normal;
    font-size: 12px;
}

.vuefstable-wrapper.size-sm table th, .vuefstable-wrapper.size-sm table td {
    font-size: 12px;
    padding: 10px 14px;
}

.vuefstable-wrapper.size-sm .pagination button {
    padding: 4px 10px;
    font-size: 12px;
}

.vuefstable-wrapper.size-lg table th, .vuefstable-wrapper.size-lg table td {
    font-size: 16px;
    padding: 14px 18px;
}

.vuefstable-wrapper.size-lg .pagination button {
    padding: 8px 14px;
    font-size: 16px;
}

.vuefstable-wrapper.size-xl table th, .vuefstable-wrapper.size-xl table td {
    font-size: 18px;
    padding: 16px 20px;
}

.vuefstable-wrapper.size-xl .pagination button {
    padding: 10px 16px;
    font-size: 18px;
}

.vuefstable-header {
    float: left;
    width: 100%;
}

.vuefstable-content {
    float: left;
    width: 100%;
    overflow-x: auto;
}

.vuefstable-footer {
    display: flex;
    flex-direction: column;
    float: left;
    width: 100%;
}

.vuefstable-selected {
    float: left;
    width: 100%;
    text-align: right;
    margin-top: 10px;
}

.perpages {
    float: right;
    margin-left: 5px;
    margin-bottom: 12px;
    padding: 0px 4px;
    max-width: 50px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 32px;
    outline: none;
}

.table-search {
    margin-bottom: 12px;
    padding: 0px 10px;
    width: 100%;
    max-width: 150px;
    border: 1px solid #ddd;
    border-radius: 4px;
    float: right;
    height: 30px;
    outline: none;
}

.loading-row,
.empty-row {
    text-align: center;
    padding: 20px;
    color: #999;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    flex-wrap: wrap;
}

.pagination button {
    padding: 6px 12px;
    border: 1px solid #bbbbbb;
    background: #f5f5f5;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
}

.pagination button:hover {
    background: #e0e0e0;
}

.pagination button.active {
    background: #333;
    color: #fff;
    font-weight: bold;
}

.pagination button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.pagination .ellipsis {
    padding: 6px 10px;
    color: #999;
}



table {
    width: 100%;
    overflow: hidden;
}

thead {
    background-color: #f9f9f9;
}

th,
td {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
}

th {
    font-weight: bold;
    color: #333;
    user-select: none;
}

th.sortable:hover {
    background-color: #f0f8ff;
    text-decoration: underline;
    cursor: pointer;
}

table tbody tr:hover {
    background-color: #f6f6f6;
}


.theme-classic table {
    border: 1px solid #eee;
}

.theme-classic table th, .theme-classic table td {
    border: 1px solid #eee;
}


.theme-borderless table, .theme-borderless th, .theme-borderless td {
    border: none !important;
}


.theme-striped tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
}


.theme-dark {
    background-color: #000;
    color: #eee;
    padding: 1em;
    border-radius: 5px;
}

.theme-dark table, .theme-dark thead, .theme-dark tbody {
    background-color: #000;
}

.theme-dark table {
    border-top: 1px solid #545454;
}


.theme-dark th,
.theme-dark th *,
.theme-dark td,
.theme-dark td span,
.theme-dark td a,
.theme-dark td p {
    color: #fff;
}

.theme-dark table tbody tr:hover td,
.theme-dark table tbody tr:hover td span,
.theme-dark table tbody tr:hover td a,
.theme-dark table tbody tr:hover td p {
    color: #000000;
}

.theme-dark th.sortable:hover {
    background-color: #202020;
    text-decoration: underline;
    cursor: pointer;
}
 
.theme-dark .pagination button {
    background: #444;
    color: #fff;
    border-color: #666;
}

.theme-dark .pagination button:not([disabled="disabled"]):hover {
    background: #e0e0e0;
    color: #000;
}



.theme-danger {
    background-color: #ffb3b3;
    color: #000000;
    padding: 1em;
    border-radius: 5px;
}

.theme-danger table, .theme-danger thead, .theme-danger tbody {
    background-color: #ffb3b3;
}

.theme-danger table {
    border-top: 1px solid #545454;
}


.theme-danger th,
.theme-danger th *,
.theme-danger td,
.theme-danger td span,
.theme-danger td a,
.theme-danger td p {
    color: #000000;
}

.theme-danger table tbody tr:hover td,
.theme-danger table tbody tr:hover td span,
.theme-danger table tbody tr:hover td a,
.theme-danger table tbody tr:hover td p {
    background-color: #fc6666;
    color: #ffffff;
}

.theme-danger th.sortable:hover {
    background-color: #ffb3b3;
    text-decoration: underline;
    cursor: pointer;
}
 
.theme-danger .pagination button {
    background: #000;
    color: #ffffff;
    border-color: rgb(148, 148, 148);
}

.theme-danger .pagination button:not([disabled="disabled"]):hover {
    background: #000000;
    color: #ffb3b3;
}



.theme-warning {
    background-color: #fff9c7;
    color: #eee;
    padding: 1em;
    border-radius: 5px;
}

.theme-warning table, .theme-warning thead, .theme-warning tbody {
    background-color: #fff9c7;
}

.theme-warning table {
    border-top: 1px solid #545454;
}


.theme-warning th,
.theme-warning th *,
.theme-warning td,
.theme-warning td span,
.theme-warning td a,
.theme-warning td p {
    color: #000000;
}

.theme-warning table tbody tr:hover td,
.theme-warning table tbody tr:hover td span,
.theme-warning table tbody tr:hover td a,
.theme-warning table tbody tr:hover td p {
    background-color: #f1e9a0;
    color: #000000;
}

.theme-warning th.sortable:hover {
    background-color: #fff9c7;
    text-decoration: underline;
    cursor: pointer;
}
 
.theme-warning .pagination button {
    background: #000;
    color: #fff;
    border-color: rgb(148, 148, 148);
}

.theme-warning .pagination button:not([disabled="disabled"]):hover {
    background: #e0e0e0;
    color: #fff9c7;
}


.theme-modern .vuefstable-content {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.theme-modern .table-search,.theme-modern .perpages {
    box-shadow: 0px 0px 6px -4px #000;
    transition: all .5s ease;
}

.theme-modern .table-search:hover,.theme-modern .perpages:hover {
    transition: all .5s ease;
    transform: translateY(-5px);
}

.theme-modern thead {
    background: #fafafa;
    border-bottom: 1px solid #eaeaea;
}

.theme-modern th {
    color: #2e2e2e;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.theme-modern td {
    color: #444;
}

.theme-modern table tbody tr:hover {
    background-color: #f2f2f2;
}

.theme-modern .pagination button.active {
    background-color: #2196f3;
    color: white;
    border-color: #2196f3;
}

.theme-modern .pagination {
    transition: all .5s ease;
}

.theme-modern .pagination:hover {
    transition: all .5s ease;
    transform: translateY(-5px);
}


.theme-material table {
    border-collapse: separate;
    border-spacing: 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
}

.theme-material thead {
    background-color: #3f51b5;
    color: white;
}

.theme-material th {
    font-weight: 500;
    color: #fff;
}

.theme-material th.sortable:hover {
    background-color: #d6ddff;
    color: #000;
}

.theme-material td {
    border-bottom: 1px solid #eee;
}

.theme-material tr:last-child td {
    border-bottom: none;
}

.theme-material table tbody tr:hover {
    background-color: #f5f5f5;
}

.theme-material .pagination button.active {
    background-color: #3f51b5;
    color: #fff;
    border-color: #3f51b5;
}

</style>
