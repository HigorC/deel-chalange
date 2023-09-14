import { sequelize } from '../models/model.js'

const findOne = ({ Profile, userId }) => {
    return Profile.findOne({
        where: {
            id: userId,
            type: "client"
        }
    })
}

const deposit = async ({ client, clientToDeposit, value }) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            // Update own balance
            const updatedClient = await client.decrement('balance', { by: value });

            // Update client to deposit balance
            const updatedclientToDeposit = await clientToDeposit.increment('balance', { by: value });

            return {
                updatedClient,
                updatedclientToDeposit
            }
        })
        return result
    } catch (error) {
        console.error("Something went wrong, rolling back transaction...");
    }
}

export default {
    findOne,
    deposit
}