<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleDrawer" aria-label="Menu" />
        <q-toolbar-title>Epayco</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="left" bordered>
      <q-list>
        <q-item clickable to="/register">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>Registro</q-item-section>
        </q-item>
        <q-item clickable to="/wallet">
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" />
          </q-item-section>
          <q-item-section>Consultar Saldo</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>
