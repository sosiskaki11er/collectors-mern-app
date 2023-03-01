import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js'

export const signin = async (req, res) => {
    const {email, password} = req.body ;

    try {
        const exisitingUser = await User.findOne({ email })

        if(!exisitingUser) {
            return res.status(404).json({ message: 'User doesnt exist' })
        }

        const isPAsswordCorrect = await bcrypt.compare(password, exisitingUser.password)

        if(!isPAsswordCorrect) {
            return res.status(400).json({})
        }

        const token = jwt.sign({ email: exisitingUser.email, id: exisitingUser._id }, 'test', { expiresIn: '1h' })

        res.status(200).json({ result: exisitingUser, token })
    } catch(error) {
        res.status(500).json({ message: 'Unexpected error' })
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const exisitingUser = await User.findOne({ email });

        if(exisitingUser) {
            return res.status(400).json({ message: 'User already exist' })
        }

        if(password !== confirmPassword) {
            return res.status(400).json({ message:'Passwords dont match' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
        
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' })

        res.status(200).json({ result: result, token })
    } catch(error) {
        res.status(500).json({ message: 'Unexpected error' })
    }
}