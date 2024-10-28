// src/auth/zanzibar.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZanzibarService {
  private readonly BASE_URL = 'https://zanzibar-api-url';

  async checkPermission(accessKeyId: string, secretAccessKey: string, permission: string, resource: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.BASE_URL}/access-keys/check-permission`, {
        access_key_id: accessKeyId,
        secret_access_key: secretAccessKey,
        permission,
        resource,
      });
      return response.data.has_permission;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  async assignPermission(userId: string, permission: string, resource: string) {
    await axios.post(`${this.BASE_URL}/permissions/assign`, {
      user: userId,
      permission,
      resource,
    });
  }

  async getUserFromAccessKey(accessKeyId: string, secretAccessKey: string): Promise<string | null> {
    try {
      const response = await axios.post(`${this.BASE_URL}/access-keys/get-user`, {
        access_key_id: accessKeyId,
        secret_access_key: secretAccessKey,
      });
      return response.data.user_id;
    } catch (error) {
      console.error('User fetch failed:', error);
      return null;
    }
  }
}
