import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
// import { Tag } from 'primeng/tag';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { IonContent,IonHeader,IonIcon,IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { addCircleOutline, createOutline, listOutline, settingsOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


interface Item {
  _id: string;
  title: string;
  price?: number;
  contentDescription?: string;
  contentHighlights?: string;
  imageUrl: string;
  type?: string;
  categoryId?: string;
}

interface Category {
  _id: string;
  title: string;
  imageUrl: string;
  items?: Item[];
}

@Component({
  selector: 'app-listings',
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
  standalone: true,
  providers: [MessageService, ApiService], // Add MessageService here
  imports: [
    ButtonModule,
    InputTextModule,
    DialogModule,
    TableModule,
    CommonModule,
    FormsModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    TabViewModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    AccordionModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    RippleModule,
    ConfirmDialogModule ,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    FileUploadModule
  ],
})
export class ListingsPage {
  items: Item[] = [];
  categories: Category[] = [];
  selectedItem: Item = {} as Item;
  selectedCategory: Category = {} as Category;
  
  itemDialog: boolean = false;
  categoryDialog: boolean = false;
  deleteItemDialog: boolean = false;
  deleteCategoryDialog: boolean = false;
  treatments: any[] = [];
  id:string = '';
  activeIndex: number = 0;
  submitted: boolean = false;
  treatmentForm: FormGroup; // Reactive form for treatment
  categoryTreatment:any
  constructor(private messageService: MessageService,private fb: FormBuilder,private http:HttpClient, private apiService: ApiService,private cdr: ChangeDetectorRef) {
    this.treatmentForm = this.fb.group({
      title: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      contentDescription: ['', [Validators.required]],
      contentHighlights: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      type: ['PACKAGE', [Validators.required]],
      categoryId: null
    });
    addIcons({createOutline, settingsOutline, listOutline });
     addIcons({
          'create-outline': createOutline,
          'trash-outline': trashOutline,
          'add-circle-outline': addCircleOutline,
        });

  }

  
  ngOnInit() {
    this.fetchAllTreatments();
  }
  
  fetchCategories() {
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response;
        this.updateCategoryTreatment();
      },
      error: (error:any) => {  
        console.error('Error fetching categories:', error);
        // this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',     
       })
    }});
  }
  
  fetchAllTreatments() {
    this.apiService.getTreatments().subscribe({
      next: (response: any) => {
        this.treatments = response;
        // this.filterData();
        // this.loading = false;
        this.fetchCategories()
      },
      error: (error) => {
        console.error('Error fetching treatments:', error);
      }
    });
  }
  openNew(type: string, categoryId?: string) {
    this.treatmentForm.reset();
    this.submitted = false;
    if (type === 'PACKAGE') {
      this.treatmentForm.reset();
      this.treatmentForm.patchValue({ type: 'PACKAGE' });
      this.selectedItem = {
        _id: '',
        title: '',
        price: 0,
        contentDescription: '',
        contentHighlights: '',
        imageUrl: '',
        type: 'PACKAGE'
      };
      this.submitted = false;
      this.itemDialog = true;
    } else if (type === 'OFFER') {
      this.treatmentForm.patchValue({ type: 'OFFER' });
      this.selectedItem = {
        _id: '',
        title: '',
        price: 0,
        contentDescription: '',
        contentHighlights: '',
        imageUrl: '',
        type: 'OFFER'
      };
      this.itemDialog = true;
    } else if (type === 'TREATMENT') {
      this.treatmentForm.patchValue({ type: 'TREATMENT',categoryId: categoryId || null });
      this.selectedItem = {
        _id: '',
        title: '',
        price: 0,
        contentDescription: '',
        contentHighlights: '',
        imageUrl: '',
        categoryId: categoryId || undefined, // Associate with the selected category
        type: 'OFFER'
      };
      this.itemDialog = true;
    } 
    
    else if (type === 'CATEGORY') {
      // this.treatmentForm.patchValue({ type: 'TREATMENT' });
      this.selectedCategory = {
        _id: '',
        title: '',
        imageUrl: ''
      };
      this.categoryDialog = true;
    } else if(type === 'TREATMENT') {
      this.treatmentForm.patchValue({
        type: 'TREATMENT',
        categoryId: categoryId || null, // Associate with the selected category
      });
      this.selectedItem = {
        _id: '',
        title: '',
        price: 0,
        contentDescription: '',
        contentHighlights: '',
        imageUrl: '',
        type: 'TREATMENT'
      };
      this.itemDialog = true;
    } 
  }

  UpdateCategoryTreatment() {
    this.categoryTreatment = this.treatments.filter((item: any) => item.type === "TREATMENT");
  }



  
  editItem(treatment: Item) {
    this.selectedItem = { ...treatment }; // Clone the selected item
    this.treatmentForm.patchValue({
      title: treatment.title,
      price: treatment.price,
      contentDescription: treatment.contentDescription,
      contentHighlights: treatment.contentHighlights,
      imageUrl: treatment.imageUrl,
      type: treatment.type,
      categoryId: treatment.categoryId,
    });
    this.id=treatment._id;
    this.itemDialog = true; // Open the dialog
    this.submitted = false; // Reset the submitted flag
  }
  
  editCategory(category: Category) {
    this.selectedCategory = {...category};
    this.categoryDialog = true;
  }
  
  deleteItem(treatment: Item) {
    this.deleteItemDialog = true;
    this.id = treatment._id;
    console.log(treatment)
    this.selectedItem = {...treatment};
  }
  
  deleteCategory(category: Category) {
    this.deleteCategoryDialog = true;
    this.selectedCategory = {...category};
  }

  updateCategoryTreatment() {
    this.categoryTreatment = this.treatments.filter((item: any) => item.type === "TREATMENT");
    this.cdr.detectChanges(); // Force Angular to detect changes

  }
  
  saveTreatment() {
    this.submitted = true;
  
    if (this.treatmentForm.invalid) {
      return;
    }
  
    const treatmentData = this.treatmentForm.value;
  
    if (this.selectedItem._id) {
      // Update Treatment
      this.apiService.updateTreatment(this.selectedItem._id, treatmentData).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Treatment Updated',
            life: 3000,
          });
          this.fetchAllTreatments();
          this.itemDialog = false;
          this.treatmentForm.reset();
          this.submitted = false;
        },
        error: (error: any) => {
          console.error('Error updating treatment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update treatment',
            life: 3000,
          });
        },
      });
    } else {
      // Create Treatment
      this.apiService.createTreatment(treatmentData).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Treatment Created',
            life: 3000,
          });
          this.fetchAllTreatments();
          this.itemDialog = false;
          this.treatmentForm.reset();
          this.submitted = false;
        },
        error: (error: any) => {
          console.error('Error creating treatment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create treatment',
            life: 3000,
          });
        },
      });
    }
  }

  confirmDeleteItem() {
    this.apiService.deleteTreatment(this.selectedItem._id).subscribe({
      next: (response: any) => {
        console.log('Treatment deleted successfully:', response);
        this.fetchAllTreatments();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Treatment Deleted',
          life: 3000,
        });
      },
      error: (error: any) => {
        console.error('Error deleting treatment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete treatment',
          life: 3000,
        });
      },
    });
  
    this.deleteItemDialog = false;
    this.selectedItem = {} as Item;
  }
  
  confirmDeleteCategory() {
    this.apiService.deleteCategory(this.selectedCategory._id).subscribe({
      next: (response: any) => {
        this.categories = this.categories.filter(
          (category) => category._id !== this.selectedCategory._id
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category Deleted',
          life: 3000,
        });
        this.deleteCategoryDialog = false;
        this.selectedCategory = {} as Category;
      },
      error: (error: any) => {
        console.error('Error deleting category:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete category',
          life: 3000,
        });
      },
    });
  }
  
  hideDialog() {
    this.itemDialog = false;
    this.categoryDialog = false;
    this.submitted = false;
  }
  
  saveItem() {
    this.submitted = true;  
    if (this.selectedItem.title.trim()) {
      if (this.selectedItem._id) {
        // Update existing item
        const index = this.findIndexById(this.selectedItem._id, this.items);
        if (index !== -1) {
          this.items[index] = this.selectedItem;
          
          // Update in category items if applicable
          if (this.selectedItem.categoryId) {
            const category = this.categories.find(c => c._id === this.selectedItem.categoryId);
            if (category && category.items) {
              const catItemIndex = this.findIndexById(this.selectedItem._id, category.items);
              if (catItemIndex !== -1) {
                category.items[catItemIndex] = this.selectedItem;
              } else {
                category.items.push(this.selectedItem);
              }
            }
          }
          
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item Updated', life: 3000});
        }
      } else {
        // Create new item
        // this.selectedItem._id = this.generateId();
        this.items.push(this.selectedItem);
        
        // Add to category items if applicable
        if (this.selectedItem.categoryId) {
          const category = this.categories.find(c => c._id === this.selectedItem.categoryId);
          if (category) {
            if (!category.items) category.items = [];
            category.items.push(this.selectedItem);
          }
        }
        
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item Created', life: 3000});
      }
      
      this.items = [...this.items];
      this.itemDialog = false;
      this.selectedItem = {} as Item;
    }
  }

  onGlobalFilter(event: Event, dataTable: any) {
    const input = event.target as HTMLInputElement;
    dataTable.filterGlobal(input.value, 'contains');
  }
  
  saveCategory() {
    this.submitted = true;
  
    if (!this.selectedCategory.title.trim()) {
      return;
    }
  
    if (this.selectedCategory._id) {
      // Update Category
      this.apiService.updateCategory(this.selectedCategory._id, this.selectedCategory).subscribe({
        next: (response: any) => {
          const index = this.findIndexById(this.selectedCategory._id, this.categories);
          if (index !== -1) {
            this.categories[index] = response;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category Updated',
            life: 3000,
          });
          this.categoryDialog = false;
          this.selectedCategory = {} as Category;
        },
        error: (error: any) => {
          console.error('Error updating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update category',
            life: 3000,
          });
        },
      });
    } else {
      // Create Category
      this.apiService.createCategory(this.selectedCategory).subscribe({
        next: (response: any) => {
          this.categories.push(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category Created',
            life: 3000,
          });
          this.categoryDialog = false;
          this.selectedCategory = {} as Category;
        },
        error: (error: any) => {
          console.error('Error creating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create category',
            life: 3000,
          });
        },
      });
    }
  }
  
  findIndexById(id: string, array: any[]): number {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i]._id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  getCategoryTreatments(categoryId: string): any[] {
    return this.categoryTreatment?.filter((treatment:any) => treatment.categoryId === categoryId) || [];
  }
  


  getFilteredItems(type: string): Item[] {
    return this.treatments.filter(item => item.type === type);
  }

  getHighlightsArray(highlights: string): string[] {
    return highlights ? highlights.split('\n').map(h => h.trim()).filter(h => h) : [];
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
}