import { Student } from "../models/student.model.js"

const generateStudentCode = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code
    let exists = true

    while (exists) {
        code = ""
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            )
        }

        exists = await Student.exists({ studentCode: code })
    }

    return code
}

export default generateStudentCode