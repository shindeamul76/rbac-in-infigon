

export interface AccessTokenPayload {
  userId: number;
  role: any;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenVersion: number;
}