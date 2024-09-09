import { Request, Response } from 'express';
import { OffenderModel, UserModel } from '../models';
import mongoose, { Types } from 'mongoose';
import { IOffender } from '../models/index.js';
import { off } from 'process';

export async function getOffendersForUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return OffenderModel.find();
}

export const getAllOffenders = async (req: Request, res: Response) => {
  try {
    if (req.session.userRole === 'staff') {
      const offenders = await getOffendersForUser(req.session.userId!);
      return res.json(offenders);
    }
    const offenders = await OffenderModel.find();
    res.json(offenders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offenders', error });
  }
};

export const createOffender = async (req: Request, res: Response) => {
  try {
    const newOffender = new OffenderModel(req.body);
    
    const savedOffender = await newOffender.save();
    console.log('ok--', newOffender);
    res.status(201).json(savedOffender);
  } catch (error) {
    res.status(400).json({ message: 'Error creating offender', error });
  }
};

export const getOffenderById = async (req: Request, res: Response) => {
  try {
    let offender: IOffender | null = null;
    if (req.session.userRole === 'staff') {
      const userOffenders = await getOffendersForUser(req.session.userId!);
      const foundOffender = userOffenders.find(o => o._id.toString() === req.params.id);
      if (foundOffender) {
        offender = foundOffender;
      }
    } else {
      offender = await OffenderModel.findById(req.params.id);
    }
    if (!offender) {
      return res.status(404).json({ message: 'Offender not found' });
    }
    res.json(offender);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offender', error });
  }
};

export const updateOffender = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth } = req.body;

    if (!firstName && !lastName && !dateOfBirth) {
      return res.status(400).json({ message: 'No update fields provided' });
    }

    const offender = await OffenderModel.findById(id);
    if (!offender) {
      return res.status(404).json({ message: 'Offender not found' });
    }

    if (firstName) offender.firstName = firstName;
    if (lastName) offender.lastName = lastName;
    if (dateOfBirth) offender.dateOfBirth = dateOfBirth;

    await offender.save();

    return res.status(200).json({
      message: 'Offender updated successfully',
      offender
    });
  } catch (error) {
    console.error('Error in updateOffender:', error);
    return res.status(400).json({ message: 'Error updating offender', error: error});
  }
};

export const deleteOffender = async (req: Request, res: Response) => {
  try {
    const deletedOffender = await OffenderModel.findByIdAndDelete(req.params.id);
    if (!deletedOffender) {
      return res.status(404).json({ message: 'Offender not found' });
    }

    res.json({ message: 'Offender deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offender', error });
  }
};