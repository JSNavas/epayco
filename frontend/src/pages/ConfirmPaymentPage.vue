<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <q-card class="q-ma-auto q-pa-md shadow-3" style="max-width: 400px">
          <q-card-section class="text-center">
            <div class="loading-dialog">
              <img width="100" src="https://multimedia.epayco.co/dashboard/v4/iconos/gifInicio.gif" alt="Cargando..." />
            </div>
            <div class="text-h5 text-bold text-primary q-mt-sm">Solicitud de Pago</div>
            <div class="text-subtitle2 text-grey-7">Por favor, ingresa el codigo para confirmar tu pago</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-input filled v-model="token" label="Codigo de confirmación" />
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              label="Confirmar"
              color="primary"
              icon="check_circle"
              :loading="isLoading"
              @click="handleConfirm"
            />
          </q-card-actions>
        </q-card>
      </q-page>

      <q-dialog v-model="isLoading" persistent>
        <div class="loading-dialog">
          <img src="https://multimedia.epayco.co/dashboard/v4/iconos/gifInicio.gif" alt="Cargando..." />
          <p class="text-primary text-bold q-mt-md">Procesando pago...</p>
        </div>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useWalletApi } from 'src/composables/useWalletApi';
import { ClientData } from 'src/services/interfaces/client.interface';
import { useRouter, useRoute } from 'vue-router';
import { useClientStore } from 'src/stores/clientStore';
import { Notify } from 'quasar';
import { ConfirmPaymentResponse } from 'src/services/interfaces/payment.interface';
import { ApiResponse } from 'src/services/interfaces/api.interface';

const sessionId = ref<string>('');
const token = ref<string>('');
const isLoading = ref<boolean>(false);

const { confirmPayment } = useWalletApi();
const router = useRouter();
const route = useRoute();
const clientStore = useClientStore();

onMounted(() => {
  sessionId.value = (route.query.sessionId as string) || '';
});

const handleResponse = (res: ApiResponse, successCallback: () => void, modalRef: Ref<boolean>) => {
  if (res.status === 'success') {
    Notify.create({
      type: 'positive',
      message: res.message,
      position: 'top'
    });
    modalRef.value = false;
    successCallback();
  } else {
    Notify.create({
      type: 'negative',
      message: res.message,
      position: 'top'
    });
  }
};

const showError = (message: string) => {
  Notify.create({
    type: 'negative',
    message,
    position: 'top'
  });
};

const handleConfirm = async () => {
  isLoading.value = true;
  try {
    const payload: ConfirmPaymentResponse = { sessionId: sessionId.value, token: token.value };
    const res: ApiResponse = await confirmPayment(payload);

    handleResponse(res, () => {
      if (res.status === 'success') {
        clientStore.setClientData(res.data as ClientData);
        clientStore.setLoginStatus(true);
        setTimeout(() => {
          void router.push('/wallet');
        }, 2000);
      } else {
        showError(res.message);
      }
    }, isLoading);
  } catch (error: unknown) {
    Notify.create({
      message: error instanceof Error ? error.message : 'Error en confirmar pago',
      color: 'negative',
      position: 'top',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.text-bold {
  font-weight: 600;
}
.text-primary {
  color: #1976d2;
}
.loading-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.text-bold {
  font-weight: 600;
}
.text-primary {
  color: #1976d2;
}
.shadow-3 {
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
