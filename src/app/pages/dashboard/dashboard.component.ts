import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, TableModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalWorkOutRecords: number = 0;
  totalWorkOutTypes: number = 0;
  totalUsersMinutes: number = 0;
  workOutRecords: any[] = [
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
  ];

  ngOnInit(): void {
    this.totalWorkOutRecords = this.workOutRecords.length;
    this.totalWorkOutTypes = this.getUniqueWorkoutTypes().length;
  }

  getTotalWorkoutMinutes(userId: number): number {
    const user = this.workOutRecords.find((item) => item.id === userId);
    if (user) {
      return user.workouts.reduce(
        (sum: number, workout: { minutes: number }) => sum + workout.minutes,
        0
      );
    }
    return 0;
  }

  getUniqueWorkoutTypes(): string[] {
    const allWorkoutTypes = this.workOutRecords.flatMap((user) =>
      user.workouts.map((workout: { type: any }) => workout.type)
    ); // Flatten all workout types into a single array

    return [...new Set(allWorkoutTypes)]; // Convert to Set to remove duplicates and back to array
  }
}
