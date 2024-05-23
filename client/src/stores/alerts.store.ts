import { defineStore } from 'pinia'
import {AlerteType} from "@/types/alerte.type.ts";

export const useAlertsStore = defineStore('alerts', {
    // other options...
    state: () => ({
        alerts: [] as Array<AlerteType>,
    }),
    actions: {
        addAlert(alert: AlerteType) {
            this.alerts.push(alert)
        },
        removeAlert(index: number) {
            this.alerts.splice(index, 1)
        },
    },
    getters: {
        getAlerts(): Array<AlerteType> {
            return this.alerts
        },
    },
})