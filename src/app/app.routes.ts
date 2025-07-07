import { Routes } from '@angular/router';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { LessonComponent } from './lesson/lesson.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SliderComponent } from './slider/slider.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsComponent } from './news/news.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentComponent } from './payment/payment.component';
import { PersonalComponent } from './personal/personal.component';
import { MylessonComponent } from './mylesson/mylesson.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { OtpLoginComponent } from './auth/otp-login/otp-login.component';
import { NewNewsComponent } from './new-news/new-news.component';

export const routes: Routes = [
  // { path: '', component: AppComponent },
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
  {path:'payment',component:PaymentComponent},
  {path:'personal',component:PersonalComponent},
  {path:'myLesson',component:MylessonComponent},
  {path:'contact',component:ContactComponent},
  {path:'lesson',component:LessonComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},
  { path: 'login-otp', component: OtpLoginComponent },
  { path: 'lesson/:courseId', component: LessonComponent },
  {path:'new-news',component:NewNewsComponent},
];
