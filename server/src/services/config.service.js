import ConfigSharedService from '#shared/services/config-shared.service.js';
import Config from '../mongoose/models/config.model.js';

export class ConfigService extends ConfigSharedService {
    static async get(key) {
        const config = await Config.findOne({ key });
        return config ? config.value : null;
    }

    static async set(key, value) {
        const config = await Config.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        return config.value;
    }

    static async getDashboardLayouts() {
        return this.get('admin_dashboard_layout');
    }

    static async setDashboardLayouts(layouts) {
        return this.set('admin_dashboard_layout', layouts);
    }

    static async getDashboardLayoutSelection() {
        return this.get('admin_dashboard_layout_selected');
    }

    static async setDashboardLayoutSelection(selection) {
        return this.set('admin_dashboard_layout_selected', selection);
    }
}