import { Request, Response } from 'express';
import { IncidentModel, VenueModel, UserModel, WarningModel, BanModel } from '../models';
import mongoose, { Types } from 'mongoose';
import { IIncident } from '../models/index.js';

export async function getIncidentsForUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return IncidentModel.find({ submittedBy: userId })
    .populate('venue', 'name')
    .populate('submittedBy', 'username');
}

export const getAllIncidents = async (req: Request, res: Response) => {
  try {
    let incidents;
    if (req.session.userRole === 'staff') {
      incidents = await getIncidentsForUser(req.session.userId!);
    } else {
      incidents = await IncidentModel.find()
        .populate('venue', 'name')
        .populate('submittedBy', 'username');
    }
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incidents', error });
  }
};

export const createIncident = async (req: Request, res: Response) => {
  try {
    const { date, description, venue } = req.body;
    const newIncident = new IncidentModel({
      date,
      description,
      venue,
      submittedBy: req.session.userId
    });
    const savedIncident = await newIncident.save();
    const populatedIncident = await IncidentModel.findById(savedIncident._id)
      .populate('venue', 'name')
      .populate('submittedBy', 'username');
    res.status(201).json({
      message: 'Incident created successfully',
      incident: populatedIncident,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating incident', error });
  }
};

export const getIncidentById = async (req: Request, res: Response) => {
  try {
    let incident: IIncident | null = null;
    if (req.session.userRole === 'staff') {
      const userIncidents = await getIncidentsForUser(req.session.userId!);
      incident = userIncidents.find(i => i._id.toString() === req.params.id) || null;
    } else {
      incident = await IncidentModel.findById(req.params.id)
        .populate('venue', 'name')
        .populate('submittedBy', 'username');
    }
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incident', error });
  }
};

export const updateIncident = async (req: Request, res: Response) => {
  try {
    const updatedIncident = await IncidentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('venue', 'name')
      .populate('submittedBy', 'username');
    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json({
      message: 'Incident updated successfully',
      incident: updatedIncident,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating incident', error });
  }
};

export const deleteIncident = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Remove the incident from any warnings
    await WarningModel.updateMany(
      { incidents: id },
      { $pull: { incidents: id } }
    );

    // Remove the incident from any bans
    await BanModel.updateMany(
      { incidents: id },
      { $pull: { incidents: id } }
    );

    // Delete the incident
    const deletedIncident = await IncidentModel.findByIdAndDelete(id);

    if (!deletedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted successfully and removed from associated warnings and bans' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting incident', error });
  }
};

export const getIncidentsForVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;
    const incidents = await IncidentModel.find({ venue: venueId })
      .populate('submittedBy', 'username');
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incidents for venue', error });
  }
};