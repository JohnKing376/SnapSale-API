export interface IOtpToken {
  token: number;
  isRevoked: boolean;
  purpose: string;
  userId: number;
  expiresAt: Date;
}
