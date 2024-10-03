import mongoose, { Schema, Document } from 'mongoose';

// User Model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'staff' | 'manager' | 'admin';
  venues: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['staff', 'manager', 'admin'], required: true },
  venues: [{ type: Schema.Types.ObjectId, ref: 'Venue' }],
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// Venue Model
export interface IVenue extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  contacts: mongoose.Types.ObjectId[];
}

const VenueSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }],
});

export const VenueModel = mongoose.model<IVenue>('Venue', VenueSchema);

// Contact Model
export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const ContactSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

export const ContactModel = mongoose.model<IContact>('Contact', ContactSchema);

// Offender Model
export interface IOffender extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

const OffenderSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
});

export const OffenderModel = mongoose.model<IOffender>('Offender', OffenderSchema);

// Incident Model
export interface IIncident extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  venue: mongoose.Types.ObjectId;
  submittedBy: mongoose.Types.ObjectId;
}

const IncidentSchema: Schema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const IncidentModel = mongoose.model<IIncident>('Incident', IncidentSchema);

// Warning Model
export interface IWarning extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  offender: mongoose.Types.ObjectId;
  incidents: mongoose.Types.ObjectId[];
  submittedBy: mongoose.Types.ObjectId;
}

const WarningSchema: Schema = new Schema({
  date: { type: Date, required: true },
  offender: { type: Schema.Types.ObjectId, ref: 'Offender', required: true },
  incidents: [{ type: Schema.Types.ObjectId, ref: 'Incident' }],
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const WarningModel = mongoose.model<IWarning>('Warning', WarningSchema);

// Ban Model
export interface IBan extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  offender: mongoose.Types.ObjectId;
  warnings: mongoose.Types.ObjectId[];
  submittedBy: mongoose.Types.ObjectId;
}

const BanSchema: Schema = new Schema({
  date: { type: Date, required: true },
  offender: { type: Schema.Types.ObjectId, ref: 'Offender', required: true },
  warnings: [{ type: Schema.Types.ObjectId, ref: 'Warning' }],
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const BanModel = mongoose.model<IBan>('Ban', BanSchema);