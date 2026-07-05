export type Role = 'driver' | 'fleet' | 'authority' | 'mechanic' | 'passenger';

export interface VehicleSetup {
  type: 'two_wheeler' | 'car_suv' | 'bus_truck' | 'commercial';
  registration: string;
  makeModel: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'CNG';
}

export interface Hazard {
  id: string;
  type: 'pothole' | 'waterlogging' | 'debris' | 'wrong_way' | 'road_crack' | 'barricade' | 'accident';
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  distance: number; // in meters
  confidence: number; // percentage
  timestamp: string;
  location: string;
  lat: number;
  lng: number;
  imageThumbnail?: string;
}

export interface AlertLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  speed: number;
  location: string;
  hasVideo?: boolean;
}

export interface ComponentHealth {
  name: string;
  percentage: number;
  status: 'Good' | 'Monitor' | 'Check' | 'Service Soon';
  icon: string;
  wearFactor: string;
}

export interface DrivingStats {
  speed: number;
  distance: number;
  score: number;
  activeHazards: number;
  durationSeconds: number;
  hardBrakes: number;
  laneDepartures: number;
  drowsyEvents: number;
  speedViolations: number;
}

export interface SavedClip {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  time: string;
  speed: number;
  duration: string;
}

export interface CommunityReport {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  status: 'Pending' | 'Acknowledged' | 'Resolved';
  description?: string;
  responseMessage?: string;
}
