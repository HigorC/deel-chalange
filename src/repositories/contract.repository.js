import { Op } from "sequelize";

const getByID = ({Contract, id, profileId}) => {
    return Contract.findOne({
        where: {
            id,
            [Op.or]: [
                { ContractorId: profileId },
                { ClientId: profileId }
            ]
        }
    })
}

const getAllNonTerminated = ({Contract, profileId}) => {
    return Contract.findAll({
        where: {
            [Op.or]: [
                { ContractorId: profileId }, { ClientId: profileId }
            ],
            status: {
                [Op.ne]: "terminated"
            }
        }
    })
}

export default {
    getByID,
    getAllNonTerminated
}