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

  createGame(game: Game): Observable<any> {
    return this.http.post(this.apiUrl, game)
  }

  updateGame(id: string, game: Partial<Game>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, game)
  }

  deleteGame(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
