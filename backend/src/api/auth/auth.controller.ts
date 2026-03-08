import { Request, Response } from 'express';
import { createUser, validateUser } from './auth.services';
import { RegisterInput, LoginInput } from './auth.validation';
import { signToken, setAuthCookie, clearAuthCookie } from '@/services/jwt.service';
import { validateExerciseSubmission } from '../exercises/exercises.validation';


export async function registerUserHandler(req: Request, res: Response) {
    try {
        const userInput: RegisterInput = req.body;
        const user = await createUser(userInput);
        const { password_hash, ...userResponse} = user;

        const token = signToken({
            user_id: user.user_id,
            email: user.email,
            role: user.role
        });
        setAuthCookie(res, token);
        
        return res.status(201).json({success: true, data: userResponse, error: null});
    } catch (error: any){
        if (error.code == 'P2002' && error.meta?.target?.includes('email')){
            return res.status(409).json({
                success: false,
                data: null,
                error: 'An user with this email already exists.',
            });
        }
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}

export async function loginUserHandler(req: Request, res: Response) {
    try {
        const loginInput: LoginInput = req.body;
        const user = await validateUser(loginInput);

        if (!user) {
            return res.status(401).json({ success: false, data: null, error: 'Invalid email or password' });
        }

        const token = signToken({
            user_id: user.user_id,
            email: user.email,
            role: user.role
        });
        setAuthCookie(res, token);

        const {password_hash, ...userResponse} = user;
        return res.status(200).json({ success: true, data: userResponse, error: null });
    } catch (error) {
        return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
    }
}

export async function logoutUserHandler(req: Request, res: Response) {
    clearAuthCookie(res);
    return res.status(200).json({ success: true, data: { message: 'Logged out successfully' }, error: null });
}