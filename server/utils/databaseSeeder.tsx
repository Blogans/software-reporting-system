import { UserModel, VenueModel, OffenderModel, IncidentModel, WarningModel, BanModel, ContactModel } from '../models';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  try {
    // Clear existing data
    await UserModel.deleteMany({});
    await VenueModel.deleteMany({});
    await OffenderModel.deleteMany({});
    await IncidentModel.deleteMany({});
    await WarningModel.deleteMany({});
    await BanModel.deleteMany({});
    await ContactModel.deleteMany({});

    console.log('Existing data cleared. Seeding database...');

    // Create users
    const adminUser = await UserModel.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpassword', 10),
      role: 'admin'
    });

    const managerUser = await UserModel.create({
      username: 'manager',
      email: 'manager@example.com',
      password: await bcrypt.hash('managerpassword', 10),
      role: 'manager'
    });

    const staffUser = await UserModel.create({
      username: 'staff',
      email: 'staff@example.com',
      password: await bcrypt.hash('staffpassword', 10),
      role: 'staff'
    });

    console.log('Users created.');

    // Create venues
    const venue1 = await VenueModel.create({
      name: 'Downtown Club',
      address: '123 Main St, Cityville'
    });

    const venue2 = await VenueModel.create({
      name: 'Beachside Bar',
      address: '456 Ocean Ave, Seaside'
    });

    console.log('Venues created.');

    // Create contacts
    const contact1 = await ContactModel.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '123-456-7890',
      email: 'alice@venue.com'
    });

    const contact2 = await ContactModel.create({
      firstName: 'Bob',
      lastName: 'Smith',
      phone: '098-765-4321',
      email: 'bob@venue.com'
    });

    console.log('Contacts created.');

    // Associate contacts with venues
    venue1.contacts.push(contact1._id);
    venue2.contacts.push(contact2._id);
    await venue1.save();
    await venue2.save();

    // Create offenders
    const offender1 = await OffenderModel.create({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-15')
    });

    const offender2 = await OffenderModel.create({
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1985-07-22')
    });

    console.log('Offenders created.');

    // Create incidents
    const incident1 = await IncidentModel.create({
      date: new Date('2024-05-10'),
      description: 'Verbal altercation at the bar',
      venue: venue1._id,
      submittedBy: staffUser._id
    });

    const incident2 = await IncidentModel.create({
      date: new Date('2024-06-20'),
      description: 'Unauthorized entry attempt',
      venue: venue2._id,
      submittedBy: managerUser._id
    });

    console.log('Incidents created.');

    // Create warnings
    const warning1 = await WarningModel.create({
      date: new Date('2024-05-11'),
      offender: offender1._id,
      incidents: [incident1._id],
      submittedBy: staffUser._id
    });

    const warning2 = await WarningModel.create({
      date: new Date('2024-06-21'),
      offender: offender2._id,
      incidents: [incident2._id],
      submittedBy: managerUser._id
    });

    console.log('Warnings created.');

    // Create bans
    await BanModel.create({
      date: new Date('2024-05-15'),
      offender: offender1._id,
      warnings: [warning1._id],
      submittedBy: managerUser._id
    });

    await BanModel.create({
      date: new Date('2024-06-25'),
      offender: offender2._id,
      warnings: [warning2._id],
      submittedBy: adminUser._id
    });

    console.log('Bans created.');

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export default seedDatabase;