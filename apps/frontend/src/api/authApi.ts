import { graphqlClient } from './graphqlClient';

const SIGNUP_MUTATION = `
  mutation SignUp($email: String!, $password: String!, $username: String) {
    signUp(email: $email, password: $password, username: $username) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

export interface SignUpInput {
  email: string;
  password: string;
  username?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  signUp?: {
    token: string;
    user: {
      id: string;
      email: string;
      username?: string;
    };
  };
  login?: {
    token: string;
    user: {
      id: string;
      email: string;
      username?: string;
    };
  };
}

export const authApi = {
  signUp: async (input: SignUpInput) => {
    const data = await graphqlClient.mutation<AuthResponse>(
      SIGNUP_MUTATION,
      input,
    );
    return data.signUp!;
  },

  login: async (input: LoginInput) => {
    const data = await graphqlClient.mutation<AuthResponse>(
      LOGIN_MUTATION,
      input,
    );
    return data.login!;
  },
};
