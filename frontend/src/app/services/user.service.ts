import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`

  constructor(private http: HttpClient) {}

  getAllUsers(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params })
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
  }

  updateUser(id: string, user: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  purchaseGame(gameId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/purchase/game`, { gameId })
  }

  purchaseMerchandise(merchandiseId: string, quantity = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/purchase/merchandise`, { merchandiseId, quantity })
  }
}
