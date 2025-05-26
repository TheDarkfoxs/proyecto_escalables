import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { GamesComponent } from "./pages/games/games.component"
import { CommunityComponent } from "./pages/community/community.component"
import { SupportComponent } from "./pages/support/support.component"
import { StoreComponent } from "./pages/store/store.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { LoginComponent } from "./pages/login/login.component"
import { RegisterComponent } from "./pages/register/register.component"
import { AdminComponent } from "./pages/admin/admin.component"
import { AuthGuard } from "./guards/auth.guard"
import { AdminGuard } from "./guards/admin.guard"

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "games", component: GamesComponent },
  { path: "community", component: CommunityComponent },
  { path: "support", component: SupportComponent },
  { path: "store", component: StoreComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
