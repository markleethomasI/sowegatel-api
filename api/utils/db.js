const mongoose = require("mongoose");

module.exports = {
    async isObjectId(input) {
        return mongoose.Types.ObjectId.isValid(input)
    },
    
    /**
     * Create a database transaction
     * @param {Promise} databaseInstructions
     * @returns {Promise} returnedFromDatabaseInstructions
     */
    async ensureDatabaseTransaction(callback) {
        const session = await mongoose.startSession();
        try {
            
            // await session.withTransaction(async () => {
            //     returnedFromCallback = await callback(session);
            // });

            session.startTransaction()

            const returnedFromCallback = await callback(session)

            await session.commitTransaction();

            return returnedFromCallback;
        } catch (e) {
            await session.abortTransaction()
            throw e;
        }
    },
};
