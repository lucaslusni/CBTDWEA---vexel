import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { authTokenInterceptor } from './auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Garante detectacao de mudancas via Zone.js para callbacks async (Firebase, HTTP, Promises)
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),

    // Firebase
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyB2WuYZ9gc4wCQfWyzjMgp-YCn-K-1oJmo",
      authDomain: "vexel-api.firebaseapp.com",
      projectId: "vexel-api",
      storageBucket: "vexel-api.firebasestorage.app",
      messagingSenderId: "1037237354319",
      appId: "1:1037237354319:web:57502ab8a4f3110001cf3a",
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
