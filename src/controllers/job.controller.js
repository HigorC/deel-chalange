import repository from "../repositories/job.repository.js"

/**
 * Get All jobs
 */
export const getAll = async (req, res) => {
    const profileId = req.profile.dataValues.id;
    const { Job, Contract, Profile } = req.app.get('models')

    const jobs = await repository.getAll({ Job, Contract, Profile, profileId })

    if (!jobs) return res.status(404).json({ error: "Job not Found" })
    res.json(jobs)
}

/**
 * Get All unpaid jobs
 */
export const getAllUnpaid = async (req, res) => {
    const profileId = req.profile.id;
    const { Job, Contract } = req.app.get('models')

    const jobs = await repository.getAllUnpaidAndInProgress({ Job, Contract, profileId })

    if (!jobs) return res.status(404).json({ error: "Job not Found" })
    res.json(jobs)
}

/**
 * Pay for a Job
 */
export const pay = async (req, res) => {
    const profileId = req.profile.id;
    const { id } = req.params
    const { Job, Contract, Profile } = req.app.get('models')

    const job = await repository.findOneNotPaidById({ Job, Contract, profileId, id })

    if (!job) return res.status(404).json({ error: "Job not Found" })

    const { balance } = req.profile.dataValues

    if (balance < job.price) {
        return res.status(400).json({ error: `Your balance [${balance}] is not enogth to pay for the job [${job.price}].` })
    }

    const updatedClient = await repository.pay({ client: req.profile, job, Profile })

    res.json({ message: `Job paid! Your currently balance is [${updatedClient.balance}]` })
}