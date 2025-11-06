import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs-react";
import db from "../../../../../prisma/db";

export const options = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,

  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'E-mail',
          type: 'email',
          placeholder: 'Digite seu e-mail'
        },
        password: {
          label: 'Senha',
          type: 'password',
          placeholder: 'Digite sua senha!'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const foundUser = await db.user.findUnique({
            where: { email: credentials.email }
          });

          if (foundUser && foundUser.password) {
            const passMatch = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );

            if (passMatch) {
              // Retorne apenas os dados necessários para o callback 'jwt'
              return {
                id: foundUser.id.toString(), // id como string é mais seguro
                name: foundUser.name,
                email: foundUser.email,
              };
            }
          }
        } catch (error) {
          console.log('Erro ao autorizar usuário', error);
        }
        return null; // Retorna null se o usuário não for encontrado ou a senha estiver errada
      }
    }),
  ],
  callbacks: {
    // 2. CORRIJA a lógica do callback 'jwt'
    async jwt({ token, user }) {
      // 'user' só está disponível no login inicial.
      // Se for o login inicial, adicione os dados ao token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.trialExpiresAt = user.trialExpiresAt;
      }
      // Nas requisições seguintes, o token já enriquecido é retornado.
      return token;
    },

    async session({ session, token }) {

      const user = await db.user.findUnique({
        where: { id: parseInt(token.sub, 10) },
      });
      // Transfira os dados do token para o objeto de sessão
      if (user) {
        session.user.id = user.id;

      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    // Não existe 'signOn' por padrão, a menos que você tenha uma página customizada.
    // Se for uma página de registro, é melhor lidar com ela separadamente.
  }
};
