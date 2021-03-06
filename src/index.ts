import "isomorphic-fetch";
import {MainService} from "./util/svc";
import ENSService from "./services/ens";
import logger from "./util/logger";
import DBService from "./services/db";
import HttpService from "./services/http";
import GunService from "./services/gun";
import InterrepService from "./services/interrep";
import ArbitrumService from "./services/arbitrum";
import IPFSService from "./services/ipfs";
import ZKChatService from "./services/zkchat";
import MerkleService from "./services/merkle";

(async function initApp() {
    try {
        const main = new MainService();
        main.add('db', new DBService());
        main.add('merkle', new MerkleService());
        main.add('interrep', new InterrepService());
        main.add('zkchat', new ZKChatService());
        main.add('ens', new ENSService());
        main.add('arbitrum', new ArbitrumService());
        main.add('gun', new GunService());
        main.add('ipfs', new IPFSService());
        main.add('http', new HttpService());
        await main.start();
    } catch (e) {
        logger.error(e.message, {stack: e.stack});
        throw e;
    }
})();