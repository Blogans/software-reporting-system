import { Request, Response } from 'express';
import { WarningModel, OffenderModel, UserModel, IncidentModel } from '../models';
import { IWarning } from '../models/index.js';

export async function getWarningsForUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // First, find all incidents associated with the user's venues
  const userIncidents = await IncidentModel.find({ venue: { $in: user.venues } });
  const userIncidentIds = userIncidents.map(incident => incident._id);

  // Then, find warnings that include any of these incidents
  const warnings = await WarningModel.find({ incidents: { $in: userIncidentIds } })
    .populate('offender', 'firstName lastName')
    .populate({
      path: 'incidents',
      populate: { path: 'venue', select: 'name' }
    })
    .populate('submittedBy', 'username');

  return warnings;
}

export const getAllWarnings = async (req: Request, res: Response) => {
  try {
    let warnings;
    if (req.session.userRole === 'staff') {
      warnings = await getWarningsForUser(req.session.userId!);
    } else {
      warnings = await WarningModel.find()
        .populate('offender', 'firstName lastName')
        .populate({
          path: 'incidents',
          populate: { path: 'venue', select: 'name' }
        })
        .populate('submittedBy', 'username');
    }
    res.json(warnings);
  } catch (error) {
    console.error('Error in getAllWarnings:', error);
    res.status(500).json({ message: 'Error fetching warnings', error: error });
  }
};

export const createWarning = async (req: Request, res: Response) => {
  try {
    const { date, offender, incidents } = req.body;
    const newWarning = new WarningModel({
      date,
      offender,
      incidents,
      submittedBy: req.session.userId
    });
    const savedWarning = await newWarning.save();
    const populatedWarning = await WarningModel.findById(savedWarning._id)
      .populate('offender', 'firstName lastName')
      .populate('incidents', 'date description')
      .populate('submittedBy', 'username');
    res.status(201).json({
      message: 'Warning created successfully',
      warning: populatedWarning,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error creating warnings', error });
  }
};

export const getWarningById = async (req: Request, res: Response) => {
  try {
    let warning: IWarning | null = null;
    if (req.session.userRole === 'staff') {
      const userWarnings = await getWarningsForUser(req.session.userId!);
      warning = userWarnings.find(w => w._id.toString() === req.params.id) || null;
    } else {
      warning = await WarningModel.findById(req.params.id)
        .populate('offender', 'firstName lastName')
        .populate('incidents', 'date description')
        .populate('submittedBy', 'username');
    }
    if (!warning) {
      return res.status(404).json({ message: 'Warning not found' });
    }
    res.json(warning);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching warning', error });
  }
};

export const updateWarning = async (req: Request, res: Response) => {
  try {
    const updatedWarning = await WarningModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('offender', 'firstName lastName')
      .populate('incidents', 'date description')
      .populate('submittedBy', 'username');
    if (!updatedWarning) {
      return res.status(404).json({ message: 'Warning not found' });
    }
    res.json({
      message: 'Warning updated successfully',
      warning: updatedWarning,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating warning', error });
  }
};

export const deleteWarning = async (req: Request, res: Response) => {
  try {
    const deletedWarning = await WarningModel.findByIdAndDelete(req.params.id);
    if (!deletedWarning) {
      return res.status(404).json({ message: 'Warning not found' });
    }
    res.json({ message: 'Warning deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting warning', error });
  }
};

export const getWarningsForOffender = async (req: Request, res: Response) => {
  try {
    const { offenderId } = req.params;
    const warnings = await WarningModel.find({ offender: offenderId })
      .populate('incidents', 'date description')
      .populate('submittedBy', 'username');
    res.json(warnings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching warnings for offender', error });
  }
};