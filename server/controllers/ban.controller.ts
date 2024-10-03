import { Request, Response } from 'express';
import { BanModel, OffenderModel, UserModel } from '../models';
import mongoose, { Types } from 'mongoose';
import { IBan } from '../models/index.js';

export async function getBansForUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return BanModel.find({ submittedBy: userId })
    .populate('offender', 'firstName lastName')
    .populate('warnings', 'date')
    .populate('submittedBy', 'username');
}

export const getAllBans = async (req: Request, res: Response) => {
  try {
    let bans;
    if (req.session.userRole === 'staff') {
      bans = await getBansForUser(req.session.userId!);
    } else {
      bans = await BanModel.find()
        .populate('offender', 'firstName lastName')
        .populate('warnings', 'date')
        .populate('submittedBy', 'username');
    }
    res.json(bans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bans', error });
  }
};

export const createBan = async (req: Request, res: Response) => {
  try {
    const { date, offender, warnings } = req.body;
    const newBan = new BanModel({
      date,
      offender,
      warnings,
      submittedBy: req.session.userId
    });
    const savedBan = await newBan.save();
    const populatedBan = await BanModel.findById(savedBan._id)
      .populate('offender', 'firstName lastName')
      .populate('warnings', 'date')
      .populate('submittedBy', 'username');
    res.status(201).json({
      message: 'Ban created successfully',
      ban: populatedBan,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating ban', error });
  }
};

export const getBanById = async (req: Request, res: Response) => {
  try {
    let ban: IBan | null = null;
    if (req.session.userRole === 'staff') {
      const userBans = await getBansForUser(req.session.userId!);
      ban = userBans.find(b => b._id.toString() === req.params.id) || null;
    } else {
      ban = await BanModel.findById(req.params.id)
        .populate('offender', 'firstName lastName')
        .populate('warnings', 'date')
        .populate('submittedBy', 'username');
    }
    if (!ban) {
      return res.status(404).json({ message: 'Ban not found' });
    }
    res.json(ban);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ban', error });
  }
};

export const updateBan = async (req: Request, res: Response) => {
  try {
    const updatedBan = await BanModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('offender', 'firstName lastName')
      .populate('warnings', 'date')
      .populate('submittedBy', 'username');
    if (!updatedBan) {
      return res.status(404).json({ message: 'Ban not found' });
    }
    res.json({
      message: 'Ban updated successfully',
      ban: updatedBan,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating ban', error });
  }
};

export const deleteBan = async (req: Request, res: Response) => {
  try {
    const deletedBan = await BanModel.findByIdAndDelete(req.params.id);
    if (!deletedBan) {
      return res.status(404).json({ message: 'Ban not found' });
    }
    res.json({ message: 'Ban deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ban', error });
  }
};

export const getBansForOffender = async (req: Request, res: Response) => {
  try {
    const { offenderId } = req.params;
    const bans = await BanModel.find({ offender: offenderId })
      .populate('warnings', 'date')
      .populate('submittedBy', 'username');
    res.json(bans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bans for offender', error });
  }
};