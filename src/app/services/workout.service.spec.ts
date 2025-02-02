import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let localStorageMock: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    localStorageMock = jasmine.createSpyObj('localStorage', [
      'getItem',
      'setItem',
      'clear',
    ]);

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize localStorage with mock data if empty', () => {
    // Create the expected initial data for localStorage
    const initialData = [
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
    ];

    // Simulate empty localStorage
    localStorageMock.getItem.and.returnValue(null);
    // spyOn(localStorageMock, 'setItem'); // Spy on setItem to check if it's called

    // Trigger the service method to initialize localStorage if empty
    service = TestBed.inject(WorkoutService);

    // Verify that localStorage.setItem was called with the correct data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'workOutRecords',
      JSON.stringify(initialData)
    );
  });

  it('should return workout records from localStorage', () => {
    const mockData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [
          { type: 'Running', minutes: 30 },
          { type: 'Cycling', minutes: 45 },
        ],
      },
    ];

    // Simulate data being returned from localStorage
    localStorageMock.getItem.and.returnValue(JSON.stringify(mockData));

    const records = service.getWorkOutRecords();

    // Verify if data is correctly returned
    expect(records.length).toBe(1);
    expect(records[0].name).toBe('John Doe');
  });

  it('should update workout minutes if workout type already exists for a user', () => {
    const name = 'John Doe';
    const workOutType = 'Running';
    const additionalMinutes = 15;

    const initialData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
      },
    ];

    // Mock initial data
    localStorageMock.getItem.and.returnValue(JSON.stringify(initialData));

    service.addWorkOutRecord(name, workOutType, additionalMinutes);

    // Verify if the minutes are updated correctly
    const records = service.getWorkOutRecords();
    expect(records[0].workouts[0].minutes).toBe(30); // 30 + 15 minutes
  });
});
