import {GenericService} from "../../util/svc";
import {Dialect, Sequelize} from "sequelize";
import app from "../../models/app";
import config from "../../util/config";
import users from "../../models/users";
import records from "../../models/records";
import posts from "../../models/posts";
import meta from "../../models/meta";
import moderations from "../../models/moderations";
import profiles from "../../models/profiles";
import userMeta from "../../models/userMeta";
import connections from "../../models/connections";
import semaphore from "../../models/semaphore";
import tags from "../../models/tags";
import linkPreview from "../../models/linkPreview";
import ens from "../../models/ens";
import twitterAuth from "../../models/twitterAuth";
import interepGroups from "../../models/interepGroups";
import semaphoreCreators from "../../models/semaphore_creators";
import threads from "../../models/thread";
import uploads from "../../models/uploads";
import merkleRoot from "../../models/merkle_root";

export default class DBService extends GenericService {
    sequelize: Sequelize;
    sqlite: Sequelize;

    app?: ReturnType<typeof app>;
    ens?: ReturnType<typeof ens>;
    linkPreview?: ReturnType<typeof linkPreview>;
    users?: ReturnType<typeof users>;
    records?: ReturnType<typeof records>;
    posts?: ReturnType<typeof posts>;
    profiles?: ReturnType<typeof profiles>;
    moderations?: ReturnType<typeof moderations>;
    connections?: ReturnType<typeof connections>;
    tags?: ReturnType<typeof tags>;
    semaphore?: ReturnType<typeof semaphore>;
    meta?: ReturnType<typeof meta>;
    userMeta?: ReturnType<typeof userMeta>;
    twitterAuth?: ReturnType<typeof twitterAuth>;
    interepGroups?: ReturnType<typeof interepGroups>;
    semaphoreCreators?: ReturnType<typeof semaphoreCreators>;
    threads?: ReturnType<typeof threads>;
    uploads?: ReturnType<typeof uploads>;
    merkleRoot?: ReturnType<typeof merkleRoot>;

    constructor() {
        super();

        this.sqlite = new Sequelize({
            dialect: 'sqlite',
            storage: process.env.NODE_ENV === 'test' ? './gun.test.db' : './gun.db',
            logging: false,
        });

        if (!config.dbDialect || config.dbDialect === 'sqlite') {
            this.sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: config.dbStorage,
                logging: false,
            });
        } else {
            this.sequelize = new Sequelize(
                config.dbName as string,
                config.dbUsername as string,
                config.dbPassword,
                {
                    host: config.dbHost,
                    port: Number(config.dbPort),
                    dialect: config.dbDialect as Dialect,
                    logging: false,
                },
            );
        }
    }

    async getRecords(): Promise<ReturnType<typeof records>> {
        if (!this.records) {
            return Promise.reject(new Error('records is not initialized'));
        }
        return this.records;
    }

    async getUsers(): Promise<ReturnType<typeof users>> {
        if (!this.users) {
            return Promise.reject(new Error('users is not initialized'));
        }
        return this.users;
    }

    async getPosts(): Promise<ReturnType<typeof posts>> {
        if (!this.posts) {
            return Promise.reject(new Error('posts is not initialized'));
        }
        return this.posts;
    }

    async getConnections(): Promise<ReturnType<typeof connections>> {
        if (!this.connections) {
            return Promise.reject(new Error('connections is not initialized'));
        }
        return this.connections;
    }

    async getModerations(): Promise<ReturnType<typeof moderations>> {
        if (!this.moderations) {
            return Promise.reject(new Error('moderations is not initialized'));
        }
        return this.moderations;
    }

    async getProfiles(): Promise<ReturnType<typeof profiles>> {
        if (!this.profiles) {
            return Promise.reject(new Error('profiles is not initialized'));
        }

        return this.profiles;
    }

    async getMeta(): Promise<ReturnType<typeof meta>> {
        if (!this.meta) {
            return Promise.reject(new Error('meta is not initialized'));
        }

        return this.meta;
    }

    async getTags(): Promise<ReturnType<typeof tags>> {
        if (!this.tags) {
            return Promise.reject(new Error('tags is not initialized'));
        }

        return this.tags;
    }

    async getUserMeta(): Promise<ReturnType<typeof userMeta>> {
        if (!this.userMeta) {
            return Promise.reject(new Error('userMeta is not initialized'));
        }

        return this.userMeta;
    }

    async getTwitterAuth(): Promise<ReturnType<typeof twitterAuth>> {
        if (!this.twitterAuth) {
            return Promise.reject(new Error('twitterAuth is not initialized'));
        }

        return this.twitterAuth;
    }

    async getApp(): Promise<ReturnType<typeof app>> {
        if (!this.app) {
            return Promise.reject(new Error('app is not initialized'));
        }
        return this.app;
    }

    async getENS(): Promise<ReturnType<typeof ens>> {
        if (!this.ens) {
            return Promise.reject(new Error('ens is not initialized'));
        }
        return this.ens;
    }

    async getLinkPreview(): Promise<ReturnType<typeof linkPreview>> {
        if (!this.linkPreview) {
            return Promise.reject(new Error('linkPreview is not initialized'));
        }
        return this.linkPreview;
    }

    async getSemaphore(): Promise<ReturnType<typeof semaphore>> {
        if (!this.semaphore) {
            return Promise.reject(new Error('semaphore is not initialized'));
        }
        return this.semaphore;
    }

    async getInterepGroups(): Promise<ReturnType<typeof interepGroups>> {
        if (!this.interepGroups) {
            return Promise.reject(new Error('interepGroups is not initialized'));
        }
        return this.interepGroups;
    }

    async getSemaphoreCreators(): Promise<ReturnType<typeof semaphoreCreators>> {
        if (!this.semaphoreCreators) {
            return Promise.reject(new Error('semaphoreCreators is not initialized'));
        }
        return this.semaphoreCreators;
    }

    async getThreads(): Promise<ReturnType<typeof threads>> {
        if (!this.threads) {
            return Promise.reject(new Error('threads is not initialized'));
        }
        return this.threads;
    }

    async getUploads(): Promise<ReturnType<typeof uploads>> {
        if (!this.uploads) {
            return Promise.reject(new Error('uploads is not initialized'));
        }
        return this.uploads;
    }

    async start() {
        this.app = await app(this.sqlite);
        this.records = await records(this.sqlite);
        this.linkPreview = await linkPreview(this.sequelize);
        this.meta = await meta(this.sequelize);
        this.userMeta = await userMeta(this.sequelize);
        this.moderations = await moderations(this.sequelize);
        this.connections = await connections(this.sequelize);
        this.users = await users(this.sequelize);
        this.posts = await posts(this.sequelize);
        this.tags = await tags(this.sequelize);
        this.profiles = await profiles(this.sequelize);
        this.semaphore = await semaphore(this.sequelize);
        this.ens = await ens(this.sequelize);
        this.twitterAuth = await twitterAuth(this.sequelize);
        this.interepGroups = await interepGroups(this.sequelize);
        this.semaphoreCreators = await semaphoreCreators(this.sequelize);
        this.threads = await threads(this.sequelize);
        this.uploads = await uploads(this.sequelize);
        this.merkleRoot = await merkleRoot(this.sequelize);

        await this.app?.model.sync({ force: !!process.env.FORCE });
        await this.linkPreview?.model.sync({ force: !!process.env.FORCE });
        await this.records?.model.sync({ force: !!process.env.FORCE });

        await this.semaphore?.model.sync({ force: !!process.env.FORCE });

        await this.users?.model.sync({ force: !!process.env.FORCE });
        await this.moderations?.model.sync({ force: !!process.env.FORCE });
        await this.connections?.model.sync({ force: !!process.env.FORCE });
        await this.profiles?.model.sync({ force: !!process.env.FORCE });
        await this.posts?.model.sync({ force: !!process.env.FORCE });
        await this.tags?.model.sync({ force: !!process.env.FORCE });

        await this.userMeta?.model.sync({ force: !!process.env.FORCE });
        await this.meta?.model.sync({ force: !!process.env.FORCE });
        await this.ens?.model.sync({ force: !!process.env.FORCE });
        await this.twitterAuth?.model.sync({ force: !!process.env.FORCE });
        await this.interepGroups?.model.sync({ force: !!process.env.FORCE });
        await this.semaphoreCreators?.model.sync({ force: !!process.env.FORCE });
        await this.threads?.model.sync({ force: !!process.env.FORCE });
        await this.uploads?.model.sync({ force: !!process.env.FORCE });
        await this.merkleRoot?.model.sync({ force: !!process.env.FORCE });

        const appData = await this.app?.read();

        if (!appData) {
            await this.app?.updateLastENSBlock(12957300);
            await this.app?.updateLastInterrepBlock(28311377);
            await this.app?.updateLastArbitrumBlock(2193241);
            // await this.app?.updateLastArbitrumBlock(9317700);
        }

        // await this.app?.updateLastArbitrumBlock(2193241);
        // await this.app?.updateLastInterrepBlock(27202837);
    }
}