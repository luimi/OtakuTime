import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'anime',
    loadChildren: () => import('./anime/anime.module').then( m => m.AnimePageModule)
  },
  {
    path: 'latest/:server',
    loadChildren: () => import('./latest/latest.module').then( m => m.LatestPageModule)
  },
  {
    path: 'episode/:server/:url',
    loadChildren: () => import('./episode/episode.module').then( m => m.EpisodePageModule)
  },
  {
    path: 'episodes/:server/:url',
    loadChildren: () => import('./episodies/episodies.module').then( m => m.EpisodiesPageModule)
  },
  {
    path: 'search/:server/:query',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
