import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { WorkoutService } from '../../services/workout.service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    InputText,
    SelectModule,
    FormsModule,
    DialogModule,
    FloatLabel,
    InputNumberModule,
    ChartModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private workoutService: WorkoutService) {}
  @ViewChild('dt2') dt2: Table | undefined;
  totalWorkOutRecords: number = 0;
  totalWorkOutTypes: any[] = [];
  totalUsersMinutes: number = 0;
  selectedWorkOutType: string = '';
  columns: any[] = [
    {
      field: 'name',
      header: 'Name',
    },
    {
      field: 'workouts',
      header: 'Workouts',
    },
    {
      field: 'workouts.type',
      header: 'Workouts',
    },
    {
      field: 'workouts.minutes',
      header: 'Total Workout Minutes',
    },
    {
      field: '',
      header: 'Actions',
    },
  ];

  workOutRecords: any[] = [];

  userName: string = '';
  workOutType: string = '';
  workOutMinute: number = 0;
  filteredWorkOutRecords: any[] = [];
  workOutDialog: boolean = false;
  reportDialog: boolean = false;

  ngOnInit(): void {
    this.loadWorkOutRecords();
    this.totalWorkOutRecords = this.workOutRecords.length;
    this.totalWorkOutTypes = this.getUniqueWorkoutTypes();
    this.calculateTotalMinutes();
  }

  loadWorkOutRecords(): void {
    this.workOutRecords = this.workoutService.getWorkOutRecords();
    this.filteredWorkOutRecords = [...this.workOutRecords];
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
    );

    return [...new Set(allWorkoutTypes)];
  }

  calculateTotalMinutes(): void {
    this.totalUsersMinutes = this.workOutRecords.reduce((sum, record) => {
      return (
        sum +
        record.workouts.reduce(
          (workoutSum: any, workout: { minutes: any }) =>
            workoutSum + workout.minutes,
          0
        )
      );
    }, 0);
  }

  onGlobalFilter(event: any): void {
    const searchTerm = event.target.value;
    if (this.dt2) {
      this.dt2.filterGlobal(searchTerm, 'contains');
    }
  }

  filterByWorkoutType(workOutType: string) {
    if (!workOutType) {
      this.filteredWorkOutRecords = [...this.workOutRecords];
    } else {
      this.filteredWorkOutRecords = this.workOutRecords.filter((user) =>
        user.workouts.some(
          (workout: { type: string }) => workout.type === workOutType
        )
      );
    }
  }

  showAddWorkOutDialog() {
    this.workOutDialog = true;
  }

  addWorkOut() {
    if (!this.isFormValid()) {
      return;
    }

    const newWorkout = {
      id: this.workOutRecords.length + 1,
      name: this.userName,
      workouts: [{ type: this.workOutType, minutes: this.workOutMinute }],
    };

    this.workoutService.addWorkOutRecord(
      this.userName,
      this.workOutType,
      this.workOutMinute
    );
    this.userName="";
    this.workOutType="",
    this.workOutMinute=0;
    this.workOutDialog = false;
    this.loadWorkOutRecords();
    this.calculateTotalMinutes();
    this.totalWorkOutRecords = this.workOutRecords.length;
  }

  isFormValid(): boolean {
    return (
      !!this.userName &&
      !!this.workOutType &&
      !!this.workOutMinute &&
      this.workOutMinute > 0
    );
  }
  userReportData = {
    name: '',
    workouts: [] as { type: string; minutes: number }[],
  };
  
  barChartData: any = {}; // Store transformed chart data
  
  showReportDialog(userData: { name: string; workouts: { type: string; minutes: number }[] }) {
    this.reportDialog = true;
    this.userReportData = { ...userData };
    this.prepareChartData(); // Convert workout data into chart format
  }
  
  prepareChartData() {
    this.barChartData = {
      labels: this.userReportData.workouts.map(workout => workout.type), // Workout types as labels
      datasets: [
        {
          label: 'Workout Minutes',
          backgroundColor: '#42A5F5',
          data: this.userReportData.workouts.map(workout => workout.minutes), // Minutes as dataset
        },
      ],
    };
  }

  barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000',
        },
        grid: {
          color: '#dee2e6',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#000',
        },
        grid: {
          color: '#dee2e6',
        },
      },
    },
  };
}
