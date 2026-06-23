import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import TutorProfile from '../models/TutorProfile.js';
import Booking from '../models/Booking.js';

dotenv.config();

// All seed accounts use this password
const PASSWORD = 'password123';

const tutors = [
  {
    user: {
      name: 'Wei Ling Tan',
      email: 'weiling.tan@example.com',
      phone: '+65 9123 4567',
    },
    profile: {
      subjects: ['Math', 'Physics'],
      levels: ['O-Levels', 'A-Levels'],
      teachingMode: 'both',
      hourlyRate: 60,
      bio: 'NUS Engineering graduate with a passion for making Math and Physics intuitive. I focus on exam strategies for O and A level students and have helped over 40 students improve by at least two grades.',
      yearsExperience: 8,
    },
  },
  {
    user: {
      name: 'Marcus Lim',
      email: 'marcus.lim@example.com',
      phone: '+65 9234 5678',
    },
    profile: {
      subjects: ['English', 'History'],
      levels: ['PSLE', 'O-Levels'],
      teachingMode: 'online',
      hourlyRate: 45,
      bio: 'Former MOE teacher with 12 years of classroom experience. I specialise in English composition and comprehension for PSLE and O-level students, with structured weekly writing practice.',
      yearsExperience: 12,
    },
  },
  {
    user: {
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      phone: '+65 9345 6789',
    },
    profile: {
      subjects: ['Science', 'Biology', 'Chemistry'],
      levels: ['PSLE', 'O-Levels', 'A-Levels'],
      teachingMode: 'in-person',
      hourlyRate: 55,
      bio: 'NTU Biological Sciences graduate. I make science come alive with real-world examples and hands-on demonstrations. Available for home tuition islandwide.',
      yearsExperience: 6,
    },
  },
  {
    user: {
      name: 'Jun Hao Chen',
      email: 'junhao.chen@example.com',
      phone: '+65 9456 7890',
    },
    profile: {
      subjects: ['Math', 'Chinese'],
      levels: ['PSLE'],
      teachingMode: 'online',
      hourlyRate: 35,
      bio: 'Patient and encouraging tutor for primary school students. I use games and visual methods to build strong foundations in Math and Chinese for PSLE preparation.',
      yearsExperience: 3,
    },
  },
  {
    user: {
      name: 'Sarah Abdullah',
      email: 'sarah.abdullah@example.com',
      phone: '+65 9567 8901',
    },
    profile: {
      subjects: ['Economics', 'Math', 'Geography'],
      levels: ['A-Levels'],
      teachingMode: 'both',
      hourlyRate: 75,
      bio: 'SMU Economics honours graduate and full-time tutor. I specialise in H1/H2 Economics essay technique and case study analysis, with consolidated notes provided for every topic.',
      yearsExperience: 9,
    },
  },
];

const parents = [
  {
    name: 'David Wong',
    email: 'david.wong@example.com',
    phone: '+65 9678 9012',
    childName: 'Ethan Wong',
    childLevel: 'Primary',
  },
  {
    name: 'Mei Hua Lee',
    email: 'meihua.lee@example.com',
    phone: '+65 9789 0123',
    childName: 'Chloe Lee',
    childLevel: 'JC',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([User.deleteMany(), TutorProfile.deleteMany(), Booking.deleteMany()]);
    console.log('Cleared existing data');

    for (const t of tutors) {
      const user = await User.create({
        ...t.user,
        password: PASSWORD,
        role: 'tutor',
      });
      await TutorProfile.create({ ...t.profile, user: user._id });
      console.log(`Created tutor: ${user.name} (${user.email})`);
    }

    for (const p of parents) {
      const user = await User.create({ ...p, password: PASSWORD, role: 'parent' });
      console.log(`Created parent: ${user.name} (${user.email})`);
    }

    console.log('\nSeed complete. All accounts use password: ' + PASSWORD);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
