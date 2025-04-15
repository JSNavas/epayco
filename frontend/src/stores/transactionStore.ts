import { defineStore } from "pinia";
import { Transaction } from "src/services/interfaces/transaction.interface";

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
  }),
  actions: {
    setTransactions(transactions: Transaction[]) {
      this.transactions = transactions;
    },
    clearTransactions() {
      this.transactions = [];
    },
  },
});
