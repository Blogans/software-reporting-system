import { Request, Response } from 'express';
import { IncidentModel, VenueModel, UserModel } from '../models';
import { rmSync } from 'fs';

export const generateIncidentReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const incidents = await IncidentModel.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 });

    const venueIds = incidents.map(incident => incident.venue);
    const userIds = incidents.map(incident => incident.submittedBy);

    const [venues, users] = await Promise.all([
      VenueModel.find({ _id: { $in: venueIds } }),
      UserModel.find({ _id: { $in: userIds } })
    ]);

    const venueMap = new Map(venues.map(venue => [venue._id.toString(), venue.name]));
    const userMap = new Map(users.map(user => [user._id.toString(), user.username]));

    const report = {
      startDate,
      endDate,
      totalIncidents: incidents.length,
      incidents: incidents.map(incident => ({
        date: incident.date,
        description: incident.description,
        venue: venueMap.get(incident.venue.toString()) || 'Unknown Venue',
        submittedBy: userMap.get(incident.submittedBy.toString()) || 'Unknown User'
      }))
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};