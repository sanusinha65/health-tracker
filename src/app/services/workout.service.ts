import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private localStorageKey = 'workOutRecords';

  constructor() {
    // Initialize localStorage if empty
    if (!localStorage.getItem(this.localStorageKey)) {
      this.setWorkOutRecords([
        {
          id: 1,
          name: 'John Doe',
          workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 },
          ],
        },
        {
          id: 2,
          name: 'Jane Smith',
          workouts: [
            { type: 'Swimming', minutes: 60 },
            { type: 'Running', minutes: 20 },
          ],
        },
        {
          id: 3,
          name: 'Mike Johnson',
          workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 },
          ],
        },
        {
          id: 4,
          name: 'Mike Tyson',
          workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 },
          ],
        },
        {
          id: 5,
          name: 'John',
          workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 },
          ],
        },
        {
          id: 6,
          name: 'John Robert',
          workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 },
          ],
        },
      ]);
    }
  }

  /** Get all workout records */
  getWorkOutRecords(): any[] {
    const records = localStorage.getItem(this.localStorageKey);
    return records ? JSON.parse(records) : [];
  }

  /** Save workout records */
  setWorkOutRecords(records: any[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(records));
  }

  addWorkOutRecord(
    name: string,
    workOutType: string,
    workOutMinute: number
  ): void {
    const records = this.getWorkOutRecords();
    const lowerCaseName = name.toLowerCase();

    // Check if the user already exists in the records
    const existingUser = records.find(
      (record) => record.name.toLowerCase() === lowerCaseName
    );

    if (existingUser) {
      // Check if the workout type already exists for this user
      const existingWorkout = existingUser.workouts.find(
        (workout: { type: string; }) => workout.type === workOutType
      );

      if (existingWorkout) {
        // If workout type exists, update minutes (do not add to an empty list)
        existingWorkout.minutes += workOutMinute;
      } else {
        // If workout type is new, add it to the workouts array
        existingUser.workouts.push({
          type: workOutType,
          minutes: workOutMinute,
        });
      }
    } else {
      // If user doesn't exist, create a new record
      const newRecord = {
        id: records.length + 1, // Generate new ID
        name,
        workouts: [{ type: workOutType, minutes: workOutMinute }],
      };
      records.push(newRecord);
    }

    // Save the updated records back to localStorage
    this.setWorkOutRecords(records);
  }
}
