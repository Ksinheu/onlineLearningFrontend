import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SliderComponent } from './slider/slider.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBar2Component } from './side-bar2/side-bar2.component';
import { NewsComponent } from './news/news.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { CoursesComponent } from './courses/courses.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { LessonComponent } from './lesson/lesson.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderService } from './Services/order.service';
// import { AuthInterceptor } from './auth.interceptor';
import { PaymentComponent } from './payment/payment.component';
NgForm
const router:Routes=[
 {path:'course',component:CoursesComponent},
 {
  path: 'courses/:id',
  component: CourseDetailComponent
},
 {path:'lessons/:courseId', component: LessonComponent},
{path:'purchase/:id',component:PurchaseComponent,canActivate: [AuthGuard]},
{path:'login',component:LoginComponent},
{path:'signup',component:SignupComponent},
{path:'',component:HomeComponent},
{path:'slider',component:SliderComponent},
{path:'dashboard',component:DashboardComponent,canActivate: [AuthGuard]},
{path:'news',component:NewsComponent},
{path:'payment_method',component:PaymentMethodComponent},
{path:'payment',component:PaymentComponent}

]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    HeaderComponent,
    SliderComponent,
    DashboardComponent,
    SideBar2Component,
    NewsComponent,
    ProgressTrackerComponent,
    CoursesComponent,
    PurchaseComponent,
    LessonComponent,
    CourseDetailComponent,
    HomeHeaderComponent,
    PaymentMethodComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(router)
  ],
  providers: [
    OrderService,
    // provideClientHydration(withEventReplay()),
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
