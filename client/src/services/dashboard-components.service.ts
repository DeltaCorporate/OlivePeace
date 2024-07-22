import GraphSalesByMonth from "@/components/graph/GraphSalesByMonth.vue";
import GraphSalesByYears from "@/components/graph/GraphSalesByYears.vue";
import GraphUserByMonth from "@/components/graph/GraphUserByMonth.vue";
import TopSellingProduct from "@/components/graph/TopSellingProduct.vue";
import GraphStockByMonth from "@/components/graph/GraphStockByMonth.vue";
import GraphProductSalesEvolution from "@/components/graph/GraphProductSalesEvolution.vue";

export {
    GraphSalesByMonth,
    GraphSalesByYears,
    GraphUserByMonth,
    TopSellingProduct,
    GraphStockByMonth,
    GraphProductSalesEvolution
};


export function getComponentByName(name: string) {
    switch (name) {
        case 'GraphSalesByMonth':
            return GraphSalesByMonth;
        case 'GraphSalesByYears':
            return GraphSalesByYears;
        case 'GraphUserByMonth':
            return GraphUserByMonth;
        case 'TopSellingProduct':
            return TopSellingProduct;
        case 'GraphStockPerMonth':
            return GraphStockPerMonth;
        case 'GraphProductSalesEvolution':
            return GraphProductSalesEvolution;
        default:
            console.error(`Component ${name} not found`);
            return null;
    }
}