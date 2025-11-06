// actions/index.js

'use server'

import db from "../../../prisma/db";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function createUser(
    name,
    email,
    password) {

    try {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            }
        });

        return { success: true, message: 'Usuário criado!' };

    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        // 🔹 Identificar o erro específico do Prisma
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return { success: false, message: 'Este e-mail já está em uso.' };
        }

        return { success: false, message: 'Erro ao criar o usuário. Tente novamente mais tarde.' };
    }
}

