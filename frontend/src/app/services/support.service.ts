import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Support, SupportResponse } from "../models/support.model"

@Injectable({
  providedIn: "root",
})
export class SupportService {
  private apiUrl = `${environment.apiUrl}/support`

  constructor(private http: HttpClient) {}

  getAllSupport(params?: any): Observable<SupportResponse> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key])
        }
      })
    }

    return this.http.get<SupportResponse>(this.apiUrl, { params: httpParams })
  }

  getSupportById(id: string): Observable<Support> {
    return this.http.get<Support>(`${this.apiUrl}/${id}`)
  }

  createSupport(support: Partial<Support>): Observable<any> {
    return this.http.post(this.apiUrl, support)
  }

  updateSupport(id: string, support: Partial<Support>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, support)
  }

  deleteSupport(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  markHelpful(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/helpful`, {})
  }
}
