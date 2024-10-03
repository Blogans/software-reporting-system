export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'staff' | 'manager' | 'admin';
  venues: string[];
}

export interface Venue {
  _id: string;
  name: string;
  address: string;
  contacts: string[];
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Offender {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface Incident {
  _id: string;
  date: string;
  description: string;
  venue: {
    _id: string;
    name: string;
  };
  submittedBy: {
    _id: string;
    username: string;
  };
}

export interface Warning {
  _id: string;
  date: string;
  offender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  incidents: {
    _id: string;
    description: string;
    date: string;
  }[];
  submittedBy: {
    _id: string;
    username: string;
  };
}

export interface Ban {
  _id: string;
  date: string;
  offender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  warnings: string[];
  submittedBy: {
    _id: string;
    username: string;
  };
}