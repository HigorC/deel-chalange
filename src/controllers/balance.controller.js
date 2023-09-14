import jobRepository from "../repositories/job.repository.js";
import profileRepository from "../repositories/profile.repository.js"

/**
 * Deposit in a client's balance
 */
export const deposit = async (req, res) => {
    const profileId = req.profile.id;
    const { userId } = req.params
    const { value } = req.body
    console.log(req.body);

    if (userId == profileId) return res.status(409).json({ error: "You can't deposit into your own account!" })
    if (!value) return res.status(400).json({ error: "The [value] attribute is required." })

    const { Job, Contract, Profile } = req.app.get('models')

    //Get all jobs unpaid by current client
    const jobs = await jobRepository.getAllUnpaid({ Job, Contract, profileId })

    const totalJobsToPay = jobs.reduce((sum, job) => {
        return job.price + sum
    }, 0)

    if (value > totalJobsToPay * 0.25) {
        return res.status(400).json({ error: "You can't deposit more than 25% of yours jobs to pay!" })
    }

    const clientToDeposit = await profileRepository.findOne({ Profile, userId })

    if (!clientToDeposit) return res.status(404).json({ error: "Client not Found" })

    const { updatedClient, updatedclientToDeposit } = await profileRepository.deposit({ client: req.profile, clientToDeposit, value })

    res.json({ message: `[${value} sent to ${updatedclientToDeposit.firstName} ${updatedclientToDeposit.lastName}, your current balance is [${updatedClient.balance}]` })
}