import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseHttpService } from '@services/base-http.service';

interface QueryParams {
  name: string;
  page: number | undefined;
  size: number | undefined;
}

interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Clients {
  id: string;
  clientId: string;
  clientIdIssuedAt: string;
  clientSecret: string;
  clientSecretExpiresAt: string;
  clientName: string;
  clientAuthenticationMethods: string;
  authorizationGrantTypes: string;
  redirectUris: string;
  postLogoutRedirectUris: string;
  scopes: string;
  clientSettings: string;
  tokenSettings: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  http = inject(BaseHttpService);

  getPage(params: QueryParams): Observable<PageResult<Clients>> {
    return this.http.get('/client/manager/page', params);
  }

  getOne(id: string): Observable<Clients> {
    return this.http.get('/client/manage/get', { id });
  }

  save(client: Clients): Observable<Clients> {
    return this.http.post('/client/manage/save', client);
  }

  delete(id: string): Observable<any> {
    return this.http.post('/client/manage/delete', { id: id });
  }
}
