import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpService } from '../../http.service';
import { IEmployee } from '../../interfaces/employee';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  formBuilder = inject(FormBuilder);
  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  employeeForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    age: [0, [Validators.required, Validators.min(18)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    salary: [0, [Validators.required, Validators.min(10000)]],
  });
  employeeId!: number;
  isEdit = false;

  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.isEdit = true;
      this.httpService.getEmployee(this.employeeId).subscribe((res) => {
        this.employeeForm.patchValue({
          name: res.name,
          email: res.email,
          age: res.age,
          phone: res.phone,
          salary: res.salary,
        });
      });
    }
  }

  save() {
    const employee: IEmployee = {
      name: this.employeeForm.value.name!,
      age: this.employeeForm.value.age!,
      email: this.employeeForm.value.email!,
      phone: this.employeeForm.value.phone!,
      salary: this.employeeForm.value.salary!,
    };
    if (this.isEdit) {
      this.httpService
        .updateEmployee(this.employeeId, employee)
        .subscribe((res) => {
          console.log(res);
          this.router.navigateByUrl('/employee-list');
        });
    } else {
      this.httpService.createEmployee(employee).subscribe((res) => {
        console.log(res);
        this.router.navigateByUrl('/employee-list');
      });
    }
  }
}
