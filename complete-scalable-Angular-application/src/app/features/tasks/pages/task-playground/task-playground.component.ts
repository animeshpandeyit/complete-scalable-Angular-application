import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-playground',
  standalone: true,
  imports: [],
  templateUrl: './task-playground.component.html',
  styleUrl: './task-playground.component.css',
})
export class TaskPlaygroundComponent implements OnInit {
  tasks: Task[] = [];
  tasksTitle: string[] = [];

  private taskService = inject(TaskService);

  ngOnInit(): void {
    // of(): one emission containing the array
    this.taskService.getTasksUsingOf().subscribe((tasks) => {
      console.log('Using of():', tasks);
    });

    // from(): individual task emissions
    this.taskService.getTasksUsingFrom().subscribe((task) => {
      console.log('Using from():', task);
      this.tasks = [...this.tasks, task];
    });

    this.taskService.getTaskTitlesUsingFrom().subscribe((title) => {
      console.log('title Using from():', title);

      this.tasksTitle = [...this.tasksTitle, title];
    });
  }
}
