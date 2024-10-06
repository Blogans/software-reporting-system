import { Request, Response } from 'express';
import { UserModel, VenueModel, IncidentModel, WarningModel, BanModel } from '../models';
import mongoose from 'mongoose';

export const getRecentIncidents = async (req: Request, res: Response) => {
  try {
    let recentIncidents;
    if (req.session.userRole === 'staff') {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      recentIncidents = await IncidentModel.find({ venue: { $in: user.venues } })
        .sort({ date: -1 })
        .limit(5)
        .populate('venue', 'name')
        .populate('submittedBy', 'username');
    } else {
      recentIncidents = await IncidentModel.find()
        .sort({ date: -1 })
        .limit(5)
        .populate('venue', 'name')
        .populate('submittedBy', 'username');
    }
    res.json(recentIncidents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent incidents', error });
  }
};

export const getRecentWarnings = async (req: Request, res: Response) => {
  try {
    let recentWarnings;
    if (req.session.userRole === 'staff') {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      recentWarnings = await WarningModel.find({ 'incidents.venue': { $in: user.venues } })
        .sort({ date: -1 })
        .limit(5)
        .populate('offender', 'firstName lastName')
        .populate({
          path: 'incidents',
          populate: { path: 'venue', select: 'name' }
        })
        .populate('submittedBy', 'username');
    } else {
      recentWarnings = await WarningModel.find()
        .sort({ date: -1 })
        .limit(5)
        .populate('offender', 'firstName lastName')
        .populate({
          path: 'incidents',
          populate: { path: 'venue', select: 'name' }
        })
        .populate('submittedBy', 'username');
    }
    res.json(recentWarnings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent warnings', error });
  }
};

export const getRecentBans = async (req: Request, res: Response) => {
  try {
    let recentBans;
    if (req.session.userRole === 'staff') {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userVenueIds = user.venues.map(id => new mongoose.Types.ObjectId(id));
      recentBans = await BanModel.aggregate([
        {
          $lookup: {
            from: 'warnings',
            localField: 'warnings',
            foreignField: '_id',
            as: 'warningDetails'
          }
        },
        {
          $match: {
            'warningDetails.incidents.venue': { $in: userVenueIds }
          }
        },
        { $sort: { date: -1 } },
        { $limit: 5 }
      ]);
      await BanModel.populate(recentBans, [
        { path: 'offender', select: 'firstName lastName' },
        { path: 'submittedBy', select: 'username' },
        {
          path: 'warnings',
          populate: {
            path: 'incidents',
            populate: { path: 'venue', select: 'name' }
          }
        }
      ]);
    } else {
      recentBans = await BanModel.find()
        .sort({ date: -1 })
        .limit(5)
        .populate('offender', 'firstName lastName')
        .populate({
          path: 'warnings',
          populate: {
            path: 'incidents',
            populate: { path: 'venue', select: 'name' }
          }
        })
        .populate('submittedBy', 'username');
    }
    res.json(recentBans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent bans', error });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    let statsQuery = {};
    if (req.session.userRole === 'staff') {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      statsQuery = { venue: { $in: user.venues } };
    }

    const totalIncidents = await IncidentModel.countDocuments(statsQuery);
    const totalWarnings = await WarningModel.countDocuments(statsQuery);
    const totalBans = await BanModel.countDocuments(statsQuery);
    const totalVenues = req.session.userRole === 'staff' 
      ? (await UserModel.findById(req.session.userId))?.venues.length || 0
      : await VenueModel.countDocuments();

    res.json({
      totalIncidents,
      totalWarnings,
      totalBans,
      totalVenues
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error });
  }
};