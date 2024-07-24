import Config from "#app/src/mongoose/models/config.model.js";
import {handleError} from "#app/src/utils/error.util.js";

class DashboardLayoutController {

    static async list(req, res) {
        try {
            const layouts = await Config.find({ key: 'admin_dashboard_layouts' });
            const layoutSelected = await Config.findOne({ key: 'admin_dashboard_layout_selected' });

            const formattedLayouts = layouts.map(layout => ({
                _id: layout._id,
                name: layout.value.name,
                layout: layout.value.layout,
                priority: layoutSelected?.value[layout._id.toString()]?.priority || 0,
                roles: layoutSelected?.value[layout._id.toString()]?.roles || []
            }));

            res.success(formattedLayouts);
        } catch (error) {
            handleError(res, error);
        }
    }


    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const config = await Config.findById(id);
            if (config && config.key === 'admin_dashboard_layouts') {
                return res.success(config.value);
            }
            return res.error('Layout non trouvé', 404);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async create(req, res) {
        try {
            const newLayout = {
                name: req.body.name,
                layout: req.body.layout
            };
            const config = await Config.create({ key: 'admin_dashboard_layouts', value: newLayout });
            res.success(config);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedLayout = {
                name: req.body.name,
                layout: req.body.layout
            };
            const config = await Config.findByIdAndUpdate(
                id,
                { value: updatedLayout },
                { new: true }
            );
            if (config) {
                res.success(config.value);
            } else {
                res.error('Layout non trouvé', 404);
            }
        } catch (error) {
            handleError(res, error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Config.findByIdAndDelete(id);
            if (result) {
                await DashboardLayoutController.removeLayoutSelection(id);
                res.success({ message: 'Layout supprimé avec succès' });
            } else {
                res.error('Layout non trouvé', 404);
            }
        } catch (error) {
            handleError(res, error);
        }
    }

    static async updateLayoutSelection(req, res) {
        try {
            const { layoutId, priority, roles } = req.body;
            const selectionConfig = await Config.findOne({ key: 'admin_dashboard_layout_selected' });
            let selection = selectionConfig ? selectionConfig.value : {};

            selection[layoutId] = { priority, roles };

            await Config.findOneAndUpdate(
                { key: 'admin_dashboard_layout_selected' },
                { value: selection },
                { upsert: true, new: true }
            );

            res.success({ message: 'Sélection de layout mise à jour avec succès' });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async removeLayoutSelection(layoutId) {
        const selectionConfig = await Config.findOne({ key: 'admin_dashboard_layout_selected' });
        let selection = selectionConfig ? selectionConfig.value : {};

        for (const role of Object.keys(selection)) {
            if (selection[role].layoutId === layoutId) {
                delete selection[role];
            }
        }

        await Config.findOneAndUpdate(
            { key: 'admin_dashboard_layout_selected' },
            { value: selection },
            { upsert: true, new: true }
        );
    }

    static async getLayoutSelection(req, res) {
        try {
            const selectionConfig = await Config.findOne({ key: 'admin_dashboard_layout_selected' });
            const selection = selectionConfig ? selectionConfig.value : {};
            res.success(selection);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default DashboardLayoutController;