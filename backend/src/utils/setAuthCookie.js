export const setAuthCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true, //preventing client side js from accessing the cookie it helps in the protection of (XSS) aka it's only sent in the http requests not accessible in document.cookie
        secure: true, //only sent over https connections
        sameSite: 'None',    
        maxAge: 7 * 24 * 60 * 60 * 1000, //
        path: '/',
      });
  };
