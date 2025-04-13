import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { addIcons } from 'ionicons';
import { addCircleOutline, chevronDownOutline, chevronForwardOutline, createOutline, trashOutline } from 'ionicons/icons';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { DatePicker } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
interface User {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  address: {
    flat: string;
    area: string;
    landmark: string;
    pincode: string;
    city: string;
  };
  bookings: Booking[];
}

interface Booking {
  _id: string;
  title: string;
  price: number;
  date: string;
  time: string;
  type: string;
  status: string;
  image?: string;
  treatmentDetails?: {
    title: string;
    price: number;
    type: string;
    contentDescription?: string;
    contentHighlights?: string;
    imageUrl?: string;
  };
  contentDescription?: string;
  contentHighlights?: string;
  imageUrl?: string;
  selectedDate: any,
  selectedSlot:any
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    IonIcon,
    HttpClientModule,
    DropdownModule,
    CalendarModule

  ],
  providers: [MessageService, ConfirmationService,ApiService]
})
export class UsersPage implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  selectedUser: User | null = null;
  selectedBooking: Booking | null = null;
  expandedRows: { [key: string]: boolean } = {};
  editUserDialog: boolean = false;
  deleteUserDialog: boolean = false;
  editBookingDialog: boolean = false;
  deleteBookingDialog: boolean = false;
  statusOptions:any
  constructor(private messageService: MessageService,private apiService: ApiService) {
     addIcons({
              'create-outline': createOutline,
              'trash-outline': trashOutline,
              'add-circle-outline': addCircleOutline,
            });
  }

  ngOnInit() {
    this.fetchAllUsersBookings()
    this.statusOptions = [
      { label: 'CONFIRMED', value: 'confirmed' },
      { label: 'CANCELED', value: 'cancelled' }
    ];
    // this.users = [
    //   {
    //     userId: '67ed1ea7fe642a0048a7af62',
    //     firstName: 'Nutan',
    //     lastName: 'Singh',
    //     phone: 7982712181,
    //     email: 'ajh@gmail.com',
    //     address: {
    //       flat: 'RZ-63, street no 25c',
    //       area: 'indra park palam colony new delhi',
    //       landmark: 'ballia',
    //       pincode: '110045',
    //       city: 'new delhi'
    //     },
    //     bookings: [
    //       {
    //         id: '67ed1eb0fe642a0048a7af67',
    //         title: 'Thai Massage',
    //         price: 1699,
    //         date: 'Feb 20',
    //         time: '11:00 AM',
    //         type: 'TREATMENT',
    //         status: 'confirmed'
    //       },
    //       {
    //         id: '67ed1ee2fe642a0048a7af74',
    //         title: 'Rice facial',
    //         price: 1000,
    //         date: 'Feb 15',
    //         time: '11:00 AM',
    //         type: 'TREATMENT',
    //         status: 'confirmed'
    //       }
    //     ]
    //   },
    //   {
    //     userId: '67ee1234abcd7000ac985aaa',
    //     firstName: 'Rohit',
    //     lastName: 'Mehra',
    //     phone: 9812345678,
    //     email: 'rohit.mehra@example.com',
    //     address: {
    //       flat: 'A-45, Green Apartments',
    //       area: 'Dwarka Sector 22',
    //       landmark: 'Near Metro Station',
    //       pincode: '110077',
    //       city: 'New Delhi'
    //     },
    //     bookings: [
    //       {
    //         id: '67fa1a001e642a0048a7babc',
    //         title: 'Hair Spa',
    //         price: 899,
    //         date: 'Mar 5',
    //         time: '12:00 PM',
    //         type: 'TREATMENT',
    //         status: 'confirmed'
    //       }
    //     ]
    //   }
    // ];
  }

  fetchAllUsersBookings(){
    this.loading=true
    this.apiService.getAllUsersBooking().subscribe((response: any) => { 
      console.log(response);
      this.loading=false
      this.users = response;
    }
    , (error: any) => {
      this.loading=false
      console.error('Error fetching users:', error);
    }
    );
  }


  

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.editUserDialog = true;
  }

  deleteUser(user: User) {
    this.selectedUser = { ...user };
    this.deleteUserDialog = true;
  }

  // confirmDeleteUser() {
  //   if (this.selectedUser) {
  //     this.users = this.users.filter(u => u.userId !== this.selectedUser!.userId);
  //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
  //     this.deleteUserDialog = false;
  //     this.selectedUser = null;
  //   }
  // }

  editBooking(user: User, booking: Booking) {
    console.log(booking);
    
    // Convert date string to Date object
    let bookingDate = null;
    if (booking.selectedDate) {
      bookingDate = new Date(booking.selectedDate);
      // Check if date is valid, if not, set to current date
      if (isNaN(bookingDate.getTime())) {
        bookingDate = new Date();
      }
    } else {
      bookingDate = new Date();
    }
    
    // Convert time string to Date object for proper time display
    let timeDate = new Date();
    if (booking.selectedSlot) {
      const timeParts = booking.selectedSlot.match(/(\d+):(\d+) (\w+)/);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const period = timeParts[3].toUpperCase();
        
        // Convert 12-hour format to 24-hour
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        timeDate.setHours(hours, minutes, 0);
      }
    }
    
    this.selectedBooking = {
      ...booking,
      title: booking.treatmentDetails?.title || '',
      price: booking.treatmentDetails?.price || 0,
      type: booking.treatmentDetails?.type || '',
      contentDescription: booking.treatmentDetails?.contentDescription || '',
      contentHighlights: booking.treatmentDetails?.contentHighlights || '',
      imageUrl: booking.treatmentDetails?.imageUrl || '',
      // Set proper date objects
      selectedDate: bookingDate,
      selectedSlot: timeDate
    };
    
    this.editBookingDialog = true;
  }

  deleteBooking(user: User, booking: Booking) {
    this.selectedBooking = { ...booking };
    this.deleteBookingDialog = true;
  }

  confirmDeleteBooking() {
    this.loading=true
    if (this.selectedBooking) {
    this.apiService.deleteBookings(this.selectedBooking._id).subscribe((response:any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User updated successfully',
      });
      this.loading=false
      this.loadUsers()
    },(error:any) => {
      this.loading=false
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update user',
      });

    });
    


      this.deleteBookingDialog = false;
      this.selectedBooking = null;
    }
  }

 saveBooking() {
  if (this.selectedBooking) {
    // Create a copy of the selectedBooking to avoid modifying the original
    const bookingToSend = { ...this.selectedBooking };
    
    // Format the date if it's a Date object
    if (bookingToSend.selectedDate instanceof Date) {
      bookingToSend.selectedDate = bookingToSend.selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // Format the time if it's a Date object
    if (bookingToSend.selectedSlot instanceof Date) {
      bookingToSend.selectedSlot = bookingToSend.selectedSlot.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    console.log(bookingToSend); // Check the formatted data before sending
    
    this.apiService.updateBookings(bookingToSend._id, bookingToSend).subscribe(
      (response: any) => {     
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Booking updated successfully',
        });
        this.loadUsers();
        this.editBookingDialog = false;
        this.selectedBooking = null;
      },  
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update booking',
        });
      }
    );
  }
}

  // saveUser() {
  //   if (this.selectedUser) {
  //     const userIndex = this.users.findIndex(user => user.userId === this.selectedUser!.userId);

  //     if (userIndex !== -1) {
  //       this.users[userIndex] = { ...this.selectedUser };
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'User updated successfully'
  //       });
  //     }
  //     console.log(this.selectedUser, 'selectedUser');

  //     this.editUserDialog = false;
  //     this.selectedUser = null;
  //   }
  // }
  saveUser() {
    this.loading=true
    if (this.selectedUser) {
      this.apiService.updateUser(this.selectedUser._id, this.selectedUser).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully',
          });
          this.loading=false
          this.editUserDialog = false; // Close the dialog
          this.selectedUser = null; // Clear the selected user
          // Optionally refresh the user list
          this.loadUsers();
        },
        (error) => {
          this.loading=false
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user',
          });
        }
      );
    }
  }

  confirmDeleteUser() {
    this.loading=true
    if (this.selectedUser) {
      this.apiService.deleteUser(this.selectedUser._id).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User and associated bookings deleted successfully',
          });
          this.loading=false
          this.loadUsers(); // Refresh the user list
          this.deleteUserDialog = false; // Close the dialog
          this.selectedUser = null; // Clear the selected user
          // Remove the user from the local list
          this.users = this.users.filter((user) => user._id !== response._id);
        },
        (error) => {
          this.loading=false
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user',
          });
        }
      );
    }
  }

  loadUsers() {
    this.loading=true
    this.apiService.getAllUsersBooking().subscribe(
      (response) => {
        this.loading=false
        this.users = response;
      },
      (error) => {
        this.loading=false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
        });
      }
    );
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getFullAddress(address: any): string {
    return `${address.flat}, ${address.area}, ${address.city}, ${address.pincode}`;
  }

//  // Fix expandAll method
//  expandAll() {
//   this.expandedRows = {};
//   this.users.forEach(user => {
//     this.expandedRows[user.userId] = true;
//   });
//   // Force change detection if needed
//   this.expandedRows = { ...this.expandedRows };
// }

// // Fix collapseAll method
// collapseAll() {
//   this.expandedRows = {};
// }

toggleRow(user: User) {
  this.expandedRows[user.userId] = !this.expandedRows[user.userId];
  this.expandedRows = { ...this.expandedRows }; // Trigger change detection
}

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'warn';
      case 'outofstock':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusSeverity(status: string) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'warn';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }

  onRowExpand(event: TableRowExpandEvent) {
    const user = event.data as User;
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Row Expanded', 
      detail: `${user.firstName} ${user.lastName}`, 
      life: 3000 
    });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const user = event.data as User;
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Row Collapsed', 
      detail: `${user.firstName} ${user.lastName}`, 
      life: 3000 
    });
  }

  onDateChange(event: any) {
    // Convert the date to the required format (e.g., "Apr 13, 2025")
    const selectedDate = new Date(event);
    if (this.selectedBooking) {
      this.selectedBooking.selectedDate = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
  }
}
  
  onTimeChange(event: any) {
    // Convert the time to the required format (e.g., "11:30 AM")
    const [hours, minutes] = event.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    if(this.selectedBooking)
    {
      this.selectedBooking.selectedSlot = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
 
  }
}