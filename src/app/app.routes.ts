import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'register',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
    },

    {
        path: 'teams',
        loadComponent: () => import('./teams/teams-list/teams-list').then(m => m.TeamsList),
        canActivate: [authGuard],
        children: [
            {
                path: 'create',
                loadComponent: () => import('./teams/create-team/create-team').then(m => m.CreateTeam)
            },
            {
                path: 'add-member/:teamId',
                loadComponent: () => import('./teams/add-friend/add-friend').then(m => m.AddFriend)
            }
        ]
    },

    {
        path: 'teams/:teamId',
        loadComponent: () => import('./projects/project-list/project-list').then(m => m.ProjectList),
        canActivate: [authGuard],
        children: [
            {
                path: 'add-project',
                loadComponent: () => import('./projects/add-project/add-project').then(m => m.AddProject)
            }
        ]
    },
    {
        path: 'projects/:projectId',
        loadComponent: () => import('./tasks/task-list/task-list').then(m => m.TaskList),
        canActivate: [authGuard],
        children: [
            {
                path: 'add-task',
                loadComponent: () => import('./tasks/add-task/add-task').then(m => m.AddTask)
            },
            {
                path: 'edit/:taskId',
                loadComponent: () => import('./tasks/update-task/update-task').then(m => m.UpdateTask)
            },
            {
                path: 'comments/:taskId',
                loadComponent: () => import('./comments/comment-list/comment-list').then(m => m.CommentList)
            }
        ]
    },
    {
        path: '404',
        loadComponent: () => import('./core/not-found/not-found').then(m => m.NotFound)
    },
    {
        path: '**',
        redirectTo: '404'
    }

];