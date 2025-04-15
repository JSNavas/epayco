import { defineStore } from 'pinia';

export const useClientStore = defineStore('client', {
  state: () => ({
    clientData: {
      documento: '',
      celular: '',
      email: '',
      nombres: '',
      saldo: 0,
    },
    isLoggedIn: false,
  }),
  actions: {
    setClientData(data: Partial<typeof this.clientData>) {
      this.clientData = { ...this.clientData, ...data };
    },
    setLoginStatus(status: boolean) {
      this.isLoggedIn = status;
    },
  },
});
