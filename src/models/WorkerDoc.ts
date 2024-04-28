import mongoose from 'mongoose';
import { UserDoc } from './UserDoc';
import { PortfolioPostDoc } from './PortfolioPost';

export enum Job {
  Architect = 'Architect',
  Designer = 'Designer',
  Painter = 'Painter',
  Plumber = 'Plumber',
  Electrician = 'Electrician',
  InteriorDesigner = 'Interior Designer',
  Landscaper = 'Landscaper',
  Cleaner = 'Cleaner',
  SecuritySystemInstaller = 'Security System Installer',
}

export interface WorkerDoc extends UserDoc {
  workerAccountVerified: boolean;
  job: Job;
  // certificates: [
  //   {
  //     title: string;
  //     image: string;
  //     isValid: boolean;
  //   }
  // ];
  certificates: mongoose.Types.ObjectId[];
  savedPosts: mongoose.Types.ObjectId[];
  isVerified: boolean;
  isCertified: boolean;
  idPicture: string;
  location: string;
  rating: number;
  ratingsNumber: number;
  experience: number;
  portfolioPosts: PortfolioPostDoc[];
}
