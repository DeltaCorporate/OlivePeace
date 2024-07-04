import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
    state: () => ({
        message: '',
        type: '', // 'positive', 'negative', 'info', 'warning'
        visible: false,
        timeout: 1000 // Valeur par défaut de 1 seconde
    }),
    actions: {
        showAlert(message, type, timeout = this.timeout) {
            this.message = message;
            this.type = type;
            this.visible = true;

            if (timeout > 0) {
                setTimeout(() => {
                    this.hideAlert();
                }, timeout);
            }
        },
        hideAlert() {
            this.message = '';
            this.type = '';
            this.visible = false;
        }
    }
});
