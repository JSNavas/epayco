<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <q-card class="q-ma-auto shadow-2" style="min-width: 400px">
          <q-card-section>
            <div class="text-h5 text-bold text-primary text-center">Registro de Cliente</div>
            <div class="text-subtitle2 text-grey-7 text-center q-mt-sm">
              Completa los campos para registrarte
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-input
              filled
              v-model="register.documento"
              label="Documento"
              placeholder="Ingresa tu documento"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="register.nombres"
              label="Nombres"
              placeholder="Ingresa tus nombres"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="register.email"
              type="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="register.celular"
              label="Celular"
              placeholder="Ingresa tu número de celular"
              class="q-mb-md"
            />
          </q-card-section>
            <q-card-actions align="right" class="q-mt-md">
            <q-btn
              label="Registrar"
              color="primary"
              icon="send"
              @click="handleRegister"
              unelevated
            />
            </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWalletApi } from 'src/composables/useWalletApi';
import { RegisterRequest } from 'src/services/interfaces/client.interface';
import { ApiResponse } from 'src/services/interfaces/api.interface';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useClientStore } from 'src/stores/clientStore';
import { ClientData } from 'src/services/interfaces/client.interface';

const clientStore = useClientStore();

const register = ref<RegisterRequest>({
  documento: '',
  nombres: '',
  email: '',
  celular: '',
});

const { registerClient } = useWalletApi();
const router = useRouter();

const validateForm = (form: RegisterRequest) => {
  if (!form.documento.trim()) {
    showError('El campo "Documento" es obligatorio.');
    return false;
  }
  if (!form.celular.trim() || !/^\d{10}$/.test(form.celular)) {
    showError('El campo "Celular" es obligatorio y debe contener 10 dígitos.');
    return false;
  }
  if (!form.nombres.trim()) {
    showError('El campo "Nombres" es obligatorio.');
    return false;
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    showError('El campo "Correo electrónico" es obligatorio y debe tener un formato válido.');
    return false;
  }
  return true;
};

const showError = (message: string) => {
  Notify.create({
    type: 'negative',
    message,
    position: 'top'
  });
};

const handleResponse = (res: ApiResponse, successCallback: () => void) => {
  if (res.status === 'success') {
    Notify.create({
      type: 'positive',
      message: res.message,
      position: 'top'
    });
    successCallback();
  } else {
    Notify.create({
      type: 'negative',
      message: res.message,
      position: 'top'
    });
  }
};

async function handleRegister() {
  if (!validateForm(register.value)) return;

  try {
    const res = await registerClient(register.value);
    handleResponse(res, async () => {
      if (res.status === 'success') {
        clientStore.setClientData(res.data as ClientData);
        clientStore.setLoginStatus(true);

        await router.push('/wallet');
      } else {
        showError(res.message);
      }
    });
  } catch (error) {
    showError(error instanceof Error ? error.message : 'No se ha podido realizar la recarga');
  }
}
</script>

<style scoped>
.text-bold {
  font-weight: 600;
}
.text-primary {
  color: #1976d2;
}
.shadow-2 {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
