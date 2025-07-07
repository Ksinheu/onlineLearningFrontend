import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { LessonComponent } from './lesson/lesson.component';
import { NewsComponent } from './news/news.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentComponent } from './payment/payment.component';
import { AuthGuard } from './guards/auth.guard';
import { PersonalComponent } from './personal/personal.component';
import { MylessonComponent } from './mylesson/mylesson.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { OtpLoginComponent } from './auth/otp-login/otp-login.component';
import { NewNewsComponent } from './new-news/new-news.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: 'courses/:id', component: CourseDetailComponent, canActivate: [AuthGuard] },
  { path: 'purchase/:id', component: PurchaseComponent, canActivate: [AuthGuard] },
  { path: 'payment_method', component: PaymentMethodComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'courses/:courseId/lessons', component: LessonComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'personal', component: PersonalComponent },
  {path:'myLesson',component:MylessonComponent},
  {path:'contact',component:ContactComponent},
  { path: 'lesson/:courseId', component: LessonComponent },
  {path:'forgot-password',component:ForgotPasswordComponent},
  { path: 'login-otp', component: OtpLoginComponent},
  {path:'new-news',component:NewNewsComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
