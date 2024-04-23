import { prisma } from "../app/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prisma.user.deleteMany({
        where:{
            name : "test"
        }
    });
}

export const createTestUser = async () => {
    await prisma.user.create({
        data:{
            name: "test",
            password: await bcrypt.hash("test", 10),
            email: "test@gmail.com"
        }
    });
}