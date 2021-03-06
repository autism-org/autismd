import {BIGINT, ModelCtor, Sequelize, STRING} from "sequelize";

type ConnectionModel = {
    messageId: string;
    hash: string;
    creator: string;
    type: string;
    subtype: string;
    createdAt: number;
    name: string;
};

const connections = (sequelize: Sequelize) => {
    const model = sequelize.define('connections', {
        messageId: {
            type: STRING,
            allowNull: false,
        },
        hash: {
            type: STRING,
            allowNull: false,
            primaryKey: true,
        },
        creator: {
            type: STRING,
            allowNull: false,
        },
        type: {
            type: STRING,
            allowNull: false,
        },
        subtype: {
            type: STRING,
        },
        createdAt: {
            type: BIGINT,
            allowNull: false,
        },
        name: {
            type: STRING,
        },
    }, {
        indexes: [
            { fields: ['creator'] },
            { fields: ['subtype'] },
            { fields: ['name'] },
            { fields: ['hash'], unique: true },
            { fields: ['messageId'], unique: true },
        ],
    });

    const findOne = async (hash: string): Promise<ConnectionModel|null> => {
        let result: any = await model.findOne({
            where: {
                hash,
            },
        });

        if (!result) return null;

        const json = result.toJSON() as ConnectionModel;

        return json;
    }

    const remove = async (hash: string) => {
        return model.destroy({
            where: {
                hash,
            },
        });
    }

    const findAllByTargetName = async (
        name: string,
        offset = 0,
        limit = 20,
        order: 'DESC' | 'ASC' = 'DESC',
    ): Promise<ConnectionModel[]> => {
        let result = await model.findAll({
            where: {
                name,
            },
            offset,
            limit,
            order: [['createdAt', order]],
        });

        return result.map((r: any) => r.toJSON() as ConnectionModel);
    }

    const createConnection = async (record: ConnectionModel) => {
        return model.create(record);
    }

    return {
        model,
        findOne,
        remove,
        findAllByTargetName,
        createConnection,
    };
}

export default connections;