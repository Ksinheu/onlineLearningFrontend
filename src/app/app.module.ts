import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
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
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderService } from './Services/order.service';
import { PersonalComponent } from './personal/personal.component';
import { MylessonComponent } from './mylesson/mylesson.component';
import { ContactComponent } from './contact/contact.component';
// import { routes } from './app.routes';
import { OtpLoginComponent } from './auth/otp-login/otp-login.component';
import { FooterComponent } from './footer/footer.component';
import { FooterDashboardComponent } from './footer-dashboard/footer-dashboard.component';
import { NewNewsComponent } from './new-news/new-news.component';
import { InvioceComponent } from './invioce/invioce.component';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
  {path:'courses',component:CoursesComponent},
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
  {path:'new-news',component:NewNewsComponent},
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'courses/:courseId/lessons', component: LessonComponent },
  {path:'purchase/:id',component:PurchaseComponent},
  {path:'invoice',component:InvioceComponent}
];
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
    PersonalComponent,
    MylessonComponent,
    ContactComponent,
    ForgotPasswordComponent,
    OtpLoginComponent,
    FooterComponent,
    FooterDashboardComponent,
    NewNewsComponent,
    InvioceComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    OrderService,
    // provideClientHydration(withEventReplay()),
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
// ✅ This is required by Angular prerenderer!
export function getPrerenderParams() {
  const courseIds = ['1', '2', '3'];
  const purchaseIds = ['100', '101', '102']; // Replace with actual or dummy purchase IDs

  return [
    ...courseIds.map(id => ({
      route: `courses/${id}`,
      params: { id },
    })),
    ...courseIds.map(courseId => ({
      route: `courses/${courseId}/lessons`,
      params: { courseId },
    })),
    ...purchaseIds.map(id => ({
      route: `purchase/${id}`,
      params: { id },
    })),
  ];
}
