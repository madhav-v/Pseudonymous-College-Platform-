import { getRepository } from "typeorm";
import { User } from "../models/User.model";
import ErrorHandler from "../utils/errorhandler";

class UserService {
  getUserById = async (id: number) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      return user;
    } catch (error: any) {
      throw new ErrorHandler(error.message, error.statusCode);
    }
  };
}

const userSvc = new UserService();
export default userSvc;
