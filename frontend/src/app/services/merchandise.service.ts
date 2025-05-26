import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Merchandise, MerchandiseResponse } from "../models/merchandise.model"

@Injectable({
  providedIn: "root",
})
export class MerchandiseService {
  private apiUrl = `${environment.apiUrl}/merchandise`

  constructor(private http: HttpClient) {}

  getAllMerchandise(params?: any): Observable<MerchandiseResponse> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key])
        }
      })
    }

    return this.http.get<MerchandiseResponse>(this.apiUrl, { params: httpParams })
  }

  getMerchandiseById(id: string): Observable<Merchandise> {
    return this.http.get<Merchandise>(`${this.apiUrl}/${id}`)
  }

  getFeaturedMerchandise(): Observable<Merchandise[]> {
    return this.http.get<Merchandise[]>(`${this.apiUrl}/featured`)
  }

  createMerchandise(merchandiseData: any): Observable<any> {
    const formData = new FormData()

    Object.keys(merchandiseData).forEach((key) => {
      if (key !== "images") {
        if (Array.isArray(merchandiseData[key])) {
          merchandiseData[key].forEach((item: any) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, merchandiseData[key])
        }
      }
    })

    if (merchandiseData.images && merchandiseData.images.length > 0) {
      merchandiseData.images.forEach((file: File) => {
        formData.append("images", file)
      })
    }

    return this.http.post(this.apiUrl, formData)
  }

  updateMerchandise(id: string, merchandiseData: any): Observable<any> {
    const formData = new FormData()

    Object.keys(merchandiseData).forEach((key) => {
      if (key !== "images") {
        if (Array.isArray(merchandiseData[key])) {
          merchandiseData[key].forEach((item: any) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, merchandiseData[key])
        }
      }
    })

    if (merchandiseData.images && merchandiseData.images.length > 0) {
      merchandiseData.images.forEach((file: File) => {
        formData.append("images", file)
      })
    }

    return this.http.put(`${this.apiUrl}/${id}`, formData)
  }

  deleteMerchandise(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
