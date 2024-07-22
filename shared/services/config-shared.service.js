export default class ConfigSharedService {
    static getDashboardLayout(layoutSelection, userRoles, layouts) {
        let selectedLayout = null;
        let highestPriority = -1;

        for (const [configRole, config] of Object.entries(layoutSelection)) {
            if (userRoles.includes(configRole) && config.priority > highestPriority) {
                selectedLayout = config.layout;
                highestPriority = config.priority;
            }
        }

        if (selectedLayout)
            return layouts.find(layout => layout.id === selectedLayout);


        return null;
    }
}