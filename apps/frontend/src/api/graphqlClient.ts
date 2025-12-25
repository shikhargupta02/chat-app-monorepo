import axios, { AxiosInstance } from 'axios';

const GRAPHQL_ENDPOINT = process.env['GRAPHQL_ENDPOINT'] || 'http://localhost:3000/graphql';

class GraphQLClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: GRAPHQL_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async query<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.post('', {
        query,
        variables,
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0]?.message || 'GraphQL error');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors[0]?.message || 'GraphQL error');
      }
      throw error;
    }
  }

  async mutation<T = any>(mutation: string, variables?: Record<string, any>): Promise<T> {
    return this.query<T>(mutation, variables);
  }
}

export const graphqlClient = new GraphQLClient();

