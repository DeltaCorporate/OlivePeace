export default class AbstractRepository {
    constructor(modelClass, idOrInstance) {
        if (idOrInstance instanceof modelClass)
            this.model = idOrInstance;
        else if (typeof idOrInstance === 'number' || typeof idOrInstance === 'string')
            this.model = new modelClass({ id: idOrInstance });
        else
            throw new Error('Invalid parameter: must be either an instance of the model or an ID.');
    }
}
