import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/index.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    // Create a user object without the password for response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error registering user', error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Set user info in session
    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    
    res.json({ message: 'Login successful', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logout successful' });
  });
};

export const getUser = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.json({ user: { id: req.session.userId, email: req.session.userEmail, role: req.session.userRole } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  console.log('okok---');
  if (req.session.userId) {
    res.json({ 
      id: req.session.userId, 
      email: req.session.userEmail, 
      role: req.session.userRole 
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
