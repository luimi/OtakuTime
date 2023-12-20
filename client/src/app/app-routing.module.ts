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
    path: 'search/:type/:query',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then( m => m.GroupsPageModule)
  },
  {
    path: 'group/:index',
    loadChildren: () => import('./group/group.module').then( m => m.GroupPageModule)
  },
  {
    path: 'manga',
    loadChildren: () => import('./manga/manga.module').then( m => m.MangaPageModule)
  },
  {
    path: 'season',
    loadChildren: () => import('./season/season.module').then( m => m.SeasonPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules , useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
