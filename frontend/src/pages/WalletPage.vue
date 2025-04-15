<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md bg-grey-1">
        <div class="row items-center justify-between q-my-md">
          <div>
            <div class="text-h5 text-bold text-secondary">Billetera Virtual Epayco</div>
            <div class="text-subtitle2 text-grey-7">Consulta tu saldo y transacciones</div>
          </div>
            <q-btn text-color="primary" color="white" outline icon="account_balance_wallet" label="Consultar" @click="showConsulta = true" />
        </div>

        <div class="q-mb-md">
          <div
            v-if="clientStore.isLoggedIn"
            color="primary"
            class="text-subtitle2 text-primary q-ml-sm"
          >
            Bienvenido, {{ clientStore.clientData.nombres }}
          </div>
          <q-badge
            v-else
            color="grey-5"
            class="text-subtitle2 q-pa-sm text-white"
          >
            Realiza una consulta para obtener tus datos.
          </q-badge>
        </div>

        <!-- Balance -->
        <q-card class="q-pa-md q-mb-md shadow-2">
          <div class="text-center">
            <div class="text-h3 text-bold text-secondary q-mb-md">
              {{ formatCurrency(clientStore.clientData?.saldo) }} USD
            </div>
            <div class="row justify-center q-col-gutter-sm">
              <q-btn class="q-mx-sm"  color="green" icon="add" label="Recargar" @click="showRecarga = true" />
              <q-btn class="q-mx-sm" color="primary" icon="payment" label="Pagar" @click="showPago = true" />
            </div>
          </div>
        </q-card>

        <!-- Historial de Transacciones -->
        <q-card class="q-pa-md shadow-1" v-if="clientStore.isLoggedIn">
          <q-card-section>
            <div class="row items-center">
              <div class="text-h6 text-bold text-primary">Historial de Transacciones</div>
              <div class="text-grey-7 q-ml-xs">(simuladas)</div>
            </div>


          </q-card-section>
          <q-separator />
          <q-list bordered>
            <q-item v-for="(tx, index) in transactions" :key="index" clickable>
              <q-item-section avatar>
                <q-icon :name="tx.amount > 0 ? 'arrow_upward' : 'arrow_downward'" :color="tx.amount > 0 ? 'green' : 'red'" />
              </q-item-section>
              <q-item-section>
                <div class="text-body1">{{ tx.title }}</div>
                <div class="text-caption text-grey-7">{{ tx.date }}</div>
              </q-item-section>
              <q-item-section side>
                <div :class="tx.amount > 0 ? 'text-green' : 'text-red'">
                  {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Modal para Recarga -->
        <q-dialog v-model="showRecarga" persistent>
          <q-card style="min-width: 350px" class="shadow-3">
            <q-card-section>
              <div class="text-h6 text-bold text-primary">Recargar Billetera</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input filled v-model="recarga.documento" label="Documento" placeholder="Ingresa tu documento" />
              <q-input filled v-model="recarga.celular" label="Celular" placeholder="Ingresa tu número de celular" />
              <q-input filled v-model.number="recarga.valor" type="number" label="Monto a Recargar" placeholder="Ej: 100.00" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="black" @click="showRecarga = false" />
              <q-btn label="Recargar" color="primary" @click="handleRecharge" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Modal para Pago -->
        <q-dialog v-model="showPago" persistent>
          <q-card style="min-width: 350px" class="shadow-3">
            <q-card-section>
              <div class="text-h6 text-bold text-primary">Realizar un pago</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input filled v-model="pago.documento" label="Documento" placeholder="Ingresa tu documento" />
              <q-input filled v-model="pago.celular" label="Celular" placeholder="Ingresa tu número de celular" />
              <q-input filled v-model.number="pago.valor" type="number" label="Monto a Pagar" placeholder="Ej: 50.00" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" outline color="black" @click="showPago = false" />
              <q-btn label="Pagar" color="primary" @click="handlePayment" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Modal para Consulta -->
        <q-dialog v-model="showConsulta" persistent>
          <q-card style="min-width: 350px" class="shadow-3">
            <q-card-section>
              <div class="text-h6 text-bold text-primary">Consultar saldo</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input filled v-model="consulta.documento" label="Documento" placeholder="Ingresa tu documento" />
              <q-input filled v-model="consulta.celular" label="Celular" placeholder="Ingresa tu número de celular" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="black" @click="showConsulta = false" />
              <q-btn label="Consultar" color="primary" @click="handleTotalBalance" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useWalletApi } from 'src/composables/useWalletApi';
import { useClientStore } from 'src/stores/clientStore';
import { PaymentRequest } from 'src/services/interfaces/payment.interface';
import { ClientData } from 'src/services/interfaces/client.interface';
import { RechargeRequest } from 'src/services/interfaces/recharge.interface';
import { TotalBalanceRequest } from 'src/services/interfaces/totalBalance.interface';
import { ApiResponse } from 'src/services/interfaces/api.interface';

// transacciones simuladas
const transactions = ref([
  { title: 'Recarga', date: 'Hoy, 14:00', amount: 200.00 },
  { title: 'Compra', date: 'Hoy, 11:30', amount: -150.00 },
  { title: 'Recarga', date: 'Ayer, 16:45', amount: 300.00 },
]);

// store
const clientStore = useClientStore();

// compoasables
const { recharge, pay, totalBalance } = useWalletApi();

// Estado para mostrar modales
const showRecarga = ref(false);
const showPago = ref(false);
const showConsulta = ref(false);

const recarga = ref<RechargeRequest>({ documento: '', celular: '', valor: 0 });
const pago = ref<PaymentRequest>({ documento: '', celular: '', valor: 0 });
const consulta = ref<TotalBalanceRequest>({documento: '', celular: ''});

const router = useRouter();

const validateForm = (form: { documento: string; celular: string; valor?: number }) => {
  if (!form.documento.trim()) {
    showError('El campo "Documento" es obligatorio.');
    return false;
  }
  if (!form.celular.trim() || !/^\d{10}$/.test(form.celular)) {
    showError('El campo "Celular" es obligatorio y debe contener 10 dígitos.');
    return false;
  }
  if (form.valor !== undefined && form.valor <= 0) {
    showError('El monto debe ser mayor que 0.');
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

const handleRecharge = async () => {
  if (!validateForm(recarga.value)) return;

  try {
    const res = await recharge(recarga.value);
    handleResponse(res, () => {
      if (res.status === 'success') {
        clientStore.setClientData(res.data as ClientData);
        clientStore.setLoginStatus(true);
      } else {
        showError(res.message);
      }
    }, showRecarga);
  } catch (error) {
    showError(error instanceof Error ? error.message : 'No se ha podido realizar la recarga');
  }
};

const handleTotalBalance = async () => {
  if (!validateForm(consulta.value)) return;

  try {
    const res = await totalBalance(consulta.value);
    handleResponse(res, () => {
      if (res.status === 'success') {
        clientStore.setClientData(res.data as ClientData);
        clientStore.setLoginStatus(true);
      } else {
        showError(res.message);
      }
    }, showConsulta);
  } catch (error) {
    showError(error instanceof Error ? error.message : 'No se ha podido realizar la consulta');
  }
};

const handlePayment = async () => {
  if (!validateForm(pago.value)) return;

  try {
    const res = await pay(pago.value);
    handleResponse(res, async () => {
      const data = res.data as { sessionId: string };
      await router.push({ path: '/confirm', query: { sessionId: data.sessionId } });
    }, showPago);
  } catch (error) {
    showError(error instanceof Error ? error.message : 'No se ha podido realizar el pago');
  }
};

const formatCurrency = (value: number | null | undefined): string => {
  return (value ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script>

<style scoped>
.text-bold {
  font-weight: 600;
}
.text-primary {
  color: #1976d2;
}
.shadow-1 {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.shadow-2 {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}
.shadow-3 {
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
