import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, tap } from "rxjs"
import { environment } from "../../environments/environment"
import { User, AuthResponse, LoginRequest, RegisterRequest } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user))
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response) => {
        this.setAuthData(response.token, response.user)
      }),
    )
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setAuthData(response.token, response.user)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`)
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUserSubject.next(user)
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value
    return user?.role === "admin"
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }
}
