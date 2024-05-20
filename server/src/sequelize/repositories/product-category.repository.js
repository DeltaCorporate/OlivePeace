import ProductCategory from '../../sequelize/models/product-category.js';
import AbstractRepository from "./abstract.repository.js";

class ProductCategoryRepository extends AbstractRepository{
    constructor(idOrInstance){
        super(ProductCategory,idOrInstance);
    }

    static async isSlugExist(slug){
        return await ProductCategory.findOne({where:{slug}});
    }

}

export default ProductCategoryRepository;
