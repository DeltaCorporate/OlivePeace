// src/services/config.service.ts
import ConfigSharedService from '#shared/services/config-shared.service.js';
import * as dashboardLayoutsApi from '@/api/dashboard-layouts.api';
import { ResponseType } from '@/types/response.type';

export class ConfigService extends ConfigSharedService {
    static async getDashboardLayouts(): Promise<ResponseType<any[]>> {
        return await dashboardLayoutsApi.getDashboardLayouts();
    }

    static async setDashboardLayouts(layouts: any[]): Promise<ResponseType<any>> {
        return await dashboardLayoutsApi.setDashboardLayouts(layouts);
    }

    static async getDashboardLayoutSelection(): Promise<ResponseType<any>> {
        return await dashboardLayoutsApi.getDashboardLayoutSelection();
    }

    static async setDashboardLayoutSelection(selection: any): Promise<ResponseType<any>> {
        return await dashboardLayoutsApi.setDashboardLayoutSelection(selection);
    }


}