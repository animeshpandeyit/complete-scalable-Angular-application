import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, timer } from 'rxjs';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-monitor',
  standalone: true,
  imports: [],
  templateUrl: './task-monitor.component.html',
  styleUrl: './task-monitor.component.css',
})
export class TaskMonitorComponent {
  private destroyRef = inject(DestroyRef);
  counter = 0;
  refreshCount = 0;
  notification = '';

  taskIds: string[] = [];
  taskCount = 0;
  taskCount1 = 0;
  private taskService = inject(TaskService);
  constructor() {}

  ngOnInit(): void {
    // 1. Live counter
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.counter = value + 1;
      });

    // 2. Refresh indicator
    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.refreshCount++;
        console.log('Task status refreshed!');
      });

    // 3. One-time notification
    timer(10000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notification = 'You have a new task update!';
      });

    // range()
    this.taskService.generateTaskIds().subscribe((id) => {
      this.taskIds = [...this.taskIds, id];
    });

    // defer()
    // this.taskService.getTaskCount().subscribe((count) => {
    //   this.taskCount = count;
    //   this.taskCount1 = count;
    // });
    // const taskCount$ = this.taskService.getTaskCount();

    // // First subscription
    // taskCount$.subscribe((count) => {
    //   this.taskCount = count;
    //   console.log('Subscriber 1:', count);
    // });

    // // Second subscription
    // taskCount$.subscribe((count) => {
    //   this.taskCount1 = count;
    //   console.log('Subscriber 2:', count);
    // });

    const taskCount$ = this.taskService.getTaskCount();

    // First subscription
    taskCount$.subscribe((count) => {
      this.taskCount = count;
      console.log('Subscriber 1:', count);
    });

    // Add a new task
    this.taskService.addTask({
      id: 5,
      title: 'Learn defer operator',
      status: 'Pending',
      priority: 'High',
    });

    // Second subscription
    taskCount$.subscribe((count) => {
      this.taskCount1 = count;
      console.log('Subscriber 2:', count);
    });
  }
}
