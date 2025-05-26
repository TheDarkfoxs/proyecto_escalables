import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Game, GameResponse } from "../models/game.model"

@Injectable({
  providedIn: "root",
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`

  constructor(private http: HttpClient) {}

  getAllGames(params?: any): Observable<GameResponse> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key])
        }
      })
    }

    return this.http.get<GameResponse>(this.apiUrl, { params: httpParams })
  }

  getGameById(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`)
  }

  getFeaturedGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/featured`)
  }

  createGame(gameData: any): Observable<any> {
    const formData = new FormData()

    // Agregar campos de texto
    Object.keys(gameData).forEach((key) => {
      if (key !== "images") {
        if (Array.isArray(gameData[key])) {
          gameData[key].forEach((item: any) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, gameData[key])
        }
      }
    })

    // Agregar imágenes
    if (gameData.images && gameData.images.length > 0) {
      gameData.images.forEach((file: File) => {
        formData.append("images", file)
      })
    }

    return this.http.post(this.apiUrl, formData)
  }

  updateGame(id: string, gameData: any): Observable<any> {
    const formData = new FormData()

    Object.keys(gameData).forEach((key) => {
      if (key !== "images") {
        if (Array.isArray(gameData[key])) {
          gameData[key].forEach((item: any) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, gameData[key])
        }
      }
    })

    if (gameData.images && gameData.images.length > 0) {
      gameData.images.forEach((file: File) => {
        formData.append("images", file)
      })
    }

    return this.http.put(`${this.apiUrl}/${id}`, formData)
  }

  deleteGame(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
