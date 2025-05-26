import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Post, PostResponse } from "../models/post.model"

@Injectable({
  providedIn: "root",
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`

  constructor(private http: HttpClient) {}

  getAllPosts(params?: any): Observable<PostResponse> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key])
        }
      })
    }

    return this.http.get<PostResponse>(this.apiUrl, { params: httpParams })
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`)
  }

  createPost(post: Partial<Post>): Observable<any> {
    return this.http.post(this.apiUrl, post)
  }

  updatePost(id: string, post: Partial<Post>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, post)
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  likePost(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {})
  }

  addComment(id: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/comment`, { content })
  }
}
