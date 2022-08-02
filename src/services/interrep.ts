import {GenericService} from "../util/svc";
import config from "../util/config";
import interepGroups from "../models/interepGroups";
import {sequelize} from "../util/sequelize";
import semaphore from "../models/semaphore";
import {clear} from "winston";

export type InterepGroup = {
    provider: 'twitter' | 'github' | 'reddit';
    name: string;
    root: string;
    size: number;
}

const INTEREP_SYNC_INTERVAL = 15 * 60 * 1000;

export default class InterrepService extends GenericService {
    interepGroups?: ReturnType<typeof interepGroups>;
    semaphore?: ReturnType<typeof semaphore>;

    groups: {
        [providerName: string]: InterepGroup[],
    };

    providers = ['twitter', 'github', 'reddit'];

    timeout: any;

    constructor() {
        super();
        this.groups = {};
    }

    sync = async () => {
        try {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            // @ts-ignore
            const resp = await fetch(`${config.interrepAPI}/api/v1/groups`);
            const json = await resp.json();
            const groups = json.data;
            if (groups?.length) {
                for (let group of groups) {
                    const { root, provider, name } = group;
                    const existing = await this.interepGroups!.getGroup(provider, name);
                    if (existing?.root_hash !== root) {
                        await this.fetchMembersFromGroup(root, provider, name);
                        await this.interepGroups?.addHash(root, provider, name);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.timeout = setTimeout(this.sync, INTEREP_SYNC_INTERVAL);
        }
    }

    async fetchMembersFromGroup(root: string, provider: string, name: string, limit = 1000, offset = 0): Promise<void> {
        const groupId = `interrep_${provider}_${name}`;
        // @ts-ignore
        const resp = await fetch(`${config.interrepAPI}/api/v1/groups/${provider}/${name}/members?limit=${limit}&offset=${offset}`);
        const json = await resp.json();
        const members: string[] = json.data;
        if (members.length) {
            for (const member of members) {
                await this.semaphore?.addID(BigInt(member).toString(16), groupId, root);
            }
        }

        if (members.length >= limit) {
            await this.fetchMembersFromGroup(root, provider, name, limit + 1000, limit);
        }
    }

    async getBatchFromRootHash(rootHash: string) {
        try {
            const interepGroups = await this.call('db', 'getInterepGroups');

            const exist = await interepGroups.findOneByHash(rootHash);

            if (exist) return exist;

            // @ts-ignore
            const resp = await fetch(`${config.interrepAPI}/api/v1/batches/${rootHash}`);
            const json = await resp.json();
            const group = json?.data?.group;

            if (group) {
                await interepGroups.addHash(rootHash, group.provider, group.name);
            }

            return {
                name: group.name,
                provider: group.provider,
                root_hash: rootHash,
            };
        } catch (e) {
            return false;
        }
    }

    async getProofFromGroup(provider: string, name: string, id: string) {
        try {
            // @ts-ignore
            const resp = await fetch(`${config.interrepAPI}/api/v1/groups/${provider}/${name}/${id}/proof`);
            const json = await resp.json();
            return json;
        } catch (e) {
            return false;
        }
    }

    async inProvider(provider: string, id: string): Promise<boolean> {
        // @ts-ignore
        const resp = await fetch(`${config.interrepAPI}/api/v1/providers/${provider}/${id}`);
        const json = await resp.json();

        if (json?.data) {
            return !!json?.data;
        }

        return false;
    }

    async start() {
        this.interepGroups = await interepGroups(sequelize);
        this.semaphore = await semaphore(sequelize);
        await this.sync();
    }

    async stop() {
        if (this.timeout) clearTimeout(this.timeout);
    }
}