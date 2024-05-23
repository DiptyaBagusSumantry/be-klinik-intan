const Models = require("../models/index.js");
const MedicalRecords = Models.MedicalRecord
const { handlerError, handleCreate } = require("../helper/HandlerError.js");

class MedicalRecord{
    static async createMedicalRecord(req,res){
        try {
            const { pelayanan, keluhan, diagnosa, tindakan, biaya, patientId} = req.body
            await MedicalRecords.create({
                pelayanan, keluhan, diagnosa, tindakan, biaya, patientId
            })
            return handleCreate(res)
        } catch (error) {
            handlerError(res, error)
        }
    }
}
module.exports = MedicalRecord