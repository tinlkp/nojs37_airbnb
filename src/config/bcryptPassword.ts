
import * as bcrypt from "bcrypt"


const hashSync = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt)
    return hash
}
export default hashSync