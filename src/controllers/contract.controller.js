import repository from "../repositories/contract.repository.js"

/**
 * Get a contract by ID
 * @returns contract by id
 */
export const getByID = async (req, res) => {
    const profileId = req.profile.id;
    const { Contract } = req.app.get('models')
    const { id } = req.params

    const contract = await repository.getByID({ Contract, id, profileId })

    if (!contract) return res.status(404).json({ error: "Contract not Found" })

    res.json(contract)
}

/**
 * Get All Non termated Contracts
 */
export const getAllNonTerminated = async (req, res) => {
    const profileId = req.profile.id;
    const { Contract } = req.app.get('models')
    const contracts = await repository.getAllNonTerminated({ Contract, profileId })

    if (!contracts) return res.status(404).json({ error: "Contracts not Found" })

    res.json(contracts)
}