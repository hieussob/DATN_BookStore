import { TrangThaiDonHang } from './../Enums/Enums';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../services/user.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PaginatorModule } from 'primeng/paginator';

@Pipe({ standalone: true, name: 'formatVnd' })
export class FormatVndPipe implements PipeTransform {
  transform(value: any): string {
    const soTien: number = parseFloat(value);

    // Kiểm tra nếu giá trị là NaN hoặc không phải số
    if (isNaN(soTien)) {
      // Trả về giá trị không thay đổi nếu không phải số
      return value;
    }

    // Định dạng số tiền trong đơn vị VND
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
  }
}
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    FormsModule,
    HttpClientModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    CommonModule,
    CalendarModule,
    RouterModule,
    PaginatorModule,
    FormatVndPipe
  ],
  providers:[
    UserService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  roleLogin: any;
  showForm = false;
  listUser: any;
  TrangThaiDonHang = TrangThaiDonHang;

  body = {
    fullName: '',
    address: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date()
  }
  curUserId: any;
  listCurOrder: any;

  constructor(
    private _userService: UserService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.roleLogin = AuthService.role;
    this.getAll();
  }

  getAll(){
    this._userService.getAllUser().subscribe(data => {
      this.listUser = data;
    })
  }

  resetBody(){
    this.body = {
      fullName: '',
      address: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: new Date()
    };
  }

  showUser(userId: any){
    this.showForm = true;
    this.curUserId = userId;
    this._userService.getUserById(userId).subscribe(data => {
      this.body = data;
      this.body.dateOfBirth = new Date(data.dateOfBirth);
      this.listCurOrder = data.orders
    })
  }

  lockAccount(email: any){
    this.confirmationService.confirm({
      message: 'Bạn chắc chắn muốn xóa bản ghi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: async () => {
        this._userService.lockUser(email).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Khóa tài khoản thành công', life: 3000});
              this.getAll();
          }
        })
      }
    });
  }

  unlockAccount(email: any){
    this.confirmationService.confirm({
      message: 'Bạn chắc chắn muốn xóa bản ghi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: async () => {
        this._userService.unlockUser(email).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Mở khóa tài khoản thành công', life: 3000});
              this.getAll();
          }
        })
      }
    });
  }

}
