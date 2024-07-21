import Product from "#app/src/sequelize/models/product.model.js";
import { deleteUploadedFile, moveTmpToUpload } from "../../utils/file.util.js";
import { productSchemaCreate, productSchemaUpdate } from '#shared/validations/schema/product.validation-schema.js';
import { formatJoiErrors, handleError } from '../../utils/error.util.js';
import { ProductMessage, ImageMessage, GlobalMessage } from '#app/src/validations/errors.messages.js';
import upload from "#config/multer.config.js";
import ProductMongoose from '#app/src/mongoose/models/product.model.js';
import {getPagedData, getPagination} from "#app/src/utils/pagination.util.js";
import MongooseFilter from "#app/src/services/filters/mongoose.filter.js";
class ProductController {
    static async create(req, res) {
        await upload.image.single('image')(req, res, async (err) => {
            const errors = [];
            if (err) errors.push({ field: 'image', message: ImageMessage.uploadError });
            try {
                const data = req.body;
                errors.concat(formatJoiErrors(productSchemaCreate, data));
                if (req.file) {
                    data.imageName = req.file.filename;
                    await moveTmpToUpload(req.file.filename);
                }else
                    errors.push({ field: 'image', message: ImageMessage.required });

                if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

                const product = await Product.create(data);
                return res.created(product);
            } catch (error) {
                handleError(res, error);
            }
        });
    }

    static async update(req, res) {
        await upload.image.single('image')(req, res, async (err) => {
            const errors = [];
            if (err) errors.push({ field: 'image', message: ImageMessage.uploadError });

            try {
                const { id } = req.params;
                const data = req.body;
                errors.concat(formatJoiErrors(productSchemaUpdate, data));

                const product = await Product.findByPk(id);
                if (!product) errors.push({ message: ProductMessage.notFound });

                if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

                if (req.file) {
                    await deleteUploadedFile(product.imageName);
                    data.imageName = req.file.filename;
                    await moveTmpToUpload(data.imageName);
                }

                await product.update(data);
                return res.success(product);
            } catch (error) {
                handleError(res, error);
            }
        });
    }
    static async findAll(req, res) {
        try {
            const mongooseFilter = new MongooseFilter(req.query);
            const { filter, sort } = mongooseFilter.applyFilters();
            const totalItems = await ProductMongoose.countDocuments(filter);
            const data = await ProductMongoose.find(filter)
                .sort(sort)
            res.success(data);
        } catch (error) {
            handleError(res, error);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) return res.error(ProductMessage.notFound, 404);

            if (product.imageName) await deleteUploadedFile(product.imageName);

            await product.destroy();
            return res.status(204).send();
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default ProductController;