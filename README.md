# RoadGuardian-AI

## Overview

**RoadGuardian-AI** is an advanced, AI-powered road safety and driver monitoring web application designed to enhance vehicle safety and improve driving habits. It acts as a comprehensive co-pilot, integrating real-time telemetry and artificial intelligence concepts to ensure a safer driving experience.

### Key Features
- **Advanced Driver Assistance Systems (ADAS):** Real-time monitoring for drowsiness, lane departure, traffic sign recognition, and collision warnings.
- **Risk & Habit Analysis:** Continuous evaluation of driving behavior, providing a dynamic driving score based on speed, braking habits, and hazard responses.
- **Road Hazard Detection:** Immediate alerts for critical road conditions like wrong-way vehicles, potholes, and waterlogging.
- **Civic & Community Reporting:** Hands-free voice commands to report road issues directly to civic authorities, paired with emergency SOS broadcast capabilities.
- **Maintenance Tracking:** Predictive health monitoring for vehicle components to prevent unexpected breakdowns.

Whether you're a daily commuter, a fleet manager, or a civic authority, RoadGuardian-AI bridges the gap between vehicle diagnostics, driver behavior, and road infrastructure health.

## Tech Stack

### Frontend & Core
- **React 19 & TypeScript:** Provides a robust, type-safe foundation for building the dynamic, interactive user interfaces across driver, fleet, and civic dashboard views.
- **Vite:** Ensures ultra-fast Hot Module Replacement (HMR) and optimized build performance for a seamless developer experience.

### Styling & Animations
- **Tailwind CSS:** Utilized for rapid, utility-first UI design, enabling responsive and consistent styling (including built-in dark/light mode support).
- **Lucide React:** Supplies clean, consistent, and scalable iconography throughout the application.
- **Motion:** Powers fluid micro-interactions, state transitions, and alert animations, making real-time telemetry updates feel natural and engaging.

### Artificial Intelligence & Machine Learning
- **Google Gemini AI (`@google/genai`):** Powers intelligent data processing, analyzing driving telemetry and generating insights or summaries for risk behaviors.

### Native Web Capabilities
- **Web Speech API:** Enables hands-free, voice-activated commands (e.g., "report pothole") and text-to-speech (TTS) emergency SOS broadcasts, ensuring the driver's focus remains safely on the road.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`