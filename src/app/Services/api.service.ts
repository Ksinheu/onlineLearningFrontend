import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl= 'http://127.0.0.1:8000/api';
  constructor(private http:HttpClient) { }
  
  register(data: any): Observable<any> {
    const deviceInfo = this.collectDeviceInfo();
    const fullData = {
      ...data,
      ...deviceInfo
    };

    return this.http.post<any>(`${this.apiUrl}/customerRegister`, fullData);
  }
  Login(email:string, password:string): Observable<any> {
    const loginData={
      email:email,
      password:password
    }
    return this.http.post<any>(`${this.apiUrl}/login`,loginData);
  }
  private collectDeviceInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Browser detection using regular expressions
    const browserMap = {
        'Chrome': /Chrome\/(\S+)/,
        'Firefox': /Firefox\/(\S+)/,
        'MSIE': /MSIE (\S+);/,
        'Edge': /Edge\/(\S+)/,
        'Safari': /Version\/(\S+) Safari\//
    };

    // Iterate over browserMap to find a match for the current browser
    for (const [name, regex] of Object.entries(browserMap)) {
        const match = userAgent.match(regex);
        if (match) {
            browserName = name;
            browserVersion = match[1];
            break;
        }
    }

    // Attempt to detect the operating system from navigator.platform
    const osMatch = /Windows|Mac|Linux/.exec(navigator.platform);
    const operatingSystem = osMatch ? osMatch[0] : 'Unknown';

    return {
        device_type: navigator.platform,
        operating_system: operatingSystem,
        browser_name: browserName,
        browser_version: browserVersion,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        ip_address: '127.0.0.1', // Placeholder, actual IP should be collected server-side
        location: 'Unknown', // Placeholder, precise location should be handled more securely
        // last_used: new Date().toISOString()
    };
  }

}
