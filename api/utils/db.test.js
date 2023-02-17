const dbUtils = require("./db");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const Models = require("../models");
const User = Models.User;

let replset;

beforeAll(async () => {
    // This will create an new instance of "MongoMemoryReplSet" and automatically start all Servers
    replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } }); // This will create an ReplSet with 4 members

    const uri = replset.getUri();

    mongoose.connect(uri);
});

afterAll(async () => {
    await replset.stop();
    await mongoose.connection.close();
});

describe("Test db transaction helper", () => {
    test("Should not create db entry on error within function", async () => {
        try {
            await dbUtils.ensureDatabaseTransaction(async (session) => {
                await User.create(
                    [
                        {
                            firstName: "Mark",
                            lastName: "Thomas",
                            email: "markleethomas.esq3@gmail.com",
                            password: "1234",
                        },
                    ],
                    { session }
                );

                throw new Error("Simulating error thrown in create");
            });
        } catch (error) {}

        const user = await User.findOne();

        expect(user).toBe(null);
    });

    test('Should create db entry on no errors within function', async () => {
        await dbUtils.ensureDatabaseTransaction(async (session) => {
            await User.create(
                [
                    {
                        firstName: "Mark",
                        lastName: "Thomas",
                        email: "markleethomas.esq3@gmail.com",
                        password: "1234",
                    },
                ],
                { session }
            );
        });

        const user = await User.findOne()

        expect(user.firstName).toBe('mark')
    })
});
