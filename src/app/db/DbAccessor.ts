import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import { User } from './UserModel';

const dbUri = 'mongodb://127.0.0.1:27017/mydatabase';
const dbName = 'mydatabase'

/**
 * Connects to the database
 */
export class DbAccessor {

    private client: MongoClient;
    private dataBase: Db;
    private usersCollection: Collection<User>;

    constructor() {
        this.client = new MongoClient(dbUri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        })
    }

    public async connect() {
        try {
            await this.client.connect();
            await this.client.db("admin").command({ ping: 1 });
            this.dataBase = this.client.db(dbName);
            this.usersCollection = this.dataBase.collection<User>('users');
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } catch (error) {
            console.error(error)
        }
    }

    public async close() {
        await this.client.close();
    }

    public async addUser(user: User) {
        const result = await this.usersCollection.insertOne(user);
        return result.insertedId;
    }

    public getUsers() {
        return this.usersCollection.find().toArray();
    }


}