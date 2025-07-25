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


// ✅ This is required by Angular prerenderer!
export function getPrerenderParams() {
  const courseIds = ['1', '2', '3'];

  return [
    ...courseIds.map(id => ({
      route: `courses/${id}`,
      params: { id },
    })),
    ...courseIds.map(courseId => ({
      route: `courses/${courseId}/lessons`,
      params: { courseId },
    })),
  ];
}