// src/routes/config.route.js
import express from 'express';
import {ConfigService} from "#app/src/services/config.service.js";
import {handleError} from "#app/src/utils/error.util.js";

const router = express.Router();

router.get('/dashboard-layouts', async (req, res) => {
    try {
        const layouts = await ConfigService.getDashboardLayouts();
        res.success(layouts);
    } catch (error) {
        handleError(error);
    }
});

router.post('/dashboard-layouts', async (req, res) => {
    try {
        const { layouts } = req.body;
        const updatedLayouts = await ConfigService.setDashboardLayouts(layouts);
        res.success(updatedLayouts);
    } catch (error) {
        handleError(error);
    }
});

router.get('/dashboard-layout-selection', async (req, res) => {
    try {
        const selection = await ConfigService.getDashboardLayoutSelection();
        res.success(selection);
    } catch (error) {
        handleError(error)
    }
});

router.post('/dashboard-layout-selection', async (req, res) => {
    try {
        const { selection } = req.body;
        const updatedSelection = await ConfigService.setDashboardLayoutSelection(selection);
        res.success(updatedSelection);
    } catch (error) {
        handleError(error)
    }
});

export default router;