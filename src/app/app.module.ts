import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { SliderComponent } from './slider/slider.component';
import { TestSideBarComponent } from './test-side-bar/test-side-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBar2Component } from './side-bar2/side-bar2.component';
import { NewsComponent } from './news/news.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { CoursesComponent } from './courses/courses.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { LessonComponent } from './lesson/lesson.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
const router:Routes=[
 {path:'course',component:CoursesComponent},
 {
  path: 'courses/:id',
  component: CourseDetailComponent
},
 {path:'lesson',component:LessonComponent},
{path:'purchase',component:PurchaseComponent},
{path:'login',component:LoginComponent},
{path:'signup',component:SignupComponent},
{path:'',component:HomeComponent},
{path:'slider',component:SliderComponent},
{path:'deshboard',component:DashboardComponent},
{path:'news',component:NewsComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    SliderComponent,
    TestSideBarComponent,
    DashboardComponent,
    SideBar2Component,
    NewsComponent,
    ProgressTrackerComponent,
    CoursesComponent,
    PurchaseComponent,
    LessonComponent,
    CourseDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
   
    RouterModule.forRoot(router)
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
