import { Op, } from "sequelize";
import { sequelize } from '../models/model.js'

const getAll = ({ Job, Contract, Profile, profileId }) => {
    console.log(Sequelize.transaction)
    console.log(Transaction)
    return Job.findAll({
        include: {
            model: Contract,
            where: {
                [Op.or]: [
                    { ContractorId: profileId }, { ClientId: profileId }
                ],
            },
            include: [{ model: Profile, as: 'Client' }, { model: Profile, as: 'Contractor' }]
        }
    })
}

const getAllUnpaidAndInProgress = ({ Job, Contract, profileId }) => {
    return Job.findAll({
        where: {
            paid: {
                [Op.not]: true
            }
        },
        include: {
            model: Contract,
            where: {
                [Op.or]: [
                    { ContractorId: profileId }, { ClientId: profileId }
                ],
                status: "in_progress"
            }
        }
    })
}

const getAllUnpaid = ({ Job, Contract, profileId }) => {
    return Job.findAll({
        where: {
            paid: {
                [Op.not]: true
            }
        },
        include: {
            model: Contract,
            where: {
                ClientId: profileId
            }
        }
    })
}

const findOneNotPaidById = ({ Job, Contract, profileId, id }) => {
    return Job.findOne({
        where: {
            id,
            paid: {
                [Op.not]: true
            }
        },
        include: {
            model: Contract,
            where: {
                ClientId: profileId
            }
        }
    })
}

const pay = async ({ client, job, Profile }) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            // // CLIENT UPDATE BALANCE
            console.log(`Old Client balance: ${client.balance}`);
            const updatedClient = await client.decrement('balance', { by: job.price });
            console.log(`New Client balance: ${updatedClient.balance}`);

            // // JOB UPDATE INFOS
            job.set({
                paid: true,
                paymentDate: new Date().toISOString()
            })
            await job.save()

            // // CONTRACTOR UPDATE BALANCE
            const contractor = await Profile.findOne({
                where: {
                    id: job.Contract.ContractorId
                }
            })

            console.log(`Old Contractor balance: ${contractor.balance}`);
            const updatedContractor = await contractor.increment('balance', { by: job.price });
            console.log(`New Contractor balance: ${updatedContractor.balance}`);

            return updatedClient
        })

        return result
    } catch (error) {
        console.error("Something went wrong, rolling back transaction...");
    }
}

export default {
    pay,
    getAll,
    getAllUnpaidAndInProgress,
    getAllUnpaid,
    findOneNotPaidById
}