import { Component } from '@angular/core';
import { IEmployee } from '../../interfaces/employee';
import { HttpService } from '../../http.service';
import { inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  employeeList: IEmployee[] = [];
  httpService = inject(HttpService);
  router = inject(Router);
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'age',
    'phone',
    'salary',
    'action',
  ];
  ngOnInit() {
    this.httpService.getAllEmployee().subscribe((result) => {
      console.log(result);
      this.employeeList = result;
    });
  }
  edit(id: number) {
    console.log(id);
    this.router.navigateByUrl('/employee/' + id);
  }
  delete(id: number) {
    console.log(id);
    this.httpService.deleteEmployee(id).subscribe(() => {
      console.log('Deleted Successfully');
      this.employeeList = this.employeeList.filter((emp) => emp.id !== id);
    });
  }
}
