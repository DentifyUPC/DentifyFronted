import { defineStore } from 'pinia';
import { itemsRepositoryImpl } from '../data/repositories/itemRepositoryImpl.js';

export const useItemsStore = defineStore('items', {
    state: () => ({
        items: [],
        filtered: [],
        isLoading: false,
        error: null,
        query: '',
    }),

    getters: {
        count: (state) => state.items.length,
    },

    actions: {
        async fetchAll() {
            try {
                this.isLoading = true;
                this.error = null;
                const items = await itemsRepositoryImpl.getAll();
                this.items = items;
                this.applyFilter();
            } catch (err) {
                this.error = err.response?.data || err.message || String(err);
                console.error('Error en fetchAll items store:', err);
            } finally {
                this.isLoading = false;
            }
        },

        setQuery(q) {
            this.query = q ?? '';
            this.applyFilter();
        },

        applyFilter() {
            if (!this.query || this.query.trim() === '') {
                this.filtered = [...this.items];
                return;
            }
            const q = this.query.trim().toLowerCase();
            this.filtered = this.items.filter(
                (it) =>
                    (it.name && it.name.toLowerCase().includes(q)) ||
                    (it.unitTypeName && it.unitTypeName.toLowerCase().includes(q))
            );
        },


        getNameById(id) {
            const item = this.items.find(i => i.id === id);
            return item ? item.name : `Item #${id}`;
        },
    },
});
